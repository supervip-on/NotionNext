import { SpeedInsights } from '@vercel/speed-insights/next'
import { useEffect, useState } from 'react'

/**
 * Vercel Speed Insights：真实用户性能指标
 * 本地开发没有对应接口，跳过上报
 */
export default function VercelSpeedInsights() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const host = window.location.hostname
    setEnabled(!['localhost', '127.0.0.1', '0.0.0.0'].includes(host))
  }, [])

  return enabled ? <SpeedInsights /> : null
}
