import { loadExternalResource } from '@/lib/utils'
import { useEffect, useState } from 'react'
// import AOS from 'aos'

/**
 * 加载滚动动画
 * 改从外部CDN读取
 * https://michalsnik.github.io/aos/
 * 移动端不加载以提升性能
 */
export default function AOSAnimation() {
  const [shouldLoad, setShouldLoad] = useState(false)
  
  useEffect(() => {
    // 移动端不加载AOS动画
    if (window.innerWidth >= 768) {
      setShouldLoad(true)
    }
  }, [])
  
  useEffect(() => {
    if (!shouldLoad) return
    
    const initAOS = () => {
      Promise.all([
        loadExternalResource('/js/aos.js', 'js'),
        loadExternalResource('/css/aos.css', 'css')
      ]).then(() => {
        if (window.AOS) {
          window.AOS.init()
        }
      })
    }
    initAOS()
  }, [shouldLoad])
}
