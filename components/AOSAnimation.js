import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'
// import AOS from 'aos'

/**
 * 加载滚动动画
 * 改从外部CDN读取
 * https://michalsnik.github.io/aos/
 */
export default function AOSAnimation() {
  useEffect(() => {
    let cancelled = false
    const initAOS = () => {
      if (cancelled) return
      Promise.all([
        loadExternalResource('/js/aos.js', 'js'),
        loadExternalResource('/css/aos.css', 'css')
      ]).then(() => {
        if (!cancelled && window.AOS) {
          window.AOS.init()
        }
      })
    }

    // 动画只作用于首屏以下的列表，空闲时初始化即可
    const useIdle = typeof window.requestIdleCallback === 'function'
    const idleId = useIdle
      ? window.requestIdleCallback(initAOS, { timeout: 2000 })
      : setTimeout(initAOS, 800)

    return () => {
      cancelled = true
      if (useIdle) window.cancelIdleCallback(idleId)
      else clearTimeout(idleId)
    }
  }, [])

  return null
}
