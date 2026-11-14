import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'

const Tag = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticProps({ params: { tag, page }, locale }) {
  const from = 'tag-page-props'
  const props = await fetchGlobalAllData({ from, locale })
  const revalidate = process.env.EXPORT
    ? undefined
    : siteConfig(
        'NEXT_REVALIDATE_SECOND',
        BLOG.NEXT_REVALIDATE_SECOND,
        props.NOTION_CONFIG
      )
  const pageNumber = Number(page)
  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    (Array.isArray(props?.tagOptions) &&
      props.tagOptions.length > 0 &&
      !props.tagOptions.some(t => t.name === tag))
  ) {
    return { notFound: true, revalidate }
  }

  // 过滤状态、标签
  props.posts = props.allPages
    ?.filter(page => page.type === 'Post' && page.status === 'Published')
    .filter(post => post && post?.tags && post?.tags.includes(tag))
  // 处理文章数
  props.postCount = props.posts.length
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
  const totalPages = Math.ceil(props.postCount / POSTS_PER_PAGE)
  if (totalPages > 0 && pageNumber > totalPages) {
    return { notFound: true, revalidate }
  }
  // 处理分页
  props.posts = props.posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )

  props.tag = tag
  props.page = page
  delete props.allPages
  return { props, revalidate }
}

export async function getStaticPaths() {
  const from = 'tag-page-static-path'
  const { tagOptions, allPages, NOTION_CONFIG } = await fetchGlobalAllData({ from })
  const paths = []
  tagOptions?.forEach(tag => {
    // 过滤状态类型
    const tagPosts = allPages
      ?.filter(page => page.type === 'Post' && page.status === 'Published')
      .filter(post => post && post?.tags && post?.tags.includes(tag.name))
    // 处理文章页数
    const postCount = tagPosts.length
    const totalPages = Math.ceil(
      postCount / siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
    )
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        paths.push({ params: { tag: tag.name, page: '' + i } })
      }
    }
  })
  return {
    paths: paths,
    fallback: true
  }
}

export default Tag
