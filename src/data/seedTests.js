// Initial content for the `mock_tests` table stand-in (see comment block
// in src/data/examData.js for the full schema mapping). This file is only
// ever read once, by src/services/testsService.js, which deep-clones it
// into an in-memory store on startup — nothing here is mutated directly.
//
// Each test's `questions` array is its own independent copy (not a shared
// reference) even where the sample content is similar, because once the
// admin panel edits one test's questions, that must never leak into
// another test that happens to reuse the same starter content.
//
// Question shape:
//   id, text, category (groups questions in the left sidebar on the test
//   page — e.g. 'Часть А'/'Часть Б' for EPM, 'Чтение'/'Грамматика'/'Письмо'
//   for the EPD/EPE written phase), image (optional — a named demo
//   diagram like 'triangle-abc', or a real image URL / data: URI once
//   uploaded via the admin panel), explanation (optional, shown in small
//   grey text under the question), options: [{ id, text }],
//   correctOptionIds: [id, ...]
// `multiple` is intentionally NOT stored — TestPage derives single- vs
// multi-answer straight from `correctOptionIds.length`, so the admin
// panel never has to keep a separate flag in sync with the checkboxes.
//
// NOTE: `category` here is a first pass at what the full admin-panel ТЗ
// calls "categories per phase" (written EPD/EPE: Чтение/Грамматика/Письмо;
// EPM: Часть А/Часть Б; oral phase: separate stubbed flow entirely). The
// admin panel doesn't have a category picker yet — that, plus the
// written/oral phase switch on /epd and /epe, is the next step.

function q(partial) {
  return { image: undefined, explanation: undefined, type: 'multiple_choice', ...partial }
}

const epmQuestions = [
  q({
    id: 'epm-q1',
    text: 'Чему равна производная функции f(x) = 3x² + 2x?',
    category: 'Часть А',
    explanation: 'Используйте правило степени: производная xⁿ равна n·xⁿ⁻¹.',
    options: [
      { id: 'a', text: '6x + 2' },
      { id: 'b', text: '3x + 2' },
      { id: 'c', text: '6x' },
      { id: 'd', text: 'x² + 2x' },
    ],
    correctOptionIds: ['a'],
  }),
  q({
    id: 'epm-q2',
    text: 'Какие из следующих чисел являются простыми? Выберите все подходящие варианты.',
    category: 'Часть А',
    options: [
      { id: 'a', text: '2' },
      { id: 'b', text: '7' },
      { id: 'c', text: '9' },
      { id: 'd', text: '11' },
      { id: 'e', text: '15' },
    ],
    correctOptionIds: ['a', 'b', 'd'],
  }),
  q({
    id: 'epm-q3',
    text: 'На рисунке изображён треугольник ABC. Чему равен угол C, если угол A = 50°, а угол B = 70°?',
    category: 'Часть Б',
    image: 'triangle-abc',
    explanation: 'Сумма углов треугольника всегда равна 180°.',
    options: [
      { id: 'a', text: '60°' },
      { id: 'b', text: '50°' },
      { id: 'c', text: '70°' },
      { id: 'd', text: '80°' },
    ],
    correctOptionIds: ['a'],
  }),
  q({
    id: 'epm-q4',
    text: 'Решите уравнение: 2x − 6 = 0.',
    category: 'Часть А',
    options: [
      { id: 'a', text: 'x = 3' },
      { id: 'b', text: 'x = −3' },
      { id: 'c', text: 'x = 6' },
      { id: 'd', text: 'x = 2' },
    ],
    correctOptionIds: ['a'],
  }),
  q({
    id: 'epm-q5',
    text: 'Какие из чисел являются решением неравенства x² ≤ 9? Выберите все подходящие варианты.',
    category: 'Часть Б',
    options: [
      { id: 'a', text: '−3' },
      { id: 'b', text: '0' },
      { id: 'c', text: '3' },
      { id: 'd', text: '4' },
      { id: 'e', text: '−4' },
    ],
    correctOptionIds: ['a', 'b', 'c'],
  }),
  q({
    id: 'epm-q6',
    text: 'Чему равна площадь круга радиусом 4 см? (используйте π ≈ 3.14)',
    category: 'Часть Б',
    options: [
      { id: 'a', text: '50.24 см²' },
      { id: 'b', text: '25.12 см²' },
      { id: 'c', text: '12.56 см²' },
      { id: 'd', text: '100.48 см²' },
    ],
    correctOptionIds: ['a'],
  }),
  q({
    id: 'epm-q7',
    type: 'numeric',
    category: 'Часть А',
    text: 'Чему равно значение выражения 12,5 + 7,3 − 4,8? Введите ответ в виде десятичной дроби.',
    correctValue: 15.0,
    tolerance: 0.1,
  }),
  q({
    id: 'epm-q8',
    type: 'numeric',
    category: 'Часть Б',
    text: 'Найдите значение функции f(x) = 2x² − 3x при x = 2,5. Введите ответ в виде десятичной дроби.',
    correctValue: 5.0,
    tolerance: 0.1,
  }),
]

const epdQuestions = [
  q({
    id: 'epd-q1',
    text: 'Wählen Sie die richtige Form: Ich ___ heute ins Kino.',
    category: 'Грамматика',
    explanation: 'В настоящем времени с "ich" глагол оканчивается на -e.',
    options: [
      { id: 'a', text: 'gehe' },
      { id: 'b', text: 'geht' },
      { id: 'c', text: 'gehst' },
      { id: 'd', text: 'gehen' },
    ],
    correctOptionIds: ['a'],
  }),
  q({
    id: 'epd-q2',
    text: 'Welche Wörter sind Artikel im Deutschen? Wählen Sie alle passenden Antworten.',
    category: 'Грамматика',
    options: [
      { id: 'a', text: 'der' },
      { id: 'b', text: 'die' },
      { id: 'c', text: 'das' },
      { id: 'd', text: 'und' },
      { id: 'e', text: 'ist' },
    ],
    correctOptionIds: ['a', 'b', 'c'],
  }),
  q({
    id: 'epd-q3',
    text: "Was bedeutet 'die Bibliothek' auf Russisch?",
    category: 'Чтение',
    options: [
      { id: 'a', text: 'библиотека' },
      { id: 'b', text: 'больница' },
      { id: 'c', text: 'школа' },
      { id: 'd', text: 'магазин' },
    ],
    correctOptionIds: ['a'],
  }),
  q({
    id: 'epd-q4',
    text: 'Ergänzen Sie: Er ___ 20 Jahre alt.',
    category: 'Чтение',
    options: [
      { id: 'a', text: 'ist' },
      { id: 'b', text: 'hat' },
      { id: 'c', text: 'sein' },
      { id: 'd', text: 'bin' },
    ],
    correctOptionIds: ['a'],
  }),
  q({
    id: 'epd-q5',
    text: 'Welche Sätze sind grammatisch korrekt? Wählen Sie alle passenden Antworten.',
    category: 'Письмо',
    options: [
      { id: 'a', text: 'Ich bin müde.' },
      { id: 'b', text: 'Ich bin müde sein.' },
      { id: 'c', text: 'Sie hat ein Buch.' },
      { id: 'd', text: 'Er gehen nach Hause.' },
      { id: 'e', text: 'Wir sind Studenten.' },
    ],
    correctOptionIds: ['a', 'c', 'e'],
  }),
  q({
    id: 'epd-q6',
    type: 'true_false',
    category: 'Чтение',
    text: 'Text: "Anna arbeitet seit drei Jahren als Lehrerin in Wien. Sie mag ihren Beruf, findet die Arbeit aber manchmal anstrengend, weil die Klassen sehr groß sind." Richtig oder falsch?',
    statements: [
      { id: 's1', text: 'Anna arbeitet in Wien.', correct: true },
      { id: 's2', text: 'Anna arbeitet seit fünf Jahren als Lehrerin.', correct: false },
      { id: 's3', text: 'Die Klassen sind sehr groß.', correct: true },
    ],
  }),
  q({
    id: 'epd-q7',
    type: 'heading_match',
    category: 'Чтение',
    text: 'Подберите заголовки A–D к четырём абзацам текста об истории венской кофейни (в порядке следования абзацев).',
    explanation: 'A — Первые кофейни Вены; B — Кофейня как место встреч; C — Традиции подачи кофе; D — Кофейни сегодня.',
    correctSequence: 'A, B, C, D',
  }),
  q({
    id: 'epd-q8',
    type: 'free_text',
    category: 'Письмо',
    text: 'Schreiben Sie eine kurze E-Mail (60–80 Wörter) an einen Freund/eine Freundin: Beschreiben Sie Ihren letzten Urlaub.',
  }),
]

const epeQuestions = [
  q({
    id: 'epe-q1',
    text: 'Choose the correct form: She ___ to school every day.',
    category: 'Грамматика',
    options: [
      { id: 'a', text: 'walks' },
      { id: 'b', text: 'walk' },
      { id: 'c', text: 'walking' },
      { id: 'd', text: 'walked' },
    ],
    correctOptionIds: ['a'],
  }),
  q({
    id: 'epe-q2',
    text: 'Which words are prepositions? Select all that apply.',
    category: 'Грамматика',
    options: [
      { id: 'a', text: 'in' },
      { id: 'b', text: 'on' },
      { id: 'c', text: 'quickly' },
      { id: 'd', text: 'under' },
      { id: 'e', text: 'happy' },
    ],
    correctOptionIds: ['a', 'b', 'd'],
  }),
  q({
    id: 'epe-q3',
    text: "What is the synonym of 'happy'?",
    category: 'Чтение',
    options: [
      { id: 'a', text: 'joyful' },
      { id: 'b', text: 'sad' },
      { id: 'c', text: 'angry' },
      { id: 'd', text: 'tired' },
    ],
    correctOptionIds: ['a'],
  }),
  q({
    id: 'epe-q4',
    text: 'Complete: If it rains, I ___ stay home.',
    category: 'Чтение',
    options: [
      { id: 'a', text: 'will' },
      { id: 'b', text: 'would' },
      { id: 'c', text: 'was' },
      { id: 'd', text: 'am' },
    ],
    correctOptionIds: ['a'],
  }),
  q({
    id: 'epe-q5',
    text: 'Which sentences are in the past tense? Select all that apply.',
    category: 'Письмо',
    options: [
      { id: 'a', text: 'She went to the market.' },
      { id: 'b', text: 'He is reading a book.' },
      { id: 'c', text: 'They played football.' },
      { id: 'd', text: 'We will travel soon.' },
      { id: 'e', text: 'I bought a new phone.' },
    ],
    correctOptionIds: ['a', 'c', 'e'],
  }),
  q({
    id: 'epe-q6',
    type: 'true_false',
    category: 'Чтение',
    text: 'Text: "Anna has worked as a teacher in Vienna for three years. She enjoys her job, but sometimes finds it tiring because the classes are very large." True or false?',
    statements: [
      { id: 's1', text: 'Anna works in Vienna.', correct: true },
      { id: 's2', text: 'Anna has been a teacher for five years.', correct: false },
      { id: 's3', text: 'The classes are very large.', correct: true },
    ],
  }),
  q({
    id: 'epe-q7',
    type: 'heading_match',
    category: 'Чтение',
    text: 'Match headings A–D to the four paragraphs of a text about the history of coffee houses (in paragraph order).',
    explanation: 'A — Early coffee houses; B — A place to meet; C — Serving traditions; D — Coffee houses today.',
    correctSequence: 'A, B, C, D',
  }),
  q({
    id: 'epe-q8',
    type: 'free_text',
    category: 'Письмо',
    text: 'Write a short response to a blog post (80–100 words) about your favourite way to spend a weekend.',
  }),
]

// Gives each test its own independent copy of a question bank, so editing
// one test's questions in the admin panel can never mutate another test
// that happened to start from the same sample content.
function clone(questions) {
  return JSON.parse(JSON.stringify(questions))
}

const seedTests = {
  epm: [
    { id: 'epm-2026-10', title: 'Пробник 2026, октябрь', shortDescription: 'Официальный пробный экзамен по математике. Части A и B, с решениями.', fullDescription: 'Официальный пробный экзамен, который университет разослал абитуриентам перед вступительной кампанией 2026 года. Полностью соответствует формату настоящего экзамена: часть A без калькулятора и часть B с разрешёнными вспомогательными средствами.', isOfficial: true, topic: 'functions', year: 2026, durationMinutes: 180, questions: clone(epmQuestions) },
    { id: 'epm-2026-03', title: 'Пробник 2026, март', shortDescription: 'Официальный пробный экзамен по математике за весеннюю сессию.', fullDescription: 'Официальный пробник за весеннюю сессию 2026 года. Помогает потренироваться на заданиях по геометрии и повторить формулы перед экзаменом.', isOfficial: true, topic: 'geometry', year: 2026, durationMinutes: 180, questions: clone(epmQuestions) },
    { id: 'epm-2025-10', title: 'Пробник 2025, октябрь', shortDescription: 'Пробный экзамен прошлого года — хорошая база для тренировки.', fullDescription: 'Пробный экзамен прошлого года, который многие абитуриенты называют одним из самых близких по сложности к реальному экзамену.', isOfficial: true, topic: 'algebra', year: 2025, durationMinutes: 170, questions: clone(epmQuestions) },
    { id: 'epm-2025-03', title: 'Пробник 2025, март', shortDescription: 'Ещё один пробник для отработки типовых заданий части A.', fullDescription: 'Неофициальный пробник, собранный преподавателями для отработки типовых заданий части A — идеален для тренировки скорости решения без калькулятора.', isOfficial: false, topic: 'algebra', year: 2025, durationMinutes: 120, questions: clone(epmQuestions) },
    { id: 'epm-2024-10', title: 'Пробник 2024, октябрь', shortDescription: 'Классический набор заданий по функциям и геометрии.', fullDescription: 'Классический набор заданий по функциям и геометрии из осенней сессии 2024 года — подойдёт тем, кто хочет закрепить базовые темы.', isOfficial: true, topic: 'functions', year: 2024, durationMinutes: 175, questions: clone(epmQuestions) },
    { id: 'epm-2024-03', title: 'Пробник 2024, март', shortDescription: 'Задания на векторы, статистику и текстовые задачи.', fullDescription: 'Неофициальный пробник с акцентом на векторы, статистику и текстовые задачи — темы, которые часто вызывают трудности у абитуриентов.', isOfficial: false, topic: 'stats', year: 2024, durationMinutes: 110, questions: clone(epmQuestions) },
  ],
  epd: [
    { id: 'epd-reading', title: 'Пробник: чтение и грамматика', shortDescription: 'Подборка текстов и грамматических заданий уровня B2–C1.', fullDescription: 'Подборка текстов и грамматических заданий уровня B2–C1, максимально близких по формату к письменной части настоящего экзамена EPD.', isOfficial: true, format: 'written', topic: 'nutrition', year: 2026, durationMinutes: 60, questions: clone(epdQuestions) },
    {
      id: 'epd-oral',
      title: 'Устная часть',
      shortDescription: 'Монолог по карточке на выбор + спонтанное обсуждение фотографии.',
      fullDescription: 'Устная часть EPD из двух этапов: сначала вы выбираете одну из двух карточек (цитата или график) и готовите монолог, затем описываете и обсуждаете фотографию. Автоматическая проверка устного ответа появится позже — сейчас доступен только формат прохождения.',
      isOfficial: true,
      format: 'oral',
      topic: 'environment',
      year: 2026,
      durationMinutes: 40,
      questions: [],
      oralTask: {
        stages: [
          {
            id: 'stage1',
            title: 'Этап 1 — Монолог',
            kind: 'choice',
            instructions: 'Выберите одну из двух карточек и подготовьте краткое высказывание (2–3 минуты).',
            prepMinutes: 20,
            options: [
              {
                id: 'quote',
                label: 'Карточка с цитатой',
                kind: 'quote',
                content: '«Der Erfolg hat viele Väter, der Misserfolg ist ein Waisenkind.»',
                prompt: 'Обсудите это высказывание: согласны ли вы с ним? Приведите примеры из жизни.',
              },
              {
                id: 'chart',
                label: 'Карточка с графиком',
                kind: 'chart',
                prompt: 'Опишите график и проанализируйте основную тенденцию.',
              },
            ],
          },
          {
            id: 'stage2',
            title: 'Этап 2 — Спонтанная часть',
            kind: 'fixed',
            instructions: 'Опишите фотографию и будьте готовы обсудить её в формате диалога с экзаменатором.',
            prepMinutes: 0,
            materials: [{ id: 'photo1', kind: 'photo', label: 'Фотография для обсуждения' }],
            prompt: 'Опишите фотографию.',
          },
        ],
      },
    },
    { id: 'epd-writing', title: 'Пробник: письменная часть', shortDescription: 'Примеры сочинений и писем с разбором типичных ошибок.', fullDescription: 'Неофициальная подборка примеров сочинений и писем с разбором типичных ошибок — полезно перед письменной частью экзамена.', isOfficial: false, format: 'written', topic: 'economy', year: 2025, durationMinutes: 50, questions: clone(epdQuestions) },
    { id: 'epd-texts', title: 'Сборник текстов', shortDescription: 'Материалы по темам, часто встречающимся на экзамене.', fullDescription: 'Сборник текстов по темам, которые часто встречаются на экзамене — питание, окружающая среда, экономика.', isOfficial: false, format: 'written', topic: 'environment', year: 2025, durationMinutes: 45, questions: clone(epdQuestions) },
  ],
  epe: [
    { id: 'epe-reading', title: 'Пробник: чтение и грамматика', shortDescription: 'Подборка текстов и грамматических заданий по английскому.', fullDescription: 'Подборка текстов и грамматических заданий, максимально близких по формату к письменной части настоящего экзамена EPE.', isOfficial: true, format: 'written', topic: 'economy', year: 2026, durationMinutes: 60, questions: clone(epeQuestions) },
    {
      id: 'epe-oral',
      title: 'Устная часть',
      shortDescription: 'Сравнение двух фотографий с последующим обсуждением.',
      fullDescription: 'Устная часть EPE: вам предложат две фотографии для сравнения. 20 минут на подготовку, затем — представление ответа с вопросами экзаменатора. Автоматическая проверка устного ответа появится позже — сейчас доступен только формат прохождения.',
      isOfficial: true,
      format: 'oral',
      topic: 'nutrition',
      year: 2026,
      durationMinutes: 40,
      questions: [],
      oralTask: {
        stages: [
          {
            id: 'stage1',
            title: 'Сравнение фотографий',
            kind: 'fixed',
            instructions: 'Сравните две фотографии, а затем будьте готовы отвечать на вопросы экзаменатора.',
            prepMinutes: 20,
            materials: [
              { id: 'photo1', kind: 'photo', label: 'Фотография 1' },
              { id: 'photo2', kind: 'photo', label: 'Фотография 2' },
            ],
            prompt: 'Сравните две фотографии.',
          },
        ],
      },
    },
    { id: 'epe-writing', title: 'Пробник: письменная часть', shortDescription: 'Примеры эссе и писем с разбором структуры и ошибок.', fullDescription: 'Неофициальная подборка примеров эссе и писем с разбором структуры и типичных ошибок.', isOfficial: false, format: 'written', topic: 'environment', year: 2025, durationMinutes: 50, questions: clone(epeQuestions) },
    { id: 'epe-texts', title: 'Сборник текстов', shortDescription: 'Материалы по популярным темам экзамена EPE.', fullDescription: 'Сборник текстов по популярным темам экзамена EPE — питание, окружающая среда, экономика.', isOfficial: false, format: 'written', topic: 'nutrition', year: 2025, durationMinutes: 45, questions: clone(epeQuestions) },
  ],
}

export default seedTests
