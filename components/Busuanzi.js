import busuanzi from '@/lib/plugins/busuanzi'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { useEffect } from 'react'

let path = ''
let lastLoadAt = 0

const loadStats = () => {
  // 首次挂载与路由事件可能同时触发，1.5 秒内只请求一次
  const now = Date.now()
  if (now - lastLoadAt < 1500) {
    return
  }
  lastLoadAt = now
  busuanzi.fetch({
    sitePvBase: Number(siteConfig('ANALYTICS_BUSUANZI_SITE_PV_BASE')) || 0,
    siteUvBase: Number(siteConfig('ANALYTICS_BUSUANZI_SITE_UV_BASE')) || 0
  })
}

export default function Busuanzi () {
  const { theme } = useGlobal()
  const router = useRouter()

  // 统计数值在首屏之外，空闲时再请求，避免和页面渲染抢资源
  useEffect(() => {
    if (!theme) return undefined
    const useIdle = typeof window.requestIdleCallback === 'function'
    const idleId = useIdle
      ? window.requestIdleCallback(loadStats, { timeout: 2000 })
      : setTimeout(loadStats, 1200)
    return () => {
      if (useIdle) window.cancelIdleCallback(idleId)
      else clearTimeout(idleId)
    }
  }, [theme])

  useEffect(() => {
    const handleRouteChange = url => {
      if (url !== path) {
        path = url
        loadStats()
      }
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  return null
}
