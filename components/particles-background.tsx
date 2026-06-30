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

export function ParticlesBackground({ variant = "fitness", intensity = "medium" }: ParticleEffectsProps = {}) {
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

    // Draw particle trail
    const drawTrail = (particle: Particle) => {
      if (particle.trail.length < 2) return

      const isDark = resolvedTheme === "dark"

      ctx.save()
      ctx.strokeStyle = particle.color
      ctx.lineWidth = isDark ? 2 : 1
      ctx.lineCap = "round"

      for (let i = 1; i < particle.trail.length; i++) {
        const current = particle.trail[i]
        const previous = particle.trail[i - 1]

        if (current && previous) {
          ctx.globalAlpha = current.opacity * particle.opacity * (isDark ? 0.8 : 0.5)
          ctx.beginPath()
          ctx.moveTo(previous.x, previous.y)
          ctx.lineTo(current.x, current.y)
          ctx.stroke()
        }
      }

      ctx.restore()
    }

    // Create connection lines between nearby particles
    const drawConnections = () => {
      const maxDistance = 120
      const colors = getThemeColors()
      const isDark = resolvedTheme === "dark"

      ctx.save()

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]

          if (!p1 || !p2) continue

          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            // Enhanced opacity for dark mode
            const opacity = isDark
              ? (1 - distance / maxDistance) * 0.4 // Higher opacity in dark mode
              : (1 - distance / maxDistance) * 0.2

            ctx.globalAlpha = opacity
            ctx.strokeStyle = colors.connection
            ctx.lineWidth = isDark ? 1.5 : 1

            // Add glow effect to connections in dark mode
            if (isDark) {
              ctx.shadowColor = colors.connection
              ctx.shadowBlur = 8
            }

            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()

            // Reset shadow for next iteration
            ctx.shadowBlur = 0
          }
        }
      }

      ctx.restore()
    }

    // Mouse interaction effect
    const handleMouseInteraction = () => {
      const mouse = mouseRef.current
      const attractionRadius = 200
      const repulsionRadius = 50
      const isDark = resolvedTheme === "dark"

      particlesRef.current.forEach((particle) => {
        if (!particle) return

        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < attractionRadius && distance > 0) {
          const force = (attractionRadius - distance) / attractionRadius

          if (distance < repulsionRadius) {
            // Repulsion
            particle.vx -= (dx / distance) * force * 0.5
            particle.vy -= (dy / distance) * force * 0.5
          } else {
            // Attraction
            particle.vx += (dx / distance) * force * 0.1
            particle.vy += (dy / distance) * force * 0.1
          }

          // Increase glow when near mouse
          particle.glowIntensity = Math.min(isDark ? 2 : 1, particle.glowIntensity + force * 0.2)
        } else {
          // Fade glow when away from mouse
          particle.glowIntensity = Math.max(isDark ? 0.5 : 0.3, particle.glowIntensity - 0.02)
        }
      })
    }

    // Animation loop
    const animate = () => {
      timeRef.current += 16 // Approximate 60fps
      const isDark = resolvedTheme === "dark"

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Handle mouse interaction
      handleMouseInteraction()

      // Draw connections first (behind particles)
      if (intensity !== "low") {
        drawConnections()
      }

      particlesRef.current.forEach((particle, index) => {
        if (!particle) return

        // Update trail
        particle.trail.push({
          x: particle.x,
          y: particle.y,
          opacity: particle.opacity,
        })

        const maxTrailLength = isDark ? 12 : 8
        if (particle.trail.length > maxTrailLength) {
          particle.trail.shift()
        }

        // Update trail opacity
        particle.trail.forEach((point) => {
          if (point) {
            point.opacity *= isDark ? 0.96 : 0.94
          }
        })

        // Update position with physics
        particle.x += particle.vx
        particle.y += particle.vy

        // Add some drift
        particle.vx += (Math.random() - 0.5) * 0.02
        particle.vy += (Math.random() - 0.5) * 0.02

        // Limit velocity
        const maxVel = 3
        particle.vx = Math.max(-maxVel, Math.min(maxVel, particle.vx))
        particle.vy = Math.max(-maxVel, Math.min(maxVel, particle.vy))

        // Bounce off edges with energy loss
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

        // Update life and respawn
        particle.life -= 1
        if (particle.life <= 0) {
          // Respawn particle with updated colors
          const colors = getThemeColors()
          const allColors = [...colors.primary, ...colors.secondary, ...colors.accent]

          particle.life = particle.maxLife
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          particle.vx = (Math.random() - 0.5) * 2
          particle.vy = (Math.random() - 0.5) * 2
          particle.color = allColors[Math.floor(Math.random() * allColors.length)]
          particle.trail = []
        }

        // Breathing opacity effect
        const breathe = Math.sin(timeRef.current * 0.003 + index * 0.1) * (isDark ? 0.2 : 0.1)
        particle.opacity = Math.max(0.2, Math.min(isDark ? 1 : 0.8, particle.opacity + breathe))

        // Draw trail if intensity is high or in dark mode
        if (intensity === "high" || (isDark && intensity !== "low")) {
          drawTrail(particle)
        }

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
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" style={{ background: "transparent" }} />
  )
}
