import { useEffect, useRef, useState } from 'react'
import './SnowEffect.css'

function SnowEffect() {
  const canvasRef = useRef(null)
  const [showScout, setShowScout] = useState(false)
  const snowPileRef = useRef(0)
  const scoutTimerRef = useRef(null)

  const triggerScoutAnimation = () => {
    if (showScout) return // Don't trigger if already showing
    setShowScout(true)

    // Hide scout after animation completes
    setTimeout(() => {
      setShowScout(false)
      snowPileRef.current = 0 // Reset snow pile
    }, 5000)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Listen for banner click event
    const handleTriggerScout = () => {
      triggerScoutAnimation()
    }
    window.addEventListener('triggerScout', handleTriggerScout)

    // Snowflakes array
    const snowflakes = []
    const maxSnowflakes = 50

    class Snowflake {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height - canvas.height
        this.radius = Math.random() * 3 + 1
        this.speed = Math.random() * 1 + 0.5
        this.wind = Math.random() * 0.5 - 0.25
        this.opacity = Math.random() * 0.5 + 0.3
      }

      update() {
        this.y += this.speed
        this.x += this.wind

        // Reset snowflake when it goes off screen
        if (this.y > canvas.height) {
          this.y = -10
          this.x = Math.random() * canvas.width

          // Check if snowflake lands on footer (snow accumulation)
          const footerHeight = 200 // approximate footer height
          if (this.y > canvas.height - footerHeight) {
            snowPileRef.current += 0.02

            // Trigger scout animation when snow pile reaches threshold
            if (snowPileRef.current > 15 && !showScout) {
              triggerScoutAnimation()
            }
          }
        }

        if (this.x > canvas.width) {
          this.x = 0
        } else if (this.x < 0) {
          this.x = canvas.width
        }
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.fill()
      }
    }

    // Initialize snowflakes
    for (let i = 0; i < maxSnowflakes; i++) {
      snowflakes.push(new Snowflake())
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      snowflakes.forEach(snowflake => {
        snowflake.update()
        snowflake.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Random scout animation trigger
    const randomScoutTimer = setInterval(() => {
      if (Math.random() > 0.7 && snowPileRef.current > 8) {
        triggerScoutAnimation()
      }
    }, 20000) // Check every 20 seconds

    scoutTimerRef.current = randomScoutTimer

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('triggerScout', handleTriggerScout)
      clearInterval(randomScoutTimer)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="snow-canvas" />
      <div className="frost-overlay" />

      {/* Snow pile on footer */}
      <div
        className="snow-pile"
        style={{
          height: `${Math.min(snowPileRef.current, 20)}px`,
          opacity: Math.min(snowPileRef.current / 15, 1)
        }}
      />

      {/* Scout animation */}
      {showScout && (
        <div className="scout-animation">
          <div className="scout-character">
            <div className="scout-face">😊</div>
            <div className="scout-body">
              <div className="scout-uniform"></div>
              <div className="scout-neckerchief"></div>
            </div>
            <div className="shovel">
              <div className="shovel-handle"></div>
              <div className="shovel-blade"></div>
            </div>
          </div>
          <div className="shoveling-snow"></div>
        </div>
      )}
    </>
  )
}

export default SnowEffect
