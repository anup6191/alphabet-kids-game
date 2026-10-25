import { useMemo, useState, useEffect } from 'react'

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
  10: 'Ten'
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.9
  utterance.pitch = 1.2
  window.speechSynthesis.speak(utterance)
}

function App() {
  const [mode, setMode] = useState('letters')
  const [currentKey, setCurrentKey] = useState('A')
  const [currentWord, setCurrentWord] = useState('Apple')

  const letters = useMemo(
    () => Object.keys(letterMap).map((key) => key.toUpperCase()),
    []
  )

  const numbers = useMemo(() => Array.from({ length: 100 }, (_, i) => i + 1), [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase()

      if (mode === 'letters' && /^[a-z]$/.test(key)) {
        const letter = key.toUpperCase()
        const word = letterMap[key]
        setCurrentKey(letter)
        setCurrentWord(word)
        speakText(`${letter} for ${word}`)
      }

      if (mode === 'numbers' && /^[0-9]$/.test(key)) {
        const value = Number(key)
        const word = numberWords[value] || String(value)
        setCurrentKey(String(value))
        setCurrentWord(word)
        speakText(String(value))
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
    setCurrentKey(letter)
    setCurrentWord(word)
    speakText(`${letter} for ${word}`)
  }

  const handleNumberPress = (num) => {
    const word = numberWords[num] || String(num)
    setCurrentKey(String(num))
    setCurrentWord(word)
    speakText(String(num))
  }

  return (
    <div className="app">
      <div className="container">
        <header className="topbar">
          <h1>Kids Learning Game</h1>
          <button
            className="mode-button"
            onClick={() => setMode((prev) => (prev === 'letters' ? 'numbers' : 'letters'))}
          >
            Switch to {mode === 'letters' ? 'Numbers' : 'Letters'}
          </button>
        </header>

        <div className="card">
          <p className="label">{mode === 'letters' ? 'Letter Game' : 'Number Game'}</p>
          <div className="big-letter">{currentKey}</div>
          <div className="word">
            {mode === 'letters' ? `${currentKey} for ${currentWord}` : `${currentKey} = ${currentWord}`}
          </div>
          <div className="hint">
            {mode === 'letters' ? 'Press any letter on the keyboard' : 'Press a number key from 1 to 9'}
          </div>
        </div>

        <div className="grid">
          {mode === 'letters' &&
            letters.map((letter) => (
              <button key={letter} className="tile" onClick={() => handleLetterPress(letter)}>
                {letter}
              </button>
            ))}

          {mode === 'numbers' &&
            numbers.slice(0, 50).map((num) => (
              <button key={num} className="tile number" onClick={() => handleNumberPress(num)}>
                {num}
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}

export default App
