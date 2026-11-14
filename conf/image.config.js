/**
 * 图片相关配置
 *
 * eg: images.unsplash.com(notion图床的所有图片都会替换),如果你在 notion 里已经添加了一个随机图片 url，恰巧那个服务跑路或者挂掉，想一键切换所有配图可以将该 url 配置在这里
 * 默认下会将你上传到 notion的主页封面图和头像也给替换，建议将主页封面图和头像放在其他图床，在 notion 里配置 link 即可。
 */

// 随机图片渠道，按顺序兜底：第一个加载失败自动尝试下一个
// {id} 替换为页面 id，{hash} 按页面 id 稳定映射到 public/images/covers 下的图片序号
const RANDOM_IMAGE_URLS = (() => {
  const envUrls = process.env.NEXT_PUBLIC_RANDOM_IMAGE_URLS
  if (envUrls) {
    return envUrls
      .split(',')
      .map(url => url.trim())
      .filter(Boolean)
  }

  const defaults = [
    '/images/covers/{hash}.jpg',
    process.env.NEXT_PUBLIC_RANDOM_IMAGE_URL,
    '/bg_image.jpg'
  ].filter(Boolean)

  return defaults
})()

module.exports = {
  NOTION_HOST: process.env.NEXT_PUBLIC_NOTION_HOST || 'https://www.notion.so', // Notion域名，您可以选择用自己的域名进行反向代理，如果不懂得什么是反向代理，请勿修改此项
  IMAGE_COMPRESS_WIDTH: process.env.NEXT_PUBLIC_IMAGE_COMPRESS_WIDTH || 640, // 图片压缩宽度默认值，640px足够卡片封面展示，文章内图片会使用更大尺寸
  IMAGE_ZOOM_IN_WIDTH: process.env.NEXT_PUBLIC_IMAGE_ZOOM_IN_WIDTH || 1200, // 文章图片点击放大后的画质宽度
  IMAGE_COMPRESS_QUALITY: process.env.NEXT_PUBLIC_IMAGE_COMPRESS_QUALITY || 70, // 图片压缩质量 0-100，70在移动端更友好
  RANDOM_IMAGE_URL: RANDOM_IMAGE_URLS[0], // 随机图片API,如果未配置下面的关键字，主页封面，头像，文章封面图都会被替换为随机图片
  RANDOM_IMAGE_URLS, // 随机图片渠道列表，可用 NEXT_PUBLIC_RANDOM_IMAGE_URLS（英文逗号分隔）覆盖
  RANDOM_IMAGE_LOCAL_COUNT: 6, // public/images/covers 下本地封面图的数量，{hash} 会映射到 1..N
  RANDOM_IMAGE_REPLACE_TEXT:
    process.env.NEXT_PUBLIC_RANDOM_IMAGE_NOT_REPLACE_TEXT ||
    'notion.so/images/page-cover', // images.unsplash.com触发替换图片的 url 关键字(多个支持用英文逗号分开)，只有图片地址中包含此关键字才会替换为上方随机图片url

  // 网站图片
  IMG_LAZY_LOAD_PLACEHOLDER:
    process.env.NEXT_PUBLIC_IMG_LAZY_LOAD_PLACEHOLDER ||
    'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', // 懒加载占位图片地址，支持base64或url
  IMG_URL_TYPE: process.env.NEXT_PUBLIC_IMG_TYPE || 'Notion', // 此配置已失效，请勿使用；AMAZON方案不再支持，仅支持Notion方案。 ['Notion','AMAZON'] 站点图片前缀 默认 Notion:(https://notion.so/images/xx) ， AMAZON(https://s3.us-west-2.amazonaws.com/xxx)
  IMG_SHADOW: process.env.NEXT_PUBLIC_IMG_SHADOW || false, // 文章图片是否自动添加阴影
  IMG_COMPRESS_WIDTH: process.env.NEXT_PUBLIC_IMG_COMPRESS_WIDTH || 800 // Notion图片压缩宽度
}
