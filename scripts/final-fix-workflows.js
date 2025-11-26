#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const workflowsDir = '/Users/raravc/mysoft/notionnextwebsite/NotionNext/public/workflows';

console.log('=== 最终修复脚本 - 处理剩余问题文件 ===\n');

let totalFiles = 0;
let fixedFiles = 0;
let errorFiles = 0;

// 检查目录是否存在
if (!fs.existsSync(workflowsDir)) {
  console.error(`错误：工作流目录不存在: ${workflowsDir}`);
  process.exit(1);
}

// 读取所有 JSON 文件
const files = fs.readdirSync(workflowsDir).filter(file => file.endsWith('.json'));
totalFiles = files.length;

console.log(`正在检查 ${totalFiles} 个工作流文件...\n`);

files.forEach((file, index) => {
  const filePath = path.join(workflowsDir, file);
  let needsFix = false;
  let fixType = '';

  try {
    const content = fs.readFileSync(filePath, 'utf8').trim();
    
    // 跳过空文件
    if (content.length === 0) {
      console.log(`${index + 1}/${totalFiles}: ${file} - 空文件，跳过`);
      return;
    }

    // 解析 JSON
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.log(`${index + 1}/${totalFiles}: ${file} - JSON 格式错误，尝试修复`);
      
      // 尝试修复 JSON 格式
      const fixedContent = fixJsonFormat(content);
      if (fixedContent) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`   ✅ 已修复 JSON 格式`);
        fixedFiles++;
        return;
      } else {
        console.log(`   ❌ 无法修复 JSON 格式: ${parseError.message}`);
        errorFiles++;
        return;
      }
    }

    // 检查并修复缺少的 id 字段
    if (!parsed.id) {
      needsFix = true;
      fixType = '添加 id 字段';
      
      // 尝试从文件名提取 ID
      const match = file.match(/^(\d+)_/);
      if (match) {
        parsed.id = match[1];
      } else {
        // 如果文件名没有数字 ID，使用一个默认值
        parsed.id = file.replace('.json', '').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      }
    }

    // 检查并修复缺少的 nodes 字段
    if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
      needsFix = true;
      fixType += (fixType ? ' 和 ' : '') + '添加 nodes 字段';
      parsed.nodes = [];
    }

    // 如果需要修复，写回文件
    if (needsFix) {
      const fixedContent = JSON.stringify(parsed, null, 2);
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`${index + 1}/${totalFiles}: ${file} - ${fixType}`);
      fixedFiles++;
    }

  } catch (error) {
    console.log(`${index + 1}/${totalFiles}: ${file} - 处理失败: ${error.message}`);
    errorFiles++;
  }
});

console.log(`\n=== 修复完成 ===`);
console.log(`总文件数: ${totalFiles}`);
console.log(`已修复: ${fixedFiles}`);
console.log(`错误文件: ${errorFiles}`);
console.log(`修复成功率: ${((fixedFiles / (fixedFiles + errorFiles)) * 100).toFixed(2)}%\n`);

// 修复 JSON 格式的辅助函数
function fixJsonFormat(content) {
  try {
    // 尝试常见的 JSON 修复
    let fixed = content.trim();
    
    // 移除可能的 BOM
    if (fixed.charCodeAt(0) === 0xFEFF) {
      fixed = fixed.slice(1);
    }
    
    // 尝试找到最后一个 } 的位置
    const lastBraceIndex = fixed.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      fixed = fixed.substring(0, lastBraceIndex + 1);
    }
    
    // 验证修复后的 JSON
    JSON.parse(fixed);
    return fixed;
  } catch (error) {
    return null;
  }
}

console.log('🎉 修复脚本执行完成！');
console.log('建议再次运行验证脚本检查结果。');