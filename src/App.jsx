import { useEffect, useMemo, useRef, useState } from 'react'

const LEVELS = [
  { name: 'Starter', min: 0, color: '#ffd166' },
  { name: 'Explorer', min: 20, color: '#7bdff2' },
  { name: 'Super Star', min: 50, color: '#7ee081' },
  { name: 'Quiz Hero', min: 90, color: '#a78bfa' },
  { name: 'Alphabet King', min: 140, color: '#ff7eb6' }
]

const letterMap = {
  a: { word: 'Apple', emoji: '🍎' },
  b: { word: 'Ball', emoji: '⚽' },
  c: { word: 'Cat', emoji: '🐱' },
  d: { word: 'Dog', emoji: '🐶' },
  e: { word: 'Elephant', emoji: '🐘' },
  f: { word: 'Fish', emoji: '🐟' },
  g: { word: 'Giraffe', emoji: '🦒' },
  h: { word: 'Horse', emoji: '🐎' },
  i: { word: 'Ice Cream', emoji: '🍦' },
  j: { word: 'Jacket', emoji: '🧥' },
  k: { word: 'Kite', emoji: '🪁' },
  l: { word: 'Lion', emoji: '🦁' },
  m: { word: 'Mouse', emoji: '🐭' },
  n: { word: 'Nest', emoji: '🪺' },
  o: { word: 'Orange', emoji: '🍊' },
  p: { word: 'Pencil', emoji: '✏️' },
  q: { word: 'Queen', emoji: '👑' },
  r: { word: 'Rabbit', emoji: '🐇' },
  s: { word: 'Sun', emoji: '☀️' },
  t: { word: 'Tree', emoji: '🌳' },
  u: { word: 'Umbrella', emoji: '☂️' },
  v: { word: 'Violin', emoji: '🎻' },
  w: { word: 'Watermelon', emoji: '🍉' },
  x: { word: 'Xylophone', emoji: '🎼' },
  y: { word: 'Yogurt', emoji: '🥣' },
  z: { word: 'Zebra', emoji: '🦓' }
}

const numberMap = {
  1: { word: 'One', emoji: '🎯' },
  2: { word: 'Two', emoji: '👟' },
  3: { word: 'Three', emoji: '🍋' },
  4: { word: 'Four', emoji: '🧁' },
  5: { word: 'Five', emoji: '🧠' },
  6: { word: 'Six', emoji: '🌈' },
  7: { word: 'Seven', emoji: '🌙' },
  8: { word: 'Eight', emoji: '🎈' },
  9: { word: 'Nine', emoji: '⭐' },
  10: { word: 'Ten', emoji: '🎁' },
  11: { word: 'Eleven', emoji: '🪐' },
  12: { word: 'Twelve', emoji: '🎂' },
  13: { word: 'Thirteen', emoji: '🦄' },
  14: { word: 'Fourteen', emoji: '🧸' },
  15: { word: 'Fifteen', emoji: '🍰' },
  16: { word: 'Sixteen', emoji: '🌷' },
  17: { word: 'Seventeen', emoji: '🎀' },
  18: { word: 'Eighteen', emoji: '🚀' },
  19: { word: 'Nineteen', emoji: '💫' },
  20: { word: 'Twenty', emoji: '🌟' }
}

const allLetters = Object.entries(letterMap).map(([key, value]) => ({ key: key.toUpperCase(), ...value }))
const allNumbers = Object.entries(numberMap).map(([key, value]) => ({ key: Number(key), ...value }))

function getLevelInfo(points) {
  let level = LEVELS[0]
  for (const item of LEVELS) {
    if (points >= item.min) level = item
  }
  const levelIndex = LEVELS.findIndex((item) => item.name === level.name)
  const nextLevel = LEVELS[levelIndex + 1] || null
  const progressValue = nextLevel ? ((points - level.min) / (nextLevel.min - level.min)) * 100 : 100

  return {
    ...level,
    levelIndex,
    nextLevel,
    progressValue: Math.min(Math.max(progressValue, 0), 100)
  }
}

function getKidLikeVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || []

  const preferredNames = [
    'samantha',
    'zira',
    'karen',
    'victoria',
    'google uk english female',
    'daniel',
    'google us english',
    'google uk english male'
  ]

  const preferredVoice = voices.find((voice) => {
    const name = voice.name.toLowerCase()
    const lang = voice.lang.toLowerCase()
    return (
      /en/.test(lang) && (
        preferredNames.some((keyword) => name.includes(keyword)) ||
        /female|girl|child|kid|young/.test(name)
      )
    )
  })

  if (preferredVoice) return preferredVoice

  return voices.find((voice) => /en/.test(voice.lang.toLowerCase())) || null
}

function playTone(frequency = 440, duration = 0.24, volume = 0.04) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return

  const context = new AudioCtx()
  const oscillator = context.createOscillator()
  const gainNode = context.createGain()

  oscillator.type = 'triangle'
  oscillator.frequency.value = frequency
  gainNode.gain.value = volume

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + duration)
  oscillator.onended = () => context.close()
}

function playCorrectSound() {
  playTone(660, 0.12, 0.06)
  setTimeout(() => playTone(880, 0.12, 0.06), 120)
  setTimeout(() => playTone(1040, 0.18, 0.06), 240)
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return

  const utterance = new SpeechSynthesisUtterance(text)
  const applyVoice = () => {
    const selectedVoice = getKidLikeVoice()
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }
  }

  if (window.speechSynthesis.getVoices().length > 0) {
    applyVoice()
  } else {
    window.speechSynthesis.onvoiceschanged = () => applyVoice()
  }

  utterance.lang = 'en-US'
  utterance.rate = 0.82
  utterance.pitch = 1.65
  utterance.volume = 1

  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function createQuizQuestion(type) {
  const source = type === 'letters' ? allLetters : allNumbers
  const correct = getRandomItem(source)
  const wrongAnswers = source.filter((item) => item.key !== correct.key).slice(0, 3)
  const options = [...wrongAnswers, correct].sort(() => Math.random() - 0.5)

  return {
    type,
    correct,
    options,
    prompt: type === 'letters' ? `Which word starts with ${correct.key}?` : `What number is this?`,
    label: type === 'letters' ? correct.key : correct.key.toString()
  }
}

function App() {
  const [mode, setMode] = useState('letters')
  const [view, setView] = useState('learn')
  const [currentKey, setCurrentKey] = useState('A')
  const [currentWord, setCurrentWord] = useState('Apple')
  const [currentEmoji, setCurrentEmoji] = useState('🍎')
  const [score, setScore] = useState(0)
  const [points, setPoints] = useState(0)
  const [stars, setStars] = useState(0)
  const [quiz, setQuiz] = useState(() => createQuizQuestion('letters'))
  const [confetti, setConfetti] = useState([])
  const [soundOn, setSoundOn] = useState(true)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [streak, setStreak] = useState(0)

  const musicRef = useRef({ interval: null, context: null })

  const letters = useMemo(() => allLetters, [])
  const numbers = useMemo(() => allNumbers, [])
  const levelInfo = useMemo(() => getLevelInfo(points), [points])

  const startMusic = () => {
    if (!soundOn) return

    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return

    if (musicRef.current.context) return

    const context = new AudioCtx()
    const master = context.createGain()
    master.gain.value = 0.04
    master.connect(context.destination)

    const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63]
    let index = 0

    const playNote = () => {
      const note = notes[index % notes.length]
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = note
      gain.gain.value = 0.0001
      oscillator.connect(gain)
      gain.connect(master)
      oscillator.start()
      const now = context.currentTime
      gain.gain.exponentialRampToValueAtTime(0.03, now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)
      oscillator.stop(now + 0.25)
      index += 1
    }

    playNote()
    musicRef.current.interval = window.setInterval(playNote, 440)
    musicRef.current.context = context
  }

  const stopMusic = () => {
    if (musicRef.current.interval) {
      window.clearInterval(musicRef.current.interval)
      musicRef.current.interval = null
    }

    if (musicRef.current.context) {
      musicRef.current.context.close().catch(() => {})
      musicRef.current.context = null
    }
  }

  useEffect(() => {
    if (soundOn) {
      startMusic()
    } else {
      stopMusic()
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }

    return () => {
      stopMusic()
    }
  }, [soundOn])

  const triggerLearn = (label, word, emoji, type) => {
    setCurrentKey(label)
    setCurrentWord(word)
    setCurrentEmoji(emoji)

    if (!soundOn) return

    if (type === 'letter') {
      speakText(`${label} for ${word}`)
      playTone(520 + label.charCodeAt(0) * 2, 0.24, 0.045)
    } else {
      speakText(`${label} ${word}`)
      playTone(240 + Number(label) * 12, 0.28, 0.05)
    }
  }

  const makeConfetti = () => {
    const pieces = Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 1.4 + Math.random() * 1.2,
      color: ['#ff7eb6', '#ffd166', '#7bdff2', '#7ee081', '#a78bfa'][i % 5],
      size: 8 + Math.random() * 12
    }))
    setConfetti(pieces)
    setTimeout(() => setConfetti([]), 2200)
  }

  const handleCorrectAnswer = () => {
    const nextPoints = points + 10
    const nextScore = score + 1
    const nextStars = stars + 1
    const nextStreak = streak + 1

    setPoints(nextPoints)
    setScore(nextScore)
    setStars(nextStars)
    setStreak(nextStreak)
    setQuestionNumber((prev) => prev + 1)

    if (soundOn) {
      playCorrectSound()
      speakText('Yay! Great job!')
    }
    makeConfetti()

    setTimeout(() => {
      setQuiz(createQuizQuestion(quiz.type))
    }, 450)
  }

  const handleAnswerClick = (answer) => {
    if (answer.key === quiz.correct.key) {
      handleCorrectAnswer()
    } else {
      setStars((prev) => Math.max(prev - 1, 0))
      setStreak(0)
      if (soundOn) {
        playTone(220, 0.12, 0.05)
        speakText('Try again!')
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase()

      if (mode === 'letters' && /^[a-z]$/.test(key)) {
        const letter = key.toUpperCase()
        const item = letterMap[key]
        triggerLearn(letter, item.word, item.emoji, 'letter')
      }

      if (mode === 'numbers' && /^[0-9]$/.test(key)) {
        const value = Number(key)
        const item = numberMap[value]
        if (item) triggerLearn(String(value), item.word, item.emoji, 'number')
      }

      if (event.key === ' ') {
        event.preventDefault()
        setMode((prev) => (prev === 'letters' ? 'numbers' : 'letters'))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode, soundOn])

  const handleLetterPress = (letter) => {
    const key = letter.toLowerCase()
    const item = letterMap[key]
    triggerLearn(letter, item.word, item.emoji, 'letter')
  }

  const handleNumberPress = (num) => {
    const item = numberMap[num]
    if (!item) return
    triggerLearn(String(num), item.word, item.emoji, 'number')
  }

  const nextLevelLabel = levelInfo.nextLevel ? levelInfo.nextLevel.name : 'Master'
  const progressPercent = Math.round(levelInfo.progressValue)

  return (
    <div className="app-shell">
      <div className="container">
        <header className="topbar">
          <div>
            <p className="mini-title">Play & Learn</p>
            <h1>ABC & 123 Adventure</h1>
          </div>

          <div className="header-actions">
            <button className="sound-toggle" onClick={() => setSoundOn((prev) => !prev)}>
              {soundOn ? '🔊 Sound On' : '🔇 Mute'}
            </button>

            <div className="score-box">
              <span>⭐ {stars}</span>
              <small>Points {points}</small>
            </div>

            <button
              className="mode-button"
              onClick={() => setMode((prev) => (prev === 'letters' ? 'numbers' : 'letters'))}
            >
              {mode === 'letters' ? 'Switch to Numbers' : 'Switch to Letters'}
            </button>
          </div>
        </header>

        <div className="level-strip">
          <div className="badge-wrap">
            <span className="level-badge" style={{ background: levelInfo.color }}>
              {levelInfo.name}
            </span>
            <span className="next-level">Next: {nextLevelLabel}</span>
          </div>

          <div className="progress-block">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%`, background: levelInfo.color }} />
            </div>
            <small>{progressPercent}% to {nextLevelLabel}</small>
          </div>
        </div>

        <div className="toolbar">
          <button className={view === 'learn' ? 'tool active' : 'tool'} onClick={() => setView('learn')}>
            Learn
          </button>
          <button className={view === 'quiz' ? 'tool active' : 'tool'} onClick={() => setView('quiz')}>
            Mini Quiz
          </button>
        </div>

        {confetti.length > 0 && (
          <div className="confetti-wrap" aria-hidden="true">
            {confetti.map((piece) => (
              <span
                key={piece.id}
                className="confetti-piece"
                style={{
                  left: `${piece.left}%`,
                  animationDelay: `${piece.delay}s`,
                  animationDuration: `${piece.duration}s`,
                  background: piece.color,
                  width: `${piece.size}px`,
                  height: `${piece.size * 1.5}px`
                }}
              />
            ))}
          </div>
        )}

        {view === 'learn' ? (
          <main className="game-panel">
            <section className="display-card">
              <span className="tag">{mode === 'letters' ? 'Alphabet lesson' : 'Number lesson'}</span>
              <div className="big-item">{currentKey}</div>
              <div className="emoji-bubble">{currentEmoji}</div>
              <div className="word-line">
                {mode === 'letters' ? `${currentKey} for ${currentWord}` : `${currentKey} means ${currentWord}`}
              </div>
              <p className="helper-text">
                {mode === 'letters'
                  ? 'Press any letter key or tap a card below.'
                  : 'Press a number key or tap a number below.'}
              </p>
            </section>

            <section className="tile-grid">
              {mode === 'letters' &&
                letters.map((item) => (
                  <button key={item.key} className="tile letter-tile" onClick={() => handleLetterPress(item.key)}>
                    <span className="emoji">{item.emoji}</span>
                    <span className="letter-text">{item.key}</span>
                  </button>
                ))}

              {mode === 'numbers' &&
                numbers.map((item) => (
                  <button key={item.key} className="tile number-tile" onClick={() => handleNumberPress(item.key)}>
                    <span className="emoji">{item.emoji}</span>
                    <span className="letter-text">{item.key}</span>
                  </button>
                ))}
            </section>
          </main>
        ) : (
          <main className="quiz-panel">
            <section className="quiz-card">
              <div className="quiz-header-row">
                <p className="quiz-title">Mini Quiz</p>
                <span className="streak-pill">🔥 Streak {streak}</span>
              </div>

              <div className="quiz-prompt">
                <div className="quiz-badge">{quiz.type === 'letters' ? 'A-Z' : '1-100'}</div>
                <strong>{quiz.prompt}</strong>
                <small>Question {questionNumber}</small>
              </div>

              <div className="quiz-grid">
                {quiz.options.map((option) => (
                  <button
                    key={`${quiz.type}-${option.key}-${Math.random()}`}
                    className="quiz-option"
                    onClick={() => handleAnswerClick(option)}
                  >
                    {quiz.type === 'letters' ? `${option.key} - ${option.word} ${option.emoji}` : `${option.key} - ${option.word} ${option.emoji}`}
                  </button>
                ))}
              </div>

              <div className="quiz-status">
                <span>Score: {score}</span>
                <span>Stars: {stars}</span>
                <span>Points: {points}</span>
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  )
}

export default App
