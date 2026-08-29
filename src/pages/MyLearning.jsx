import { useEffect, useState } from 'react'
import { exams, examList } from '../data/examData.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { listAttempts, summarizeAttempts } from '../services/attemptsService.js'
import { listTests } from '../services/testsService.js'
import ExamIcon from '../components/ExamIcon.jsx'
import { IconClock } from '../components/Icons.jsx'

function formatShortDate(iso) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
}

// Simple hand-rolled line chart — no charting library is installed in
// this project, and one number series like this doesn't need one.
function ProgressChart({ data }) {
  const w = 560
  const h = 200
  const padding = 32
  const stepX = data.length > 1 ? (w - padding * 2) / (data.length - 1) : 0
  const points = data.map((d, i) => ({
    ...d,
    x: padding + i * stepX,
    y: h - padding - (d.scorePercent / 100) * (h - padding * 2),
  }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="progress-chart" role="img" aria-label="Динамика результатов по последним пробникам">
      {[0, 25, 50, 75, 100].map((v) => {
        const y = h - padding - (v / 100) * (h - padding * 2)
        return (
          <g key={v}>
            <line x1={padding} y1={y} x2={w - padding} y2={y} stroke="#E6EAF2" strokeWidth="1" />
            <text x={4} y={y + 3} fontSize="10" fill="#7A8699">{v}%</text>
          </g>
        )
      })}
      <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4.5" fill="var(--primary)" stroke="#fff" strokeWidth="1.5" />
          <text x={p.x} y={h - 8} fontSize="10" textAnchor="middle" fill="#7A8699">{formatShortDate(p.date)}</text>
        </g>
      ))}
    </svg>
  )
}

export default function MyLearning() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [attempts, setAttempts] = useState([])
  const [subjectProgress, setSubjectProgress] = useState([])

  useEffect(() => {
    if (!user) {
      setAttempts([])
      setSubjectProgress([])
      setLoading(false)
      return undefined
    }
    let cancelled = false
    setLoading(true)
    Promise.all([listAttempts(user.id), Promise.all(examList.map((e) => listTests(e.key)))]).then(
      ([attemptsList, testsByExam]) => {
        if (cancelled) return
        setAttempts(attemptsList)
        setSubjectProgress(
          examList.map((e, i) => {
            // Real practice tests only — excludes oral (no scoring yet)
            // and models (demonstrations, not something to "complete").
            const totalTests = testsByExam[i].filter((t) => t.format !== 'oral' && !t.isModel).length
            const examAttempts = attemptsList.filter((a) => a.examKey === e.key)
            return { examKey: e.key, ...summarizeAttempts(examAttempts, totalTests) }
          })
        )
        setLoading(false)
      }
    )
    return () => {
      cancelled = true
    }
  }, [user])

  const recentAttempts = attempts.slice(0, 5)
  const chartData = [...attempts]
    .reverse()
    .filter((a) => a.scorePercent != null)
    .slice(-10)
    .map((a) => ({ date: a.completedAt, scorePercent: a.scorePercent }))

  return (
    <div className="mylearning-page">
      <div className="admin-header">
        <div>
          <h1>Мой прогресс</h1>
          <p>Личный прогресс по выбранным предметам.</p>
        </div>
      </div>

      {!user ? (
        <p className="admin-note">Войдите, чтобы видеть свой прогресс по пробникам.</p>
      ) : loading ? (
        <p className="admin-note">Загрузка…</p>
      ) : (
        <div className="mylearning-grid">
          <section className="widget-card">
            <h2>Прогресс по предметам</h2>
            <div className="subject-progress-list">
              {subjectProgress.map((p) => {
                const exam = exams[p.examKey]
                const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0
                return (
                  <div className="subject-progress-row" key={p.examKey}>
                    <div className="subject-progress-head">
                      <span className="subject-progress-icon" style={{ background: exam.color }}>
                        <ExamIcon examKey={p.examKey} size={15} />
                      </span>
                      <span className="subject-progress-label">{exam.label}</span>
                      <span className="subject-progress-count">{p.completed} из {p.total}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: exam.color }} />
                    </div>
                    <div className="subject-progress-meta">
                      {p.completed > 0 ? (
                        <><IconClock size={14} /> Среднее время на пробник: {p.avgMinutes} мин</>
                      ) : (
                        'Пока не пройдено ни одного пробника'
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="widget-card">
            <h2>Последние пробники</h2>
            {recentAttempts.length === 0 ? (
              <p className="admin-note">Вы ещё не завершали ни одного пробника — они появятся здесь.</p>
            ) : (
              <ul className="recent-list">
                {recentAttempts.map((a) => {
                  const exam = exams[a.examKey]
                  return (
                    <li className="recent-item" key={a.id}>
                      <span className="recent-badge" style={{ background: exam.color }}>{exam.label}</span>
                      <span className="recent-title">{a.testTitle}</span>
                      <span className="recent-score">{a.scorePercent != null ? `${a.scorePercent}%` : '—'}</span>
                      <span className="recent-date">{formatShortDate(a.completedAt)}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className="widget-card wide">
            <h2>Динамика результатов</h2>
            {chartData.length < 2 ? (
              <p className="admin-note">Пройдите хотя бы два пробника, чтобы увидеть динамику результатов.</p>
            ) : (
              <ProgressChart data={chartData} />
            )}
          </section>
        </div>
      )}
    </div>
  )
}
