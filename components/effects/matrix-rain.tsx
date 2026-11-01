"use client"

import { useEffect, useRef } from "react"

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const chars = "01アイウエオカキクケコ{}[]<>/|=+-*&#@!?$%ABCDEFabcdef0123456789"
    const fontSize = 13
    let columns: number
    let drops: number[]

    function resize() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
      columns = Math.floor(canvas!.width / fontSize)
      drops = Array(columns).fill(1).map(() => Math.random() * -100)
    }

    function draw() {
      ctx!.fillStyle = "rgba(7, 9, 10, 0.06)"
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const y = drops[i] * fontSize
        const brightness = Math.random()

        if (brightness > 0.96) {
          ctx!.fillStyle = "rgba(61, 220, 151, 0.55)"
          ctx!.shadowBlur = 6
          ctx!.shadowColor = "rgba(61, 220, 151, 0.3)"
        } else if (brightness > 0.8) {
          ctx!.fillStyle = "rgba(61, 220, 151, 0.12)"
          ctx!.shadowBlur = 0
        } else {
          ctx!.fillStyle = "rgba(255, 255, 255, 0.03)"
          ctx!.shadowBlur = 0
        }

        ctx!.font = `${fontSize}px monospace`
        ctx!.fillText(char, i * fontSize, y)
        ctx!.shadowBlur = 0

        if (y > canvas!.height && Math.random() > 0.98) {
          drops[i] = 0
        }
        drops[i] += 0.4 + Math.random() * 0.4
      }
      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
      aria-hidden="true"
    />
  )
}
