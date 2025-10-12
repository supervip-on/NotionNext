import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
//import { DynamicLayout } from '@/themes/theme'
import { Layout404 } from '@/themes/hexo'

const NoFound = props => {
   return <Layout404 {...props} />
}

export async function getStaticProps(req) {
  const { locale } = req

  const props = (await getGlobalData({ from: '404', locale })) || {}
  return { props }
}

export default NoFound
