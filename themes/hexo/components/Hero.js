// import Image from 'next/image'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useRef } from 'react'
import CONFIG from '../config'
import HeroBackground from './HeroBackground'
import NavButtonGroup from './NavButtonGroup'

let wrapperTop = 0

/**
 * 顶部全屏大图
 * @returns
 */
const Hero = props => {
  const typedRef = useRef()
  const { siteInfo } = props
  const { locale } = useGlobal()
  const scrollToWrapper = () => {
    window.scrollTo({ top: wrapperTop, behavior: 'smooth' })
  }

  const GREETING_WORDS = siteConfig('GREETING_WORDS').split(',')
  const firstGreeting = GREETING_WORDS[0] || ''
  useEffect(() => {
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)

    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    )?.matches
    let idleId
    let cancelled = false
    const useIdle = typeof window.requestIdleCallback === 'function'

    // 首句先由 SSR 直接展示，打字脚本在空闲时才加载，避免拖慢首屏
    if (!reduceMotion && document.getElementById('typed')) {
      const startTyping = () => {
        if (cancelled) return
        loadExternalResource('/js/typed.min.js', 'js').then(() => {
          if (cancelled || typedRef.current || !window.Typed) return
          typedRef.current = new window.Typed('#typed', {
            strings: siteConfig('GREETING_WORDS').split(','),
            typeSpeed: 200,
            backSpeed: 100,
            backDelay: 400,
            showCursor: true,
            smartBackspace: true
          })
        })
      }
      if (useIdle) {
        idleId = window.requestIdleCallback(startTyping, { timeout: 1200 })
      } else {
        idleId = setTimeout(startTyping, 300)
      }
    }

    return () => {
      cancelled = true
      window.removeEventListener('resize', updateHeaderHeight)
      if (idleId) {
        if (useIdle) window.cancelIdleCallback(idleId)
        else clearTimeout(idleId)
      }
      typedRef.current?.destroy?.()
      typedRef.current = null
    }
  }, [])

  function updateHeaderHeight() {
    requestAnimationFrame(() => {
      const wrapperElement = document.getElementById('wrapper')
      wrapperTop = wrapperElement?.offsetTop
    })
  }

  return (
    <header
      id='header'
      style={{ zIndex: 1 }}
      className='w-full h-screen relative bg-black'>
      <HeroBackground />
      <div className='text-white absolute bottom-0 z-10 flex flex-col h-full items-center justify-center w-full '>
        {/* 站点标题 */}
        <div className='font-black text-4xl md:text-5xl shadow-text'>
          {siteInfo?.title || siteConfig('TITLE')}
        </div>
        {/* 站点欢迎语 */}
        <div className='mt-2 h-12 items-center text-center font-medium shadow-text text-lg'>
          <span id='typed'>{firstGreeting}</span>
        </div>

        {/* 首页导航大按钮 */}
        {siteConfig('HEXO_HOME_NAV_BUTTONS', null, CONFIG) && (
          <NavButtonGroup {...props} />
        )}

        {/* 滚动按钮 */}
        <div
          onClick={scrollToWrapper}
          className='z-10 cursor-pointer w-full text-center py-4 text-3xl absolute bottom-10 text-white'>
          <div className='opacity-70 animate-bounce text-xs'>
            {siteConfig('HEXO_SHOW_START_READING', null, CONFIG) &&
              locale.COMMON.START_READING}
          </div>
          <i className='opacity-70 animate-bounce fas fa-angle-down' />
        </div>
      </div>

    </header>
  )
}

export default Hero
