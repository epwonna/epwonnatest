import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { exams } from '../data/examData.js'
import { getTest } from '../services/testsService.js'
import { saveEssaySubmission } from '../services/essaysService.js'
import { saveAttempt } from '../services/attemptsService.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import QuestionImage from '../components/QuestionImage.jsx'
import QuestionAnswerInput from '../components/QuestionAnswerInput.jsx'
import FloatingPassageWindow from '../components/FloatingPassageWindow.jsx'
import { getVerdict, hasAnswer, isAutoGraded, defaultValue } from '../utils/grading.js'
import { pluralizeRu } from '../utils/pluralize.js'

function formatTime(totalSeconds) {
  const s = Math.max(0, totalSeconds)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

const MICROLABEL_BY_TYPE = {
  multiple_choice: 'Варианты ответов (можно выбрать несколько)',
  numeric: 'Ваш ответ',
  true_false: 'Отметьте верно или неверно для каждого утверждения',
  heading_match: 'Ваш ответ',
  short_answer: 'Ваш ответ',
  cloze: 'Заполните пропуски в тексте',
  qa_table: 'Заполните таблицу',
  tf_table: 'Отметьте верно/неверно и укажите доказательное предложение',
  free_text: 'Ваш ответ',
  essay_choice: 'Выберите тему и напишите текст',
  multi_part: 'Ответьте на все пункты',
}

// Groups questions by their `category` field (see supabase/schema.sql) while
// preserving first-seen order, so the sidebar shows "Часть А, Часть Б"
// or "Чтение, Грамматика, Письмо" in a sensible order without needing a
// separate config for it — the question data is the source of truth.
// The written exam always has the same fixed section order regardless of
// which order the questions themselves were added to the test in — sort
// groups by this instead of insertion order. Anything not listed here
// (a category typo, or a future section) just falls in after the known
// ones, in whatever order it was first seen.
const CATEGORY_ORDER = ['Часть А', 'Часть Б', 'Чтение', 'Аудирование', 'Грамматика', 'Письмо']

function groupByCategory(questions) {
  const groups = []
  const byName = new Map()
  questions.forEach((q, i) => {
    const name = q.category || 'Вопросы'
    if (!byName.has(name)) {
      const group = { name, items: [] }
      byName.set(name, group)
      groups.push(group)
    }
    byName.get(name).items.push({ question: q, index: i })
  })
  return groups.sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.name)
    const bi = CATEGORY_ORDER.indexOf(b.name)
    return (ai === -1 ? CATEGORY_ORDER.length : ai) - (bi === -1 ? CATEGORY_ORDER.length : bi)
  })
}

export default function TestPage({ examKey }) {
  const { testId } = useParams()
  const navigate = useNavigate()
  const exam = exams[examKey]
  const { user } = useAuth()

  const [test, setTest] = useState(undefined) // undefined = loading, null = not found
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setTest(undefined)
    getTest(examKey, testId).then((data) => {
      if (!cancelled) {
        setTest(data)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [examKey, testId])

  const questions = test ? test.questions : []
  const totalSeconds = (test?.durationMinutes || exam.timeLimitMinutes || 45) * 60

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { [questionId]: <shape depends on question.type> }
  // Which questions have been submitted via "Ответить". Until a question's
  // id is in this set, no correctness info is shown anywhere for it — not
  // on the inputs, not in the sidebar, not in the feedback banner — per
  // the spec: the person must not be able to tell right from wrong before
  // pressing "Ответить".
  const [checkedIds, setCheckedIds] = useState(() => new Set())
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [paused, setPaused] = useState(false)
  const [finished, setFinished] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const intervalRef = useRef(null)

  // Which half of the right-hand panel is showing: the reading passage or
  // the question. Defaults to the passage the *first* time a person
  // reaches a given text (they need to read it), and to the question for
  // every later question that shares that same text (they've already
  // seen it, and probably want the question in front of them by default
  // instead).
  const [view, setView] = useState('question')
  // The passage can also be popped out into a free-floating, draggable,
  // resizable window instead of living inside the panel — see
  // FloatingPassageWindow.jsx. Independent of `view`.
  const [floatingOpen, setFloatingOpen] = useState(false)
  const currentQuestionForView = questions[index]
  const currentPassageIdForView = currentQuestionForView?.passageId

  useEffect(() => {
    if (!currentPassageIdForView) {
      setView('question')
      setFloatingOpen(false)
      return
    }
    const firstIdx = questions.findIndex((q) => q.passageId === currentPassageIdForView)
    setView(questions[firstIdx]?.id === currentQuestionForView?.id ? 'text' : 'question')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionForView?.id])

  useEffect(() => {
    if (test) setSecondsLeft(totalSeconds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test])

  useEffect(() => {
    if (!test || paused || finished) return undefined
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          lockCurrentIfComplete()
          if (user) {
            const gradedTotal = questions.length - ungradedCount
            const scorePercent = gradedTotal > 0 ? Math.round(((correctCount + partialCount * 0.5) / gradedTotal) * 100) : null
            saveAttempt({
              userId: user.id,
              testId: test.id,
              examKey,
              testTitle: test.title,
              scorePercent,
              correctCount,
              partialCount,
              incorrectCount,
              ungradedCount,
              totalQuestions: questions.length,
              durationSeconds: totalSeconds,
            })
          }
          setFinished(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test, paused, finished])

  if (loading) {
    return <div className="tests-empty">Загрузка пробника…</div>
  }

  if (!test) {
    return (
      <div className="test-missing">
        <h1>Пробник не найден</h1>
        <p>Возможно, ссылка устарела.</p>
        <Link className="btn btn-primary" to={`/${examKey}`}>Вернуться к пробникам</Link>
      </div>
    )
  }

  // Oral-phase tests are a completely different flow (choose a card/photo,
  // prepare, present) — see OralTestPage.jsx and the ТЗ note in
  // supabase/schema.sql. This route should only ever be reached for written
  // (quiz-style) tests; redirect just in case.
  if (test.format === 'oral') {
    return (
      <div className="test-missing">
        <h1>{test.title}</h1>
        <p>Это устная часть — она проходит в отдельном формате.</p>
        <Link className="btn btn-primary" to={`/${examKey}/oral/${test.id}`}>Перейти к устной части</Link>
      </div>
    )
  }

  const question = questions[index]
  const value = answers[question.id] ?? defaultValue(question.type)
  const isChecked = checkedIds.has(question.id)
  const verdict = isChecked ? getVerdict(question, value) : null
  const groups = groupByCategory(questions)
  // The shared reading/listening passage this question belongs to, if
  // any — looked up by id, never embedded in the question itself, so it
  // stays on screen across every question that points at it (see the
  // schema.sql comment on tests.passages).
  const passage = question.passageId ? test.passages?.find((p) => p.id === question.passageId) : null

  function verdictFor(q) {
    if (!checkedIds.has(q.id)) return 'unanswered'
    return getVerdict(q, answers[q.id] ?? defaultValue(q.type))
  }

  const correctCount = questions.filter((q) => verdictFor(q) === 'correct').length
  const partialCount = questions.filter((q) => verdictFor(q) === 'partial').length
  const incorrectCount = questions.filter((q) => verdictFor(q) === 'incorrect').length
  const ungradedCount = questions.filter((q) => verdictFor(q) === 'ungraded').length
  const uncheckedCount = questions.length - checkedIds.size
  const answeredCount = checkedIds.size

  function setValue(next) {
    setAnswers((prev) => ({ ...prev, [question.id]: next }))
  }

  // Locks (and grades) the question currently on screen, but only if
  // every field on it has something in it — never locks a half-filled
  // question just because the person navigated away from it. This is
  // the only way a question becomes checked now; there's no separate
  // "Ответить" button anymore, answers just save as you type and lock
  // in once you've finished the question and moved on.
  function lockCurrentIfComplete() {
    if (hasAnswer(question, value) && !checkedIds.has(question.id)) {
      setCheckedIds((prev) => new Set(prev).add(question.id))
      if (question.type === 'essay_choice' && user) {
        const chosen = question.essayChoice.options.find((o) => o.id === value.choice)
        saveEssaySubmission({
          userId: user.id,
          testId: test.id,
          questionId: question.id,
          examKey,
          choiceId: value.choice,
          choiceTitle: chosen?.title,
          text: value.text,
        }).catch(() => {})
      }
      return true
    }
    return false
  }

  function goTo(i) {
    lockCurrentIfComplete()
    setIndex(Math.min(Math.max(i, 0), questions.length - 1))
  }

  function handleFinish() {
    const justLocked = lockCurrentIfComplete()
    const remainingUnchecked = uncheckedCount - (justLocked ? 1 : 0)
    if (remainingUnchecked > 0) {
      const ok = window.confirm(
        `Без ответа остал${remainingUnchecked === 1 ? 'ся' : 'ось'} ${remainingUnchecked} ${pluralizeRu(remainingUnchecked, ['вопрос', 'вопроса', 'вопросов'])} из ${questions.length}. Всё равно завершить тест?`
      )
      if (!ok) return
    }
    if (user) {
      const gradedTotal = questions.length - ungradedCount
      const scorePercent = gradedTotal > 0 ? Math.round(((correctCount + partialCount * 0.5) / gradedTotal) * 100) : null
      saveAttempt({
        userId: user.id,
        testId: test.id,
        examKey,
        testTitle: test.title,
        scorePercent,
        correctCount,
        partialCount,
        incorrectCount,
        ungradedCount,
        totalQuestions: questions.length,
        durationSeconds: totalSeconds - secondsLeft,
      })
    }
    setFinished(true)
  }

  function restart() {
    setAnswers({})
    setCheckedIds(new Set())
    setIndex(0)
    setSecondsLeft(totalSeconds)
    setPaused(false)
    setFinished(false)
  }

  if (finished) {
    const timeSpent = totalSeconds - secondsLeft
    return (
      <div className="test-results">
        <div className="test-results-score" style={{ background: exam.color }}>
          {correctCount} / {questions.length}
        </div>
        <h1>Тест завершён</h1>
        <p>
          Верных ответов: <b>{correctCount}</b>, частично верных: <b>{partialCount}</b>, неверных: <b>{incorrectCount}</b>
          {ungradedCount > 0 && <> , не проверяется автоматически: <b>{ungradedCount}</b></>}
          {uncheckedCount > 0 && <> , без ответа: <b>{uncheckedCount}</b></>} из {questions.length}.
          Затрачено времени: <b>{formatTime(timeSpent)}</b>.
        </p>
        <div className="test-results-actions">
          <button className="btn btn-primary" onClick={restart}>Пройти ещё раз</button>
          <Link className="btn btn-outline" to={`/${examKey}`}>Вернуться к пробникам</Link>
        </div>
      </div>
    )
  }

  const isLast = index === questions.length - 1
  const progressPct = Math.round((answeredCount / questions.length) * 100)

  const questionCore = (
    <>
      <div className="test-microlabel">Вопрос</div>
      <h1 className="test-question-text">{question.text}</h1>

      {question.explanation && <p className="test-explanation">{question.explanation}</p>}

      {question.image && <QuestionImage name={question.image} />}

      <div className="test-microlabel test-options-label">{MICROLABEL_BY_TYPE[question.type] || MICROLABEL_BY_TYPE.multiple_choice}</div>

      <QuestionAnswerInput question={question} value={value} onChange={setValue} checked={isChecked} verdict={verdict} />

      {!isChecked && question.type !== 'essay_choice' && (
        <p className="test-autosave-hint">Ответ сохранится сам, когда вы перейдёте к следующему вопросу.</p>
      )}

      {verdict === 'correct' && <div className="test-feedback correct">Верно! Так держать.</div>}
      {verdict === 'partial' && <div className="test-feedback partial">Частично верно — упущенные или лишние места отмечены оранжевым.</div>}
      {verdict === 'incorrect' && <div className="test-feedback incorrect">Неверно. {isAutoGraded(question) ? 'Правильный ответ показан выше.' : ''}</div>}
      {verdict === 'ungraded' && <div className="test-feedback ungraded">Ответ сохранён. Это задание не проверяется автоматически.</div>}
    </>
  )

  const passageCore = passage && (
    <>
      {passage.title && <h3>{passage.title}</h3>}
      <div className="test-passage-text">{passage.text}</div>
    </>
  )

  return (
    <>
      <div className={'test-page' + (sidebarCollapsed ? ' nav-collapsed' : '')}>
        <aside className={'test-nav' + (sidebarCollapsed ? ' collapsed' : '')}>
          {sidebarCollapsed ? (
            <button
              type="button"
              className="test-nav-expand"
              onClick={() => setSidebarCollapsed(false)}
              aria-label="Развернуть список вопросов"
              title="Развернуть список вопросов"
            >
              »
            </button>
          ) : (
            <>
              <div className="test-nav-top">
                <div>
                  <button className="test-nav-back" onClick={() => navigate(`/${examKey}`)}>
                    ← {exam.label}
                  </button>
                  <h2 className="test-nav-title">Вопросы</h2>
                </div>
                <div className="test-timer-compact">
                  <span className={'test-timer-value' + (secondsLeft <= 60 ? ' low' : '')}>{formatTime(secondsLeft)}</span>
                  <button className="test-timer-pause" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Продолжить' : 'Пауза'}>
                    {paused ? '▶' : '❚❚'}
                  </button>
                </div>
              </div>

              <div className="test-nav-progress-label">Отвечено {answeredCount} из {questions.length}</div>
              <div className="test-progress-bar">
                <div className="test-progress-bar-fill" style={{ width: `${progressPct}%`, background: exam.color }} />
              </div>
              {paused && <div className="test-paused-note">Таймер на паузе</div>}

              {groups.map((group) => (
                <div className="question-group" key={group.name}>
                  <div className="question-group-label">{group.name}</div>
                  <div className="question-grid">
                    {group.items.map(({ question: q, index: i }) => {
                      const classes = ['q-num', verdictFor(q)]
                      if (i === index) classes.push('current')
                      return (
                        <button key={q.id} className={classes.join(' ')} onClick={() => goTo(i)}>
                          {i + 1}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              <button className="btn btn-outline test-finish-btn" onClick={handleFinish}>
                Завершить тест
              </button>

              <button
                type="button"
                className="test-nav-collapse"
                onClick={() => setSidebarCollapsed(true)}
                title="Свернуть список вопросов"
              >
                « Свернуть меню
              </button>
            </>
          )}
        </aside>

        <section className="test-main">
          {passage && (
            <div className="test-view-switch">
              <button type="button" className={'test-view-tab' + (view === 'text' ? ' active' : '')} onClick={() => setView('text')}>
                📖 Текст
              </button>
              <button type="button" className={'test-view-tab' + (view === 'question' ? ' active' : '')} onClick={() => setView('question')}>
                Задание
              </button>
              <button
                type="button"
                className={'test-view-tab test-view-float-btn' + (floatingOpen ? ' active' : '')}
                onClick={() => {
                  setFloatingOpen(true)
                  setView('question')
                }}
                title="Открыть текст в отдельном окне — можно двигать и менять размер"
                aria-label="Открыть текст в отдельном окне"
              >
                ⧉
              </button>
            </div>
          )}

          {passage && view === 'text' ? (
            <div className="test-passage-full">{passageCore}</div>
          ) : (
            questionCore
          )}

          <div className="test-actions">
            <button className="btn btn-outline" disabled={index === 0} onClick={() => goTo(index - 1)}>
              ← Назад
            </button>
            {isLast ? (
              <button className="btn btn-primary" onClick={handleFinish}>
                Завершить тест
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => goTo(index + 1)}>
                Далее →
              </button>
            )}
          </div>
        </section>
      </div>

      {floatingOpen && passage && <FloatingPassageWindow passage={passage} onClose={() => setFloatingOpen(false)} />}
    </>
  )
}
