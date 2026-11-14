import busuanzi from '@/lib/plugins/busuanzi'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
// import { useRouter } from 'next/router'
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
  router.events.on('routeChangeComplete', (url, option) => {
    if (url !== path) {
      path = url
      loadStats()
    }
  })

  // 更换主题时更新
  useEffect(() => {
    if (theme) {
      loadStats()
    }
  }, [theme])
  return null
}
