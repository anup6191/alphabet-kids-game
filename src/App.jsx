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

// Spellings the browser voice reads as each letter's phonics sound (A as in Apple).
const phonicsMap = {
  a: 'ah', b: 'buh', c: 'kuh', d: 'duh', e: 'eh', f: 'fuh', g: 'guh', h: 'huh',
  i: 'ih', j: 'juh', k: 'kuh', l: 'luh', m: 'muh', n: 'nuh', o: 'aw', p: 'puh',
  q: 'kwuh', r: 'ruh', s: 'sss', t: 'tuh', u: 'uh', v: 'vuh', w: 'wuh', x: 'ks',
  y: 'yuh', z: 'zzz'
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

function getKidLikeVoice(mode = 'natural') {
  const voices = window.speechSynthesis?.getVoices?.() || []
  const preferredNames = [
    'samantha',
    'zira',
    'karen',
    'victoria',
    'google uk english female',
    'google us english',
    'susan',
    'aria',
    'jenny',
    'olivia',
    'moira'
  ]

  const preferred = voices.filter((voice) => {
    const name = voice.name.toLowerCase()
    const lang = voice.lang.toLowerCase()
    return /en/.test(lang) && (
      preferredNames.some((keyword) => name.includes(keyword)) ||
      /female|girl|young|child|kid/.test(name)
    )
  })

  if (preferred.length > 0) return preferred[0]

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

function speakText(text, mode = 'natural', onEnd = null) {
  if (!('speechSynthesis' in window)) {
    onEnd?.()
    return
  }

  const utterance = new SpeechSynthesisUtterance(text)
  const applyVoice = () => {
    const selectedVoice = getKidLikeVoice(mode)
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
  utterance.rate = mode === 'soft' ? 0.7 : mode === 'cheerful' ? 0.95 : 0.82
  utterance.pitch = mode === 'soft' ? 1.45 : mode === 'cheerful' ? 1.8 : 1.65
  utterance.volume = 1

  // Some browsers never fire onend, so a timeout keeps the lesson moving.
  let finished = false
  const finish = () => {
    if (finished || !onEnd) return
    finished = true
    onEnd()
  }
  utterance.onend = finish
  utterance.onerror = finish
  if (onEnd) setTimeout(finish, 3500)

  try {
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  } catch {
    finish()
  }
}

const STORAGE_KEY = 'abc-123-adventure'

function loadSaved() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function saveProgress(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage can be blocked (private mode); the game still works without it.
  }
}

function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

let quizCounter = 0

function createQuizQuestion(type, previousKey = null) {
  const source = type === 'letters' ? allLetters : allNumbers
  const candidates = source.filter((item) => item.key !== previousKey)
  const correct = candidates[Math.floor(Math.random() * candidates.length)]
  const wrongAnswers = shuffle(source.filter((item) => item.key !== correct.key)).slice(0, 3)
  const options = shuffle([...wrongAnswers, correct])
  quizCounter += 1

  return {
    id: quizCounter,
    type,
    correct,
    options,
    prompt: type === 'letters' ? `Which picture starts with ${correct.key}?` : 'How many do you see?'
  }
}

function App() {
  const [saved] = useState(loadSaved)
  const [mode, setMode] = useState('letters')
  const [view, setView] = useState('learn')
  const [currentKey, setCurrentKey] = useState('A')
  const [currentWord, setCurrentWord] = useState('Apple')
  const [currentEmoji, setCurrentEmoji] = useState('🍎')
  const [lessonStep, setLessonStep] = useState('sound')
  const [score, setScore] = useState(saved.score || 0)
  const [points, setPoints] = useState(saved.points || 0)
  const [stars, setStars] = useState(saved.stars || 0)
  const [bestStreak, setBestStreak] = useState(saved.bestStreak || 0)
  const [quiz, setQuiz] = useState(() => createQuizQuestion('letters'))
  const [answered, setAnswered] = useState(false)
  const [wrongKeys, setWrongKeys] = useState([])
  const [confetti, setConfetti] = useState([])
  const [soundOn, setSoundOn] = useState(saved.soundOn ?? true)
  const [musicOn, setMusicOn] = useState(saved.musicOn ?? false)
  const [voiceMode, setVoiceMode] = useState(saved.voiceMode || 'natural')
  const [questionNumber, setQuestionNumber] = useState(1)
  const [streak, setStreak] = useState(0)
  const [levelUp, setLevelUp] = useState(null)

  const musicRef = useRef({ interval: null, context: null })
  const levelRef = useRef(null)
  const quizIdRef = useRef(quiz.id)
  const lessonRef = useRef(0)

  const letters = useMemo(() => allLetters, [])
  const numbers = useMemo(() => allNumbers, [])
  const levelInfo = useMemo(() => getLevelInfo(points), [points])

  const startMusic = () => {
    if (!soundOn || !musicOn) return

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
    if (soundOn && musicOn) {
      startMusic()
      // Browsers keep audio suspended until the first tap or key press.
      const resume = () => musicRef.current.context?.resume?.()
      window.addEventListener('pointerdown', resume, { once: true })
      window.addEventListener('keydown', resume, { once: true })
      return () => {
        window.removeEventListener('pointerdown', resume)
        window.removeEventListener('keydown', resume)
        stopMusic()
      }
    }

    stopMusic()
    if (!soundOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [soundOn, musicOn])

  useEffect(() => {
    saveProgress({ score, points, stars, bestStreak, soundOn, musicOn, voiceMode })
  }, [score, points, stars, bestStreak, soundOn, musicOn, voiceMode])

  useEffect(() => {
    quizIdRef.current = quiz.id
  }, [quiz.id])

  const showQuestion = (question) => {
    setQuiz(question)
    setAnswered(false)
    setWrongKeys([])
  }

  const switchMode = () => {
    const nextMode = mode === 'letters' ? 'numbers' : 'letters'
    const first = nextMode === 'letters' ? allLetters[0] : allNumbers[0]
    lessonRef.current += 1
    setLessonStep('sound')
    setMode(nextMode)
    setCurrentKey(String(first.key))
    setCurrentWord(first.word)
    setCurrentEmoji(first.emoji)
    showQuestion(createQuizQuestion(nextMode))
  }

  useEffect(() => {
    if (levelRef.current !== null && levelInfo.levelIndex > levelRef.current) {
      setLevelUp(levelInfo.name)
      if (soundOn) speakText(`New level! ${levelInfo.name}!`, 'cheerful')
    }
    levelRef.current = levelInfo.levelIndex
  }, [levelInfo.levelIndex])

  useEffect(() => {
    if (!levelUp) return
    const timer = setTimeout(() => setLevelUp(null), 2600)
    return () => clearTimeout(timer)
  }, [levelUp])

  // Letter lesson in three steps: "A for" -> apple picture + "Apple" -> phonics "a, a, a".
  const runLetterLesson = (label, word) => {
    lessonRef.current += 1
    const lessonId = lessonRef.current
    const sound = phonicsMap[label.toLowerCase()]

    const step = (text, mode, next) => {
      const advance = () => {
        if (lessonRef.current === lessonId) next()
      }
      if (soundOn) {
        speakText(text, mode, advance)
      } else {
        setTimeout(advance, 900)
      }
    }

    setLessonStep('letter')
    if (soundOn) playTone(520 + label.charCodeAt(0) * 2, 0.24, 0.045)

    step(`${label}. for`, voiceMode, () => {
      setLessonStep('picture')
      step(word, voiceMode, () => {
        setLessonStep('sound')
        if (soundOn) speakText(`${sound}. ${sound}. ${sound}.`, 'soft')
      })
    })
  }

  const triggerLearn = (label, word, emoji, type) => {
    setCurrentKey(label)
    setCurrentWord(word)
    setCurrentEmoji(emoji)

    if (type === 'letter') {
      runLetterLesson(label, word)
      return
    }

    lessonRef.current += 1
    setLessonStep('sound')
    if (!soundOn) return

    speakText(`${label} ${word}`, voiceMode)
    playTone(240 + Number(label) * 12, 0.28, 0.05)
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

    setAnswered(true)
    setPoints(nextPoints)
    setScore(nextScore)
    setStars(nextStars)
    setStreak(nextStreak)
    setBestStreak((prev) => Math.max(prev, nextStreak))

    if (soundOn) {
      playCorrectSound()
      speakText('Yay! Great job!', 'cheerful')
    }
    makeConfetti()

    const answeredQuiz = quiz
    setTimeout(() => {
      // Skip if the question already changed (e.g. the mode was switched).
      if (quizIdRef.current !== answeredQuiz.id) return
      setQuestionNumber((prev) => prev + 1)
      showQuestion(createQuizQuestion(answeredQuiz.type, answeredQuiz.correct.key))
    }, 1100)
  }

  const handleAnswerClick = (answer) => {
    if (answered || wrongKeys.includes(answer.key)) return

    if (answer.key === quiz.correct.key) {
      handleCorrectAnswer()
    } else {
      setWrongKeys((prev) => [...prev, answer.key])
      setStars((prev) => Math.max(prev - 1, 0))
      setStreak(0)
      if (soundOn) {
        playTone(220, 0.12, 0.05)
        speakText('Try again!', 'soft')
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      const key = event.key.toLowerCase()

      if (view === 'quiz') {
        const option = quiz.options[Number(key) - 1]
        if (/^[1-4]$/.test(key) && option) handleAnswerClick(option)
      } else if (mode === 'letters' && /^[a-z]$/.test(key)) {
        const letter = key.toUpperCase()
        const item = letterMap[key]
        triggerLearn(letter, item.word, item.emoji, 'letter')
      } else if (mode === 'numbers' && /^[1-9]$/.test(key)) {
        const value = Number(key)
        const item = numberMap[value]
        if (item) triggerLearn(String(value), item.word, item.emoji, 'number')
      }

      if (event.key === ' ') {
        event.preventDefault()
        switchMode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

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

  const resetProgress = () => {
    if (!window.confirm('Start over? This clears points, stars and levels.')) return
    setScore(0)
    setPoints(0)
    setStars(0)
    setStreak(0)
    setBestStreak(0)
    setQuestionNumber(1)
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
            <button className="sound-toggle" aria-pressed={soundOn} onClick={() => setSoundOn((prev) => !prev)}>
              {soundOn ? '🔊 Sound On' : '🔇 Mute'}
            </button>

            <button
              className="sound-toggle"
              aria-pressed={musicOn}
              disabled={!soundOn}
              onClick={() => setMusicOn((prev) => !prev)}
            >
              {musicOn ? '🎵 Music On' : '🎵 Music Off'}
            </button>

            <div className="voice-switcher" aria-label="voice mode selector">
              <button
                className={voiceMode === 'natural' ? 'voice-button active' : 'voice-button'}
                aria-pressed={voiceMode === 'natural'}
                onClick={() => setVoiceMode('natural')}
              >
                Natural
              </button>
              <button
                className={voiceMode === 'soft' ? 'voice-button active' : 'voice-button'}
                aria-pressed={voiceMode === 'soft'}
                onClick={() => setVoiceMode('soft')}
              >
                Soft
              </button>
              <button
                className={voiceMode === 'cheerful' ? 'voice-button active' : 'voice-button'}
                aria-pressed={voiceMode === 'cheerful'}
                onClick={() => setVoiceMode('cheerful')}
              >
                Cheerful
              </button>
            </div>

            <div className="score-box">
              <span>⭐ {stars}</span>
              <small>Points {points}</small>
            </div>

            <button
              className="mode-button"
              onClick={switchMode}
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

          <button className="reset-button" onClick={resetProgress}>
            ↺ Start over
          </button>
        </div>

        {levelUp && (
          <div className="level-up" role="status">
            🏆 New level: {levelUp}!
          </div>
        )}

        <div className="toolbar">
          <button
            className={view === 'learn' ? 'tool active' : 'tool'}
            aria-pressed={view === 'learn'}
            onClick={() => setView('learn')}
          >
            Learn
          </button>
          <button
            className={view === 'quiz' ? 'tool active' : 'tool'}
            aria-pressed={view === 'quiz'}
            onClick={() => setView('quiz')}
          >
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
              <div key={`letter-${currentKey}`} className="big-item">
                {currentKey}
              </div>
              <div
                key={`picture-${currentKey}-${lessonStep === 'letter'}`}
                className={lessonStep === 'letter' ? 'emoji-bubble waiting' : 'emoji-bubble'}
              >
                {lessonStep === 'letter' ? '❔' : currentEmoji}
              </div>
              <div className="word-line">
                {mode === 'numbers'
                  ? `${currentKey} means ${currentWord}`
                  : lessonStep === 'letter'
                    ? `${currentKey} for…`
                    : `${currentKey} for ${currentWord}`}
              </div>
              {mode === 'letters' && (
                <div className={lessonStep === 'sound' ? 'phonics-line show' : 'phonics-line'} aria-live="polite">
                  🔊 {Array(3).fill(currentKey.toLowerCase()).join(' – ')}
                </div>
              )}
              <p className="helper-text">
                {mode === 'letters'
                  ? 'Press any letter key or tap a card below. Space switches to numbers.'
                  : 'Press 1-9 or tap a number below. Space switches to letters.'}
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
                <div className="quiz-badge">{quiz.type === 'letters' ? 'A-Z' : '1-20'}</div>
                {quiz.type === 'letters' ? (
                  <div className="quiz-letter">{quiz.correct.key}</div>
                ) : (
                  <div className="count-grid" aria-label={`${quiz.correct.key} pictures`}>
                    {Array.from({ length: quiz.correct.key }, (_, i) => (
                      <span key={i}>{quiz.correct.emoji}</span>
                    ))}
                  </div>
                )}
                <strong>{quiz.prompt}</strong>
                <small>Question {questionNumber}</small>
              </div>

              <div className="quiz-grid">
                {quiz.options.map((option, index) => {
                  const isWrong = wrongKeys.includes(option.key)
                  const isRight = answered && option.key === quiz.correct.key
                  const className = ['quiz-option', isWrong && 'wrong', isRight && 'right'].filter(Boolean).join(' ')

                  return (
                    <button
                      key={`${quiz.id}-${option.key}`}
                      className={className}
                      disabled={isWrong || answered}
                      onClick={() => handleAnswerClick(option)}
                    >
                      <span className="option-hint">{index + 1}</span>
                      {quiz.type === 'letters' ? (
                        <>
                          <span className="option-emoji">{option.emoji}</span>
                          <span>{option.word}</span>
                        </>
                      ) : (
                        <span className="option-number">{option.key}</span>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="quiz-status">
                <span>Score: {score}</span>
                <span>Stars: {stars}</span>
                <span>Points: {points}</span>
                <span>Best streak: {bestStreak}</span>
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  )
}

export default App
