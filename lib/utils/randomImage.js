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
  return matched ? decodeURIComponent(matched[1]) : ''
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
    let resolved = url.replace(/\{id\}/g, pageId)
    if (pageId && !/[?&]t=/.test(resolved)) {
      resolved += `${resolved.includes('?') ? '&' : '?'}t=${pageId}`
    }
    if (!urls.includes(resolved)) {
      urls.push(resolved)
    }
  })

  return urls.length > 0 ? urls : [src]
}
