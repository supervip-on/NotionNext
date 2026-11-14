import { cleanCache } from '@/lib/cache/local_file_cache'

/**
 * 清理缓存
 * @param {*} req
 * @param {*} res
 */
export default function handler(req, res) {
  // 仅允许持有 CACHE_CLEAN_TOKEN 的请求清理缓存，避免被外部反复触发
  const token = process.env.CACHE_CLEAN_TOKEN
  if (!token || req.query.token !== token) {
    res.status(404).end()
    return
  }
  try {
    cleanCache()
    res.status(200).json({ status: 'success', message: 'Clean cache successful!' })
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Clean cache failed!', error })
  }
}
