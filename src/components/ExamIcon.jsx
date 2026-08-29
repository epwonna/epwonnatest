// One icon per exam type — math gets a document/grid icon, both language
// exams (EPD/EPE) share a chat-bubble icon. Used with color="white" on a
// solid-colored circle (homepage direction cards) and with color={exam
// accent} on a light-tinted circle (test cards, test detail page).
export default function ExamIcon({ examKey, color = 'white', size = 24 }) {
  const stroke = { stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }

  if (examKey === 'epm') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h2M12 11h2M16 11h.01M8 15h2M12 15h2M16 15h.01" />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
      <path d="M8 9h.01M12 9h4M8 13h6" />
      <rect x="3" y="4" width="18" height="14" rx="3" />
      <path d="M8 18l-2 3v-3" />
    </svg>
  )
}
