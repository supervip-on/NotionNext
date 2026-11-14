/* eslint-disable react/no-unknown-property */
import { siteConfig } from '@/lib/config'
import CONFIG from './config'

/**
 * 这里的css样式只对当前主题生效
 * 主题客制化css
 * @returns
 */
const Style = () => {
  // 从配置中获取主题色，如果没有配置则使用默认值 #928CEE
  const themeColor = siteConfig('HEXO_THEME_COLOR', '#928CEE', CONFIG)

  return (
    <style jsx global>{`
      :root {
        --theme-color: ${themeColor};
      }

      // 底色
      #theme-hexo body {
        background-color: #f5f5f5;
      }
      .dark #theme-hexo body {
        background-color: black;
      }

      /*  菜单下划线动画 */
      #theme-hexo .menu-link {
        text-decoration: none;
        background-image: linear-gradient(
          var(--theme-color),
          var(--theme-color)
        );
        background-repeat: no-repeat;
        background-position: bottom center;
        background-size: 0 2px;
        transition: background-size 100ms ease-in-out;
      }

      #theme-hexo .menu-link:hover {
        background-size: 100% 2px;
        color: var(--theme-color);
      }

      /* 文章列表中标题行悬浮时的文字颜色 */
      #theme-hexo h2:hover .menu-link {
        color: var(--theme-color) !important;
      }
      .dark #theme-hexo h2:hover .menu-link {
        color: var(--theme-color) !important;
      }

      /* 下拉菜单悬浮背景色 */
      #theme-hexo li[class*='hover:bg-indigo-500']:hover {
        background-color: var(--theme-color) !important;
      }

      /* tag标签悬浮背景色 */
      #theme-hexo a[class*='hover:bg-indigo-400']:hover {
        background-color: var(--theme-color) !important;
      }

      /* 社交按钮悬浮颜色 */
      #theme-hexo i[class*='hover:text-indigo-600']:hover {
        color: var(--theme-color) !important;
      }
      .dark #theme-hexo i[class*='dark:hover:text-indigo-400']:hover {
        color: var(--theme-color) !important;
      }

      /* MenuGroup 悬浮颜色 */
      #theme-hexo #nav div[class*='hover:text-indigo-600']:hover {
        color: var(--theme-color) !important;
      }
      .dark #theme-hexo #nav div[class*='dark:hover:text-indigo-400']:hover {
        color: var(--theme-color) !important;
      }

      /* 最新发布文章悬浮颜色 */
      #theme-hexo div[class*='hover:text-indigo-600']:hover,
      #theme-hexo div[class*='hover:text-indigo-400']:hover {
        color: var(--theme-color) !important;
      }

      /* 分页组件颜色 */
      #theme-hexo .text-indigo-400 {
        color: var(--theme-color) !important;
      }
      #theme-hexo .border-indigo-400 {
        border-color: var(--theme-color) !important;
      }
      #theme-hexo a[class*='hover:bg-indigo-400']:hover {
        background-color: var(--theme-color) !important;
        color: white !important;
      }
      /* 移动设备下，搜索组件中选中分类的高亮背景色 */
      #theme-hexo div[class*='hover:bg-indigo-400']:hover {
        background-color: var(--theme-color) !important;
      }
      #theme-hexo .hover\:bg-indigo-400:hover {
        background-color: var(--theme-color) !important;
      }
      #theme-hexo .bg-indigo-400 {
        background-color: var(--theme-color) !important;
      }
      #theme-hexo a[class*='hover:bg-indigo-600']:hover {
        background-color: var(--theme-color) !important;
        color: white !important;
      }

      /* 右下角悬浮按钮背景色 */
      #theme-hexo .bg-indigo-500 {
        background-color: var(--theme-color) !important;
      }
      .dark #theme-hexo .dark\:bg-indigo-500 {
        background-color: var(--theme-color) !important;
      }

      // 移动设备菜单栏选中背景色
      #theme-hexo div[class*='hover:bg-indigo-500']:hover {
        background-color: var(--theme-color) !important;
      }

      /* 文章浏览进度条颜色 */
      #theme-hexo .bg-indigo-600 {
        background-color: var(--theme-color) !important;
      }
      /* 当前浏览位置标题高亮颜色 */
      #theme-hexo .border-indigo-800 {
        border-color: var(--theme-color) !important;
      }
      #theme-hexo .text-indigo-800 {
        color: var(--theme-color) !important;
      }
      .dark #theme-hexo .dark\:text-indigo-400 {
        color: var(--theme-color) !important;
      }
      .dark #theme-hexo .dark\:border-indigo-400 {
        border-color: var(--theme-color) !important;
      }
      .dark #theme-hexo .dark\:border-white {
        border-color: var(--theme-color) !important;
      }
      /* 目录项悬浮时的字体颜色 */
      #theme-hexo a[class*='hover:text-indigo-800']:hover {
        color: var(--theme-color) !important;
      }
      /* 深色模式下目录项的默认文字颜色和边框线颜色 */
      .dark #theme-hexo .catalog-item {
        color: white !important;
        border-color: white !important;
      }
      .dark #theme-hexo .catalog-item:hover {
        color: var(--theme-color) !important;
      }
      /* 深色模式下当前高亮标题的边框线颜色 */
      .dark #theme-hexo .catalog-item.font-bold {
        border-color: var(--theme-color) !important;
      }

      /* 文章底部版权声明组件左侧边框线颜色 */
      #theme-hexo .border-indigo-500 {
        border-color: var(--theme-color) !important;
      }

      /* 归档页面文章列表项悬浮时左侧边框线颜色 */
      #theme-hexo li[class*='hover:border-indigo-500']:hover {
        border-color: var(--theme-color) !important;
      }

      /* 自定义右键菜单悬浮高亮颜色 */
      #theme-hexo .hover\:bg-blue-600:hover {
        background-color: var(--theme-color) !important;
      }
      .dark #theme-hexo li[class*='dark:hover:border-indigo-300']:hover {
        border-color: var(--theme-color) !important;
      }
      /* 深色模式下，归档页面文章列表项默认状态左侧边框线颜色 */
      .dark #theme-hexo li[class*='dark:border-indigo-400'] {
        border-color: var(--theme-color) !important;
      }
      /* 深色模式下，归档页面文章标题悬浮时的文字颜色 */
      .dark #theme-hexo a[class*='dark:hover:text-indigo-300']:hover {
        color: var(--theme-color) !important;
      }

      /* 首页代码背景：极光渐变 + 粒子，无需图片 */
      #theme-hexo .hero-aurora {
        background: #05070f;
      }
      #theme-hexo .aurora-blob {
        position: absolute;
        border-radius: 9999px;
        filter: blur(80px);
        opacity: 0.5;
        transform: translate3d(0, 0, 0);
        will-change: transform;
      }
      #theme-hexo .aurora-blob-1 {
        width: 58vmax;
        height: 58vmax;
        left: -14vmax;
        top: -20vmax;
        background: radial-gradient(
          circle,
          rgba(92, 102, 255, 0.9) 0%,
          rgba(92, 102, 255, 0) 68%
        );
      }
      #theme-hexo .aurora-blob-2 {
        width: 52vmax;
        height: 52vmax;
        right: -14vmax;
        top: 6vmax;
        background: radial-gradient(
          circle,
          rgba(34, 211, 238, 0.72) 0%,
          rgba(34, 211, 238, 0) 70%
        );
      }
      #theme-hexo .aurora-blob-3 {
        width: 64vmax;
        height: 44vmax;
        left: 12vmax;
        bottom: -22vmax;
        background: radial-gradient(
          circle,
          rgba(168, 85, 247, 0.66) 0%,
          rgba(168, 85, 247, 0) 70%
        );
      }
      #theme-hexo .aurora-grid {
        position: absolute;
        inset: 0;
        opacity: 0.55;
        background-image: linear-gradient(
            rgba(255, 255, 255, 0.05) 1px,
            transparent 1px
          ),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 64px 64px;
        -webkit-mask-image: radial-gradient(
          ellipse at 50% 40%,
          #000 0%,
          transparent 72%
        );
        mask-image: radial-gradient(
          ellipse at 50% 40%,
          #000 0%,
          transparent 72%
        );
      }
      #theme-hexo .aurora-grain {
        position: absolute;
        inset: 0;
        opacity: 0.05;
        mix-blend-mode: overlay;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
      }
      #theme-hexo .aurora-particles {
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: 0.8;
      }
      #theme-hexo .aurora-shade {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            ellipse at 50% 45%,
            rgba(3, 5, 10, 0) 0%,
            rgba(3, 5, 10, 0.32) 78%,
            rgba(3, 5, 10, 0.55) 100%
          ),
          linear-gradient(
            to bottom,
            rgba(3, 5, 10, 0.45) 0%,
            rgba(3, 5, 10, 0.12) 20%,
            rgba(3, 5, 10, 0.05) 55%,
            rgba(3, 5, 10, 0.85) 100%
          );
      }
      @keyframes aurora-float-1 {
        from {
          transform: translate3d(0, 0, 0) scale(1);
        }
        to {
          transform: translate3d(8vmax, 6vmax, 0) scale(1.15);
        }
      }
      @keyframes aurora-float-2 {
        from {
          transform: translate3d(0, 0, 0) scale(1.05);
        }
        to {
          transform: translate3d(-6vmax, 8vmax, 0) scale(0.95);
        }
      }
      @keyframes aurora-float-3 {
        from {
          transform: translate3d(0, 0, 0) scale(1);
        }
        to {
          transform: translate3d(5vmax, -7vmax, 0) scale(1.2);
        }
      }
      @media (min-width: 768px) {
        #theme-hexo .aurora-blob-1 {
          animation: aurora-float-1 42s ease-in-out infinite alternate;
        }
        #theme-hexo .aurora-blob-2 {
          animation: aurora-float-2 52s ease-in-out infinite alternate;
        }
        #theme-hexo .aurora-blob-3 {
          animation: aurora-float-3 60s ease-in-out infinite alternate;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #theme-hexo .aurora-blob {
          animation: none !important;
        }
      }

      /* Custem */
      .tk-footer {
        opacity: 0;
      }

      // 选中字体颜色
      ::selection {
        background: color-mix(in srgb, var(--theme-color) 30%, transparent);
      }

      // 自定义滚动条
      ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background-color: var(--theme-color);
      }

      * {
        scrollbar-width: thin;
        scrollbar-color: var(--theme-color) transparent;
      }
    `}</style>
  )
}

export { Style }
