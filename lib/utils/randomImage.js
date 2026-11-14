import BLOG from '@/blog.config'

/**
 * 判断当前图片是否来自随机图片渠道
 * 只有随机图才需要多渠道兜底，Notion 正文图片保持原样
 */
function isRandomImage(src, template) {
  if (!template) return false
  const prefix = template.split('{id}')[0]
  return prefix ? src.startsWith(prefix) : src === template
}

function extractPageId(src) {
  const matched = src.match(/[?&]t=([^&]+)/)
  if (matched) return decodeURIComponent(matched[1])
  // 部分封面走的是无 t 参数的分支，从 URL 路径里兜底提取页面 id
  const uuid = src.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
  )
  return uuid ? uuid[0] : ''
}

/**
 * 生成随机图片的候选地址列表
 * 顺序即兜底顺序：第一个失败后依次尝试下一个
 */
export function buildImageCandidates(src) {
  if (!src) return []

  const template = BLOG.RANDOM_IMAGE_URL
  if (!isRandomImage(src, template)) return [src]

  const pageId = extractPageId(src)
  const urls = []
  const templates = [template, ...(BLOG.RANDOM_IMAGE_URLS || [])]

  templates.forEach(url => {
    if (!url) return
    // 拿不到 id 时跳过依赖 {id} 的渠道，避免生成失效地址
    if (!pageId && url.includes('{id}')) return
    let resolved = url.replace(/\{id\}/g, pageId)
    if (pageId && !/[?&]t=/.test(resolved)) {
      resolved += `${resolved.includes('?') ? '&' : '?'}t=${pageId}`
    }
    if (!urls.includes(resolved)) {
      urls.push(resolved)
    }
  })

  // 第一个渠道始终使用原始地址，避免无 id 时被模板改写
  if (!urls.includes(src)) {
    urls.unshift(src)
  }

  return urls.length > 0 ? urls : [src]
}
