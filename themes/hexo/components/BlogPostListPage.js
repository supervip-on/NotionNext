import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useEffect, useRef, useState } from 'react'
import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'
import PaginationNumber from './PaginationNumber'

// 首屏只渲染前 6 篇，滚动接近底部时逐批渲染剩余文章
const INITIAL_POSTS = 6
const LOAD_STEP = 6

/**
 * 文章列表分页表格
 * @param page 当前页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListPage = ({ page = 1, posts = [], postCount, siteInfo }) => {
  const { NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE)
  const showPagination = postCount >= POSTS_PER_PAGE
  const [visibleCount, setVisibleCount] = useState(INITIAL_POSTS)
  const sentinelRef = useRef(null)

  // 翻页或搜索条件变化时重置
  useEffect(() => {
    setVisibleCount(INITIAL_POSTS)
  }, [posts, page])

  const displayPosts = posts.slice(0, visibleCount)
  const hasMorePosts = visibleCount < posts.length

  // 滚动接近未渲染区域时自动加载下一批（直接跳到页底也能触发）
  useEffect(() => {
    if (!hasMorePosts) return undefined
    let ticking = false
    const check = () => {
      ticking = false
      const el = sentinelRef.current
      if (!el) return
      if (el.getBoundingClientRect().top < window.innerHeight + 300) {
        setVisibleCount(count => Math.min(count + LOAD_STEP, posts.length))
      }
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(check)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    check()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [hasMorePosts, posts.length, visibleCount])

  if (!posts || posts.length === 0 || page > totalPage) {
    return <BlogPostListEmpty />
  } else {
    return (
      <div id='container' className='w-full'>
        {/* 文章列表 */}
        <div className='space-y-6 px-2'>
          {displayPosts?.map((post, index) => (
            <BlogPostCard
              index={index}
              key={post.id}
              post={post}
              siteInfo={siteInfo}
            />
          ))}
        </div>
        {/* 剩余文章：滚动到这里自动加载，也可手动点击 */}
        {hasMorePosts && (
          <div ref={sentinelRef} className='w-full text-center py-6'>
            <button
              onClick={() =>
                setVisibleCount(count =>
                  Math.min(count + LOAD_STEP, posts.length)
                )
              }
              className='px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
              加载更多 ({posts.length - visibleCount}篇)
            </button>
          </div>
        )}
        {showPagination && (
          <PaginationNumber page={page} totalPage={totalPage} />
        )}
      </div>
    )
  }
}

export default BlogPostListPage
