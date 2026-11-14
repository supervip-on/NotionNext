import { siteConfig } from '@/lib/config'
import { buildImageCandidates } from '@/lib/utils/randomImage'
import Head from 'next/head'
import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * 图片懒加载
 * @param {*} param0
 * @returns
 */
export default function LazyImage({
  priority,
  id,
  src,
  alt,
  placeholderSrc,
  className,
  width,
  height,
  title,
  onLoad,
  onClick,
  style
}) {
  const maxWidth = siteConfig('IMAGE_COMPRESS_WIDTH')
  const defaultPlaceholderSrc = siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')
  const imageRef = useRef(null)
  const candidates = useMemo(() => buildImageCandidates(src), [src])
  const [candidateIndex, setCandidateIndex] = useState(0)
  const [currentSrc, setCurrentSrc] = useState(
    placeholderSrc || defaultPlaceholderSrc
  )
  const activeSrc =
    candidates[Math.min(candidateIndex, candidates.length - 1)] || src

  // 图片地址变化时重新从第一个渠道开始尝试
  useEffect(() => {
    setCandidateIndex(0)
  }, [src])

  /**
   * 占位图加载成功
   */
  const handleThumbnailLoaded = () => {
    if (typeof onLoad === 'function') {
      // onLoad() // 触发传递的onLoad回调函数
    }
  }
  // 原图加载完成
  const handleImageLoaded = img => {
    if (typeof onLoad === 'function') {
      onLoad() // 触发传递的onLoad回调函数
    }
    // 移除占位符类名
    if (imageRef.current) {
      imageRef.current.classList.remove('lazy-image-placeholder')
    }
  }
  /**
   * 图片加载失败回调：依次尝试下一个随机图渠道
   */
  const handleImageError = () => {
    setCandidateIndex(index => {
      if (index < candidates.length - 1) {
        return index + 1
      }
      // 所有渠道都失败，退回占位图
      setCurrentSrc(placeholderSrc || defaultPlaceholderSrc)
      if (imageRef.current) {
        imageRef.current.classList.remove('lazy-image-placeholder')
      }
      return index
    })
  }

  useEffect(() => {
    const adjustedImageSrc =
      adjustImgSize(activeSrc, maxWidth) || defaultPlaceholderSrc
    let cancelled = false

    const preload = () => {
      const img = new Image()
      // 设置图片解码优先级
      if ('decoding' in img) {
        img.decoding = 'async'
      }
      img.src = adjustedImageSrc
      img.onload = () => {
        if (cancelled) return
        setCurrentSrc(adjustedImageSrc)
        handleImageLoaded(adjustedImageSrc)
      }
      img.onerror = () => {
        if (!cancelled) handleImageError()
      }
    }

    // 优先级图片或不支持 IntersectionObserver 时直接加载
    if (priority || !window.IntersectionObserver) {
      preload()
      return () => {
        cancelled = true
      }
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 预加载图片
            preload()
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: siteConfig('LAZY_LOAD_THRESHOLD', '200px'),
        threshold: 0.1
      }
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      cancelled = true
      if (imageRef.current) {
        observer.unobserve(imageRef.current)
      }
    }
  }, [activeSrc, maxWidth, priority])

  // 动态添加width、height和className属性，仅在它们为有效值时添加
  const imgProps = {
    ref: imageRef,
    src: currentSrc,
    'data-src': src, // 存储原始图片地址
    alt: alt || 'Lazy loaded image',
    onLoad: handleThumbnailLoaded,
    onError: handleImageError,
    className: `${className || ''} lazy-image-placeholder`,
    style,
    width: width || 'auto',
    height: height || 'auto',
    onClick,
    // 性能优化属性
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    // 现代图片格式支持
    ...(siteConfig('WEBP_SUPPORT') && { 'data-webp': true }),
    ...(siteConfig('AVIF_SUPPORT') && { 'data-avif': true })
  }

  if (id) imgProps.id = id
  if (title) imgProps.title = title

  if (!src) {
    return null
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...imgProps} />
      {/* 预加载 */}
      {priority && (
        <Head>
          <link rel='preload' as='image' href={adjustImgSize(src, maxWidth)} />
        </Head>
      )}
    </>
  )
}

/**
 * 根据窗口尺寸决定压缩图片宽度
 * 移动端使用更小的图片尺寸以加快加载
 * @param {*} src
 * @param {*} maxWidth
 * @returns
 */
const adjustImgSize = (src, maxWidth) => {
  if (!src) {
    return null
  }

  // 移动端检测：使用更小的图片尺寸
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const mobileMaxWidth = 400 // 移动端最大图片宽度
  const effectiveMaxWidth = isMobile ? mobileMaxWidth : maxWidth

  const screenWidth =
    (typeof window !== 'undefined' && window?.screen?.width) || effectiveMaxWidth

  // 屏幕尺寸大于默认图片尺寸，没必要再压缩
  if (screenWidth > effectiveMaxWidth) {
    // 移动端始终压缩到 mobileMaxWidth
    if (isMobile) {
      const widthRegex = /width=\d+/
      const wRegex = /w=\d+/
      return src
        .replace(widthRegex, `width=${mobileMaxWidth}`)
        .replace(wRegex, `w=${mobileMaxWidth}`)
    }
    return src
  }

  // 正则表达式，用于匹配 URL 中的 width 参数
  const widthRegex = /width=\d+/
  // 正则表达式，用于匹配 URL 中的 w 参数
  const wRegex = /w=\d+/

  // 使用正则表达式替换 width/w 参数
  return src
    .replace(widthRegex, `width=${screenWidth}`)
    .replace(wRegex, `w=${screenWidth}`)
}
