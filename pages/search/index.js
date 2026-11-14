import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'
import { useRouter } from 'next/router'

/**
 * 搜索路由
 * @param {*} props
 * @returns
 */
const Search = props => {
  const { posts } = props

  const router = useRouter()
  const keyword = Array.isArray(router?.query?.s)
    ? router.query.s[0]
    : router?.query?.s

  let filteredPosts
  // 静态过滤
  if (keyword) {
    const kw = String(keyword).toLowerCase()
    filteredPosts = posts.filter(post => {
      const tagContent = Array.isArray(post?.tags)
        ? post.tags.join(' ')
        : post?.tags || ''
      const categoryContent = Array.isArray(post?.category)
        ? post.category.join(' ')
        : post?.category || ''
      const searchContent =
        (post?.title || '') +
        (post?.summary || '') +
        tagContent +
        categoryContent
      return searchContent.toLowerCase().includes(kw)
    })
  } else {
    filteredPosts = []
  }

  props = {
    ...props,
    posts: filteredPosts,
    postCount: filteredPosts.length,
    keyword
  }

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutSearch' {...props} />
}

/**
 * 浏览器前端搜索
 */
export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({
    from: 'search-props',
    locale
  })
  const { allPages } = props
  props.posts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default Search
