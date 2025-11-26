#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const workflowsDir = '/Users/raravc/mysoft/notionnextwebsite/NotionNext/public/workflows';

console.log('=== n8n 工作流格式验证报告 ===\n');

let totalFiles = 0;
let validFiles = 0;
let invalidFiles = 0;
let missingId = 0;
let missingNodes = 0;
let stillWrapped = 0;
const problematicFiles = [];

// 检查目录是否存在
if (!fs.existsSync(workflowsDir)) {
  console.error(`错误：工作流目录不存在: ${workflowsDir}`);
  process.exit(1);
}

// 读取所有 JSON 文件
const files = fs.readdirSync(workflowsDir).filter(file => file.endsWith('.json'));
totalFiles = files.length;

console.log(`总共检查 ${totalFiles} 个工作流文件...\n`);

files.forEach(file => {
  const filePath = path.join(workflowsDir, file);
  let isValid = true;
  let issues = [];

  try {
    const content = fs.readFileSync(filePath, 'utf8').trim();
    
    // 检查是否还是包装格式
    if (content.startsWith('{"workflow": {')) {
      stillWrapped++;
      isValid = false;
      issues.push('仍被包装在 {"workflow": {...}} 中');
    }

    // 解析 JSON
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      isValid = false;
      issues.push('JSON 格式无效');
      problematicFiles.push({ file, issues });
      invalidFiles++;
      return;
    }

    // 检查必需字段
    if (!parsed.id) {
      missingId++;
      isValid = false;
      issues.push('缺少 id 字段');
    }

    if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
      missingNodes++;
      isValid = false;
      issues.push('缺少 nodes 字段或 nodes 不是数组');
    }

    // 额外检查：nodes 数组是否为空
    if (parsed.nodes && Array.isArray(parsed.nodes) && parsed.nodes.length === 0) {
      issues.push('警告：nodes 数组为空');
    }

    if (isValid) {
      validFiles++;
    } else {
      invalidFiles++;
      problematicFiles.push({ file, issues });
    }

  } catch (error) {
    invalidFiles++;
    isValid = false;
    issues.push(`读取文件失败: ${error.message}`);
    problematicFiles.push({ file, issues });
  }
});

// 输出统计信息
console.log('=== 统计结果 ===');
console.log(`总文件数: ${totalFiles}`);
console.log(`有效文件: ${validFiles}`);
console.log(`无效文件: ${invalidFiles}`);
console.log(`仍被包装格式: ${stillWrapped}`);
console.log(`缺少 id 字段: ${missingId}`);
console.log(`缺少 nodes 字段: ${missingNodes}`);
console.log(`验证通过率: ${((validFiles / totalFiles) * 100).toFixed(2)}%\n`);

// 输出问题文件详情
if (problematicFiles.length > 0) {
  console.log('=== 问题文件详情 ===');
  problematicFiles.forEach(({ file, issues }) => {
    console.log(`\n📁 ${file}`);
    issues.forEach(issue => console.log(`   ❌ ${issue}`));
  });
  console.log('\n');
}

// 检查特定问题文件
console.log('=== 特殊文件检查 ===');
const specialFiles = [
  'OpenAI-powered tweet generator.json',
  'Analyze feedback using AWS Comprehend and send it to a Mattermost channel.json',
  'Add positive feedback messages to a table in Notion.json',
  'ChatGPT Automatic Code Review in Gitlab MR.json',
  'Detect toxic language in Telegram messages.json',
  '1399_telegram_profanity_detector.json'
];

specialFiles.forEach(file => {
  const filePath = path.join(workflowsDir, file);
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8').trim();
      const parsed = JSON.parse(content);
      console.log(`\n📁 ${file}`);
      console.log(`   ✅ JSON 格式有效`);
      console.log(`   ${parsed.id ? '✅' : '❌'} id 字段: ${parsed.id || '缺失'}`);
      console.log(`   ${parsed.nodes ? '✅' : '❌'} nodes 字段: ${parsed.nodes ? `${parsed.nodes.length} 个节点` : '缺失'}`);
      
      if (!parsed.id) {
        // 建议从文件名提取 ID
        const match = file.match(/^(\d+)_/);
        if (match) {
          console.log(`   💡 建议：可从文件名提取 ID: ${match[1]}`);
        }
      }
    } catch (error) {
      console.log(`\n📁 ${file}`);
      console.log(`   ❌ 错误: ${error.message}`);
    }
  } else {
    console.log(`\n📁 ${file}`);
    console.log(`   ⚠️  文件不存在`);
  }
});

// 总结
console.log('\n=== 总结 ===');
if (invalidFiles === 0) {
  console.log('🎉 所有工作流文件格式都正确！');
  console.log('✅ 可以正常导入到 n8n 中使用');
} else {
  console.log(`⚠️  还有 ${invalidFiles} 个文件需要修复`);
  console.log('🔧 建议运行修复脚本处理剩余问题');
}

// 退出码
process.exit(invalidFiles === 0 ? 0 : 1);
