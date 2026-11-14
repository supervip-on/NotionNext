import { useEffect, useRef } from 'react'

const MAX_PARTICLES = 42
const MOBILE_BREAKPOINT = 768
const FRAME_INTERVAL = 33 // 约 30fps，降低持续动画的耗电

/**
 * 首页 Hero 代码背景：极光渐变 + 稀疏粒子（无图片）
 */
export default function HeroBackground() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return undefined

    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    )?.matches
    // 移动端与减少动效偏好只保留静态极光
    if (reduceMotion || window.innerWidth < MOBILE_BREAKPOINT) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let width = 0
    let height = 0
    let particles = []
    let frameId = 0
    let lastDraw = 0
    let running = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = wrap.clientWidth
      height = wrap.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.max(
        18,
        Math.min(MAX_PARTICLES, Math.round((width * height) / 40000))
      )
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
        r: Math.random() * 1.3 + 0.5
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const maxDist = 120

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(125, 190, 255, ${
              0.24 * (1 - dist / maxDist)
            })`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }

        ctx.fillStyle = 'rgba(200, 225, 255, 0.65)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = time => {
      frameId = 0
      if (!running) return
      if (time - lastDraw >= FRAME_INTERVAL) {
        lastDraw = time
        draw()
      }
      frameId = requestAnimationFrame(loop)
    }

    const start = () => {
      running = true
      if (!frameId) frameId = requestAnimationFrame(loop)
    }

    const stop = () => {
      running = false
      if (frameId) {
        cancelAnimationFrame(frameId)
        frameId = 0
      }
    }

    const onVisibilityChange = () => {
      if (document.hidden) stop()
      else if (ready) start()
    }

    resize()

    // 首屏先让 CSS 极光完成绘制，粒子动画等空闲时再启动
    let ready = false
    const useIdle = typeof window.requestIdleCallback === 'function'
    const begin = () => {
      ready = true
      if (!document.hidden) start()
    }
    const idleId = useIdle
      ? window.requestIdleCallback(begin, { timeout: 1500 })
      : setTimeout(begin, 300)

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              if (ready && entry.isIntersecting && !document.hidden) start()
              else stop()
            },
            { threshold: 0 }
          )
        : null
    observer?.observe(wrap)

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(resize)
        : null
    resizeObserver?.observe(wrap)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      stop()
      if (useIdle) window.cancelIdleCallback(idleId)
      else clearTimeout(idleId)
      observer?.disconnect()
      resizeObserver?.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-hidden='true'
      className='hero-aurora absolute inset-0 overflow-hidden'>
      <div className='aurora-blob aurora-blob-1' />
      <div className='aurora-blob aurora-blob-2' />
      <div className='aurora-blob aurora-blob-3' />
      <div className='aurora-grid' />
      <div className='aurora-grain' />
      <canvas ref={canvasRef} className='aurora-particles' />
      <div className='aurora-shade' />
    </div>
  )
}
