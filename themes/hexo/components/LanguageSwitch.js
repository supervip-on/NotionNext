import { useEffect, useRef, useState } from 'react'
import { useGlobal } from '@/lib/global'

// 只切换界面菜单文字，文章内容与 URL 保持不变
const LANGUAGES = [
  { code: 'zh-CN', label: '中文' },
  { code: 'en-US', label: 'English' }
]

export default function LanguageSwitch() {
  const { lang, changeLang } = useGlobal()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDocClick = e => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open])

  const selectLang = code => {
    try {
      window.localStorage.setItem('PREFERRED_LANG', code)
    } catch (e) {
      // 隐私模式下忽略
    }
    changeLang(code)
    setOpen(false)
  }

  const isEnglish = String(lang || '').toLowerCase().startsWith('en')

  return (
    <div ref={wrapRef} className='relative'>
      <div
        role='button'
        aria-label='切换语言'
        title={isEnglish ? '切换到中文' : 'Switch to English'}
        onClick={() => setOpen(!open)}
        className='w-8 h-8 flex justify-center items-center cursor-pointer'>
        <svg
          viewBox='0 0 24 24'
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <circle cx='12' cy='12' r='9' />
          <path d='M3 12h18' />
          <path d='M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18' />
        </svg>
      </div>
      {open && (
        <div className='absolute right-0 top-full mt-1 w-24 rounded-lg border bg-white dark:bg-hexo-black-gray dark:border-black shadow-md py-1 z-50 text-sm text-gray-700 dark:text-gray-200'>
          {LANGUAGES.map(item => {
            const active = isEnglish
              ? item.code === 'en-US'
              : item.code === 'zh-CN'
            return (
              <div
                key={item.code}
                onClick={() => selectLang(item.code)}
                className={`px-3 py-1.5 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  active ? 'text-indigo-600 dark:text-indigo-400' : ''
                }`}>
                {item.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
