import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { exams } from '../../data/examData.js'
import { listTests, deleteTest } from '../../services/testsService.js'
import { pluralizeRu } from '../../utils/pluralize.js'

export default function AdminExamTests({ examKey }) {
  const exam = exams[examKey]
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState(() => exam.phases?.[0]?.value ?? null)

  function reload() {
    setLoading(true)
    listTests(examKey).then((data) => {
      setTests(data)
      setLoading(false)
    })
  }

  useEffect(reload, [examKey])

  const visibleTests = useMemo(() => {
    if (!phase) return tests
    return tests.filter((t) => t.format === phase)
  }, [tests, phase])

  async function handleDelete(test) {
    if (!window.confirm(`Удалить пробник «${test.title}»? Это действие нельзя отменить.`)) return
    try {
      await deleteTest(examKey, test.id)
      reload()
    } catch (err) {
      window.alert(err.message || 'Не удалось удалить пробник. Проверьте подключение к базе данных.')
    }
  }

  const newTestLink = phase ? `/admin/${examKey}/new?format=${phase}` : `/admin/${examKey}/new`

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <Link className="admin-back" to="/admin">← Все разделы</Link>
          <h1>{exam.label} — пробники</h1>
          <p>{exam.homeTitle}</p>
        </div>
        <Link className="btn btn-primary" to={newTestLink}>+ Добавить пробник</Link>
      </div>

      {exam.phases && (
        <div className="phase-switch">
          {exam.phases.map((p) => (
            <button
              key={p.value}
              className={'phase-switch-btn' + (phase === p.value ? ' active' : '')}
              style={phase === p.value ? { background: exam.color } : undefined}
              onClick={() => setPhase(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="tests-empty">Загрузка…</div>
      ) : visibleTests.length === 0 ? (
        <div className="tests-empty">
          {tests.length === 0
            ? 'Пока нет ни одного пробника. Нажмите «Добавить пробник», чтобы создать первый.'
            : 'В этой части пока нет пробников.'}
        </div>
      ) : (
        <div className="admin-table">
          <div className={'admin-table-row admin-table-head' + (exam.phases ? ' with-phase' : '')}>
            <span>Название</span>
            <span>Вопросов</span>
            <span>Минут</span>
            <span>Тип</span>
            <span>Тема</span>
            <span>Год</span>
            {exam.phases && <span>Часть</span>}
            <span />
          </div>
          {visibleTests.map((test) => {
            const topic = exam.topics.find((t) => t.id === test.topic)
            const testPhase = exam.phases?.find((p) => p.value === test.format)
            return (
              <div className={'admin-table-row' + (exam.phases ? ' with-phase' : '')} key={test.id}>
                <span className="admin-table-title">{test.title}</span>
                <span>
                  {test.format === 'oral'
                    ? `${test.oralTask?.stages.length ?? 0} ${pluralizeRu(test.oralTask?.stages.length ?? 0, ['этап', 'этапа', 'этапов'])}`
                    : `${test.questions.length} ${pluralizeRu(test.questions.length, ['вопрос', 'вопроса', 'вопросов'])}`}
                </span>
                <span>{test.durationMinutes} мин</span>
                <span className={test.isOfficial ? 'admin-pill official' : 'admin-pill'}>
                  {test.isOfficial ? 'Официальный' : 'Неофициальный'}
                </span>
                <span>{topic ? topic.label : '—'}</span>
                <span>{test.year}</span>
                {exam.phases && <span>{testPhase ? testPhase.label : '—'}</span>}
                <span className="admin-table-actions">
                  <Link className="btn btn-outline" to={`/admin/${examKey}/${test.id}`}>Редактировать</Link>
                  <button className="admin-delete-btn" onClick={() => handleDelete(test)} aria-label="Удалить">✕</button>
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
