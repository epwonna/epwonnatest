// Placeholder data for the "Моё обучение" page widgets. There's no auth
// or persisted progress yet (see services/testsService.js), so this is
// hand-written sample data purely to preview the widget layout. Once
// user accounts + a `test_attempts` table exist in Supabase, this file
// gets replaced by a service call the same way tests/questions were.

export const mockSubjectProgress = [
  { examKey: 'epm', completed: 3, total: 6, avgMinutes: 132 },
  { examKey: 'epd', completed: 2, total: 4, avgMinutes: 48 },
  { examKey: 'epe', completed: 1, total: 4, avgMinutes: 41 },
]

export const mockRecentAttempts = [
  { examKey: 'epm', testTitle: 'Пробник 2026, март', scorePercent: 83, date: '2026-08-18' },
  { examKey: 'epd', testTitle: 'Пробник: чтение и грамматика', scorePercent: 90, date: '2026-08-12' },
  { examKey: 'epm', testTitle: 'Пробник 2025, октябрь', scorePercent: 67, date: '2026-08-05' },
  { examKey: 'epe', testTitle: 'Пробник: аудирование', scorePercent: 55, date: '2026-07-29' },
  { examKey: 'epm', testTitle: 'Пробник 2024, октябрь', scorePercent: 72, date: '2026-07-20' },
]

// Chronological (oldest → newest), drives the trend chart.
export const mockProgressHistory = [
  { date: '2026-07-20', scorePercent: 72 },
  { date: '2026-07-29', scorePercent: 55 },
  { date: '2026-08-05', scorePercent: 67 },
  { date: '2026-08-12', scorePercent: 90 },
  { date: '2026-08-18', scorePercent: 83 },
]
