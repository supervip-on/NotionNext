import BLOG from '@/blog.config'

function hashString(value) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/**
 * 解析渠道模板
 * {id} 替换为页面 id；{hash} 按页面 id 稳定映射到本地封面图序号
 */
export function resolveRandomImageUrl(template, pageId = '') {
  if (!template) return template
  const count = Math.max(1, Number(BLOG.RANDOM_IMAGE_LOCAL_COUNT) || 1)
  const index = (hashString(pageId || '') % count) + 1
  return template
    .replace(/\{id\}/g, pageId || '')
    .replace(/\{hash\}/g, String(index))
}

/**
 * 判断当前图片是否来自随机图片渠道
 * 只有随机图才需要多渠道兜底，Notion 正文图片保持原样
 */
function isRandomImage(src, template) {
  if (!template) return false
  const prefix = template.split('{')[0]
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

  const templates = [template, ...(BLOG.RANDOM_IMAGE_URLS || [])]

  // 本地哈希封面：src 已经是最终地址，只需要本地备用图兜底
  if (template.includes('{hash}') && !template.includes('{id}')) {
    return templates.reduce(
      (urls, url) => {
        if (
          url &&
          !url.includes('{id}') &&
          !url.includes('{hash}') &&
          !urls.includes(url)
        ) {
          urls.push(url)
        }
        return urls
      },
      [src]
    )
  }

  const pageId = extractPageId(src)
  const urls = []

  templates.forEach(url => {
    if (!url) return
    // 拿不到 id 时跳过依赖 {id} 的渠道，避免生成失效地址
    if (!pageId && url.includes('{id}')) return
    let resolved = resolveRandomImageUrl(url, pageId)
    if (pageId && !resolved.startsWith('/') && !/[?&]t=/.test(resolved)) {
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

  return urls
}
