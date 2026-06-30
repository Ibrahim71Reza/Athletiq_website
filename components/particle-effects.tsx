"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  type: "dumbbell" | "pulse" | "dot" | "line" | "star" | "hexagon" | "triangle"
  angle: number
  speed: number
  life: number
  maxLife: number
  trail: { x: number; y: number; opacity: number }[]
  glowIntensity: number
  rotationSpeed: number
}

interface ParticleEffectsProps {
  variant?: "fitness" | "energy" | "motivation" | "community"
  intensity?: "low" | "medium" | "high"
}

export default function ParticleEffects({ variant = "fitness", intensity = "medium" }: ParticleEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Mouse tracking for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Particle count based on intensity
    const particleCount = intensity === "low" ? 30 : intensity === "medium" ? 50 : 80

    // Get theme-aware colors
    const getThemeColors = () => {
      const isDark = resolvedTheme === "dark"

      if (isDark) {
        return {
          primary: ["#ff6b6b", "#ff8c8c", "#ff4757", "#ff5252"], // Bright red variants
          secondary: ["#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6"], // White variants
          accent: ["#ffd32a", "#ffdd59", "#ffc048"], // Bright gold variants
          glow: ["#ff6b6b", "#ff8c8c", "#ff4757"], // Glow colors
          connection: "#ff6b6b", // Bright connection line color
        }
      } else {
        return {
          primary: ["#dc2626", "#ea580c", "#b91c1c", "#c2410c"], // Red/orange
          secondary: ["#1f2937", "#374151", "#4b5563", "#6b7280"], // Gray variants
          accent: ["#d97706", "#b45309", "#92400e"], // Gold
          glow: ["#dc2626", "#ea580c", "#b91c1c"], // Glow colors
          connection: "#dc2626", // Connection line color
        }
      }
    }

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      const colors = getThemeColors()

      for (let i = 0; i < particleCount; i++) {
        const allColors = [...colors.primary, ...colors.secondary, ...colors.accent]

        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 4 + 1,
          opacity: Math.random() * 0.6 + 0.3,
          color: allColors[Math.floor(Math.random() * allColors.length)],
          type: ["dumbbell", "pulse", "dot", "line", "star", "hexagon", "triangle"][
            Math.floor(Math.random() * 7)
          ] as Particle["type"],
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.8 + 0.3,
          life: Math.random() * 2000 + 1000,
          maxLife: Math.random() * 2000 + 1000,
          trail: [],
          glowIntensity: Math.random() * 0.5 + 0.5,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
        })
      }
    }

    initParticles()

    // Draw particle shapes with enhanced effects
    const drawParticle = (particle: Particle) => {
      const isDark = resolvedTheme === "dark"

      ctx.save()

      // Apply glow effect
      if (isDark) {
        ctx.shadowColor = particle.color
        ctx.shadowBlur = particle.glowIntensity * 25
        ctx.globalAlpha = Math.min(1, particle.opacity * 1.3)
      } else {
        ctx.shadowColor = particle.color
        ctx.shadowBlur = particle.glowIntensity * 15
        ctx.globalAlpha = particle.opacity
      }

      // Translate to particle position and rotate
      ctx.translate(particle.x, particle.y)
      ctx.rotate(particle.angle)

      ctx.fillStyle = particle.color
      ctx.strokeStyle = particle.color
      ctx.lineWidth = isDark ? 2.5 : 2

      const size = isDark ? particle.size * 1.2 : particle.size

      try {
        switch (particle.type) {
          case "dumbbell":
            // Enhanced dumbbell with gradient
            const gradient = ctx.createLinearGradient(-size, 0, size, 0)
            gradient.addColorStop(0, particle.color)
            gradient.addColorStop(0.5, particle.color + (isDark ? "cc" : "80"))
            gradient.addColorStop(1, particle.color)
            ctx.fillStyle = gradient

            // Bar
            ctx.fillRect(-size, -size / 6, size * 2, size / 3)
            // Weights
            ctx.beginPath()
            ctx.arc(-size, 0, size / 2, 0, Math.PI * 2)
            ctx.arc(size, 0, size / 2, 0, Math.PI * 2)
            ctx.fill()
            break

          case "pulse":
            // Pulsing circle with animated size
            const pulseSize = size + Math.sin(timeRef.current * 0.005 + particle.x * 0.01) * size * 0.5
            ctx.beginPath()
            ctx.arc(0, 0, pulseSize, 0, Math.PI * 2)
            ctx.stroke()

            // Inner glow
            ctx.globalAlpha = isDark ? particle.opacity * 0.6 : particle.opacity * 0.3
            ctx.fill()
            break

          case "star":
            // 5-pointed star
            ctx.beginPath()
            for (let i = 0; i < 5; i++) {
              const angle = (i * Math.PI * 2) / 5
              const outerRadius = size
              const innerRadius = size * 0.4

              if (i === 0) {
                ctx.moveTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius)
              } else {
                ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius)
              }

              const innerAngle = angle + Math.PI / 5
              ctx.lineTo(Math.cos(innerAngle) * innerRadius, Math.sin(innerAngle) * innerRadius)
            }
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
            break

          case "hexagon":
            // Hexagon
            ctx.beginPath()
            for (let i = 0; i < 6; i++) {
              const angle = (i * Math.PI * 2) / 6
              const x = Math.cos(angle) * size
              const y = Math.sin(angle) * size
              if (i === 0) {
                ctx.moveTo(x, y)
              } else {
                ctx.lineTo(x, y)
              }
            }
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
            break

          case "triangle":
            // Triangle
            ctx.beginPath()
            ctx.moveTo(0, -size)
            ctx.lineTo(-size * 0.866, size * 0.5)
            ctx.lineTo(size * 0.866, size * 0.5)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
            break

          case "line":
            // Animated line with gradient
            const lineGradient = ctx.createLinearGradient(-size, 0, size, 0)
            lineGradient.addColorStop(0, particle.color + (isDark ? "60" : "20"))
            lineGradient.addColorStop(0.5, particle.color)
            lineGradient.addColorStop(1, particle.color + (isDark ? "60" : "20"))
            ctx.strokeStyle = lineGradient
            ctx.lineWidth = isDark ? 4 : 3

            ctx.beginPath()
            ctx.moveTo(-size, 0)
            ctx.lineTo(size, 0)
            ctx.stroke()
            break

          default:
            // Enhanced dot with radial gradient
            const radialGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size)
            radialGradient.addColorStop(0, particle.color)
            radialGradient.addColorStop(0.7, particle.color + (isDark ? "cc" : "80"))
            radialGradient.addColorStop(1, particle.color + "00")
            ctx.fillStyle = radialGradient

            ctx.beginPath()
            ctx.arc(0, 0, size, 0, Math.PI * 2)
            ctx.fill()
        }
      } catch (error) {
        // Fallback to simple circle if gradient creation fails
        ctx.beginPath()
        ctx.arc(0, 0, size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    // Animation loop with all the particle logic from the attachment
    const animate = () => {
      timeRef.current += 16
      const isDark = resolvedTheme === "dark"

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        if (!particle) return

        // Update position with physics
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.8
          particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.8
          particle.y = Math.max(0, Math.min(canvas.height, particle.y))
        }

        // Update rotation
        particle.angle += particle.rotationSpeed

        // Draw particle
        drawParticle(particle)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mounted, theme, resolvedTheme, variant, intensity])

  if (!mounted) {
    return null
  }

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}
