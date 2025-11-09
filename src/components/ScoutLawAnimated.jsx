import { useState, useEffect } from 'react'
import './ScoutLawAnimated.css'

function ScoutLawAnimated({ examples = [] }) {
  const [currentExample, setCurrentExample] = useState('')
  const [animationType, setAnimationType] = useState('slide-right')
  const [shuffledExamples, setShuffledExamples] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Animation types - ultra creative effects
  const animations = [
    'slide-right',
    'slide-left',
    'slide-up',
    'slide-down',
    'fade-in',
    'zoom-in',
    'zoom-out',
    'rotate-in',
    'bounce-in',
    'flip-in',
    'swing-in',
    'typewriter',
    'glitch',
    'wave',
    'spiral',
    'materialize',
    'sparkle',
    'elastic',
    'blur-in',
    'split-reveal'
  ]

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  useEffect(() => {
    if (examples.length > 0) {
      setShuffledExamples(shuffleArray(examples))
    }
  }, [examples])

  useEffect(() => {
    if (shuffledExamples.length === 0) return

    const interval = setInterval(() => {
      // Pick a random animation
      const randomAnimation = animations[Math.floor(Math.random() * animations.length)]
      setAnimationType(randomAnimation)

      // Move to next example
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % shuffledExamples.length

        // Re-shuffle when we complete a cycle
        if (nextIndex === 0) {
          setShuffledExamples(shuffleArray(examples))
        }

        setCurrentExample(shuffledExamples[nextIndex])
        return nextIndex
      })
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [shuffledExamples, examples, animations])

  if (!currentExample) return null

  return (
    <div className="scout-law-animated-container">
      <div className={`scout-law-text ${animationType}`} key={`${currentExample}-${animationType}`}>
        {currentExample}
      </div>
    </div>
  )
}

export default ScoutLawAnimated
