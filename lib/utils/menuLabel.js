/**
 * 菜单文案支持 "中文|English" 双语写法，按当前语言取对应部分。
 * 未使用该写法时原样返回。
 * @param {string} label 菜单标题
 * @param {string} lang 当前语言，如 zh-CN / en-US
 * @returns {string}
 */
export function getMenuLabel(label, lang) {
  if (typeof label !== 'string' || label.indexOf('|') < 0) {
    return label
  }
  const index = label.indexOf('|')
  const zh = label.slice(0, index).trim()
  const en = label.slice(index + 1).trim()
  const isEnglish = String(lang || '').toLowerCase().startsWith('en')
  return (isEnglish ? en || zh : zh || en) || label
}
