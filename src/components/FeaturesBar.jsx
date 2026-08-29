const FEATURES = [
  {
    title: 'Полные и актуальные материалы',
    desc: 'Всё, что нужно для успешной сдачи',
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <path d="M4 5c3-1.4 6.5-1.4 8 0v14c-1.5-1.4-5-1.4-8 0V5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M20 5c-3-1.4-6.5-1.4-8 0v14c1.5-1.4 5-1.4 8 0V5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Пробные экзамены',
    desc: 'Тренируйся и проверяй свои знания',
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Подробная теория',
    desc: 'Понятные объяснения по всем темам',
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <path d="M12 4 3 8l9 4 9-4-9-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M7 10.5V16c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-5.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: 'Вся информация об экзаменах EP',
    desc: 'Структура, требования, советы и другое',
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 11v6M12 8v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function FeaturesBar() {
  return (
    <div className="features-bar">
      {FEATURES.map((f) => (
        <div className="feature" key={f.title}>
          <div className="ico">{f.icon}</div>
          <div>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
