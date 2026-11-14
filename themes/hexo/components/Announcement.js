import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// 公告正文使用完整的 Notion 渲染器（react-notion-x），体积较大，
// 首屏渲染时先占位，空闲后再加载，避免拖慢首页。
const NotionPage = dynamic(() => import('@/components/NotionPage'), {
  ssr: false
})

const Announcement = ({ post, className }) => {
  const { locale } = useGlobal()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (!post?.blockMap) return undefined
    const useIdle = typeof window.requestIdleCallback === 'function'
    const idleId = useIdle
      ? window.requestIdleCallback(() => setShowContent(true), { timeout: 2500 })
      : setTimeout(() => setShowContent(true), 2000)
    return () => {
      if (useIdle) window.cancelIdleCallback(idleId)
      else clearTimeout(idleId)
    }
  }, [post])

  if (!post?.blockMap) {
    return <></>
  }

  return (
    <div className={className}>
      <section
        id='announcement-wrapper'
        className='dark:text-gray-300 border dark:border-black rounded-xl lg:p-6 p-4 bg-white dark:bg-hexo-black-gray'>
        <div>
          <i className='mr-2 fas fa-bullhorn' />
          {locale.COMMON.ANNOUNCEMENT}
        </div>
        <div id='announcement-content' className='min-h-40'>
          {showContent && <NotionPage post={post} className='text-center' />}
        </div>
      </section>
    </div>
  )
}
export default Announcement
