import { useEffect, useMemo, useState } from 'react'

const letterMap = {
  a: 'Apple',
  b: 'Ball',
  c: 'Cat',
  d: 'Dog',
  e: 'Elephant',
  f: 'Fish',
  g: 'Giraffe',
  h: 'Horse',
  i: 'Ice Cream',
  j: 'Jacket',
  k: 'Kite',
  l: 'Lion',
  m: 'Mouse',
  n: 'Nest',
  o: 'Orange',
  p: 'Pencil',
  q: 'Queen',
  r: 'Rabbit',
  s: 'Sun',
  t: 'Tree',
  u: 'Umbrella',
  v: 'Violin',
  w: 'Watermelon',
  x: 'Xylophone',
  y: 'Yogurt',
  z: 'Zebra'
}

const numberWords = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Eleven',
  12: 'Twelve',
  13: 'Thirteen',
  14: 'Fourteen',
  15: 'Fifteen',
  16: 'Sixteen',
  17: 'Seventeen',
  18: 'Eighteen',
  19: 'Nineteen',
  20: 'Twenty'
}

const allLetters = Object.keys(letterMap).map((key) => key.toUpperCase())
const allNumbers = Array.from({ length: 100 }, (_, i) => i + 1)

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

function speakText(text) {
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.9
  utterance.pitch = 1.2
  utterance.volume = 1
  window.speechSynthesis.speak(utterance)
}

function App() {
  const [mode, setMode] = useState('letters')
  const [currentKey, setCurrentKey] = useState('A')
  const [currentWord, setCurrentWord] = useState('Apple')

  const letters = useMemo(() => allLetters, [])
  const numbers = useMemo(() => allNumbers, [])

  const triggerSoundAndSpeech = (label, word, type) => {
    setCurrentKey(label)
    setCurrentWord(word)

    if (type === 'letter') {
      speakText(`${label} for ${word}`)
      playTone(520 + label.charCodeAt(0) * 2, 0.24, 0.045)
    } else {
      speakText(`${label} ${word}`)
      playTone(240 + Number(label) * 12, 0.28, 0.05)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase()

      if (mode === 'letters' && /^[a-z]$/.test(key)) {
        const letter = key.toUpperCase()
        const word = letterMap[key]
        triggerSoundAndSpeech(letter, word, 'letter')
      }

      if (mode === 'numbers' && /^[0-9]$/.test(key)) {
        const value = Number(key)
        const word = numberWords[value] || String(value)
        triggerSoundAndSpeech(String(value), word, 'number')
      }

      if (event.key === ' ') {
        event.preventDefault()
        setMode((prev) => (prev === 'letters' ? 'numbers' : 'letters'))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode])

  const handleLetterPress = (letter) => {
    const key = letter.toLowerCase()
    const word = letterMap[key]
    triggerSoundAndSpeech(letter, word, 'letter')
  }

  const handleNumberPress = (num) => {
    const word = numberWords[num] || String(num)
    triggerSoundAndSpeech(String(num), word, 'number')
  }

  return (
    <div className="app-shell">
      <div className="container">
        <header className="topbar">
          <div>
            <p className="mini-title">Play & Learn</p>
            <h1>ABC & 123 Adventure</h1>
          </div>

          <button
            className="mode-button"
            onClick={() => setMode((prev) => (prev === 'letters' ? 'numbers' : 'letters'))}
          >
            {mode === 'letters' ? 'Switch to Numbers' : 'Switch to Letters'}
          </button>
        </header>

        <main className="game-panel">
          <section className="display-card">
            <span className="tag">{mode === 'letters' ? 'Alphabet lesson' : 'Number lesson'}</span>
            <div className="big-item">{currentKey}</div>
            <div className="word-line">
              {mode === 'letters' ? `${currentKey} for ${currentWord}` : `${currentKey} means ${currentWord}`}
            </div>
            <p className="helper-text">
              {mode === 'letters'
                ? 'Press any letter key or tap a letter below.'
                : 'Press a number key or tap a number below.'}
            </p>
          </section>

          <section className="tile-grid">
            {mode === 'letters' &&
              letters.map((letter) => (
                <button
                  key={letter}
                  className="tile letter-tile"
                  onClick={() => handleLetterPress(letter)}
                >
                  {letter}
                </button>
              ))}

            {mode === 'numbers' &&
              numbers.map((num) => (
                <button
                  key={num}
                  className="tile number-tile"
                  onClick={() => handleNumberPress(num)}
                >
                  {num}
                </button>
              ))}
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
