import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useState, useEffect } from 'react'
import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'
import PaginationNumber from './PaginationNumber'

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
  const [isMobile, setIsMobile] = useState(false)
  const [showAll, setShowAll] = useState(false)
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])
  
  // 移动端默认只显示6篇文章，点击"加载更多"显示全部
  const MOBILE_POSTS_LIMIT = 6
  const displayPosts = isMobile && !showAll ? posts.slice(0, MOBILE_POSTS_LIMIT) : posts
  const hasMorePosts = isMobile && posts.length > MOBILE_POSTS_LIMIT && !showAll
  
  if (!posts || posts.length === 0 || page > totalPage) {
    return <BlogPostListEmpty />
  } else {
    return (
      <div id='container' className='w-full'>
        {/* 文章列表 */}
        <div className='space-y-6 px-2'>
          {displayPosts?.map(post => (
            <BlogPostCard
              index={displayPosts.indexOf(post)}
              key={post.id}
              post={post}
              siteInfo={siteInfo}
            />
          ))}
        </div>
        {/* 移动端加载更多按钮 */}
        {hasMorePosts && (
          <div className='w-full text-center py-6'>
            <button 
              onClick={() => setShowAll(true)}
              className='px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
            >
              加载更多 ({posts.length - MOBILE_POSTS_LIMIT}篇)
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
