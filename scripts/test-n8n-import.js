#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const workflowsDir = '/Users/raravc/mysoft/notionnextwebsite/NotionNext/public/workflows';

console.log('=== n8n 工作流导入兼容性测试 ===\n');

// 测试几个不同类型的工作流
const testFiles = [
  '599_image_watermark.json',  // 数字ID开头
  'OpenAI-powered tweet generator.json',  // 无数字ID
  '1399_telegram_profanity_detector.json',  // 刚修复的文件
  'Detect toxic language in Telegram messages.json',  // 刚修复的文件
  '10001_Download_TikTok_Videos_Without_Watermarks_via_Telegram_Bot.json',  // 大数字ID
];

let passedTests = 0;
let totalTests = testFiles.length;

testFiles.forEach((file, index) => {
  const filePath = path.join(workflowsDir, file);
  console.log(`测试 ${index + 1}/${totalTests}: ${file}`);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`   ❌ 文件不存在`);
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8').trim();
    
    // 1. 检查 JSON 格式
    let parsed;
    try {
      parsed = JSON.parse(content);
      console.log(`   ✅ JSON 格式有效`);
    } catch (error) {
      console.log(`   ❌ JSON 格式错误: ${error.message}`);
      return;
    }
    
    // 2. 检查必需字段
    if (!parsed.id) {
      console.log(`   ❌ 缺少 id 字段`);
      return;
    }
    console.log(`   ✅ 包含 id 字段: ${parsed.id}`);
    
    if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
      console.log(`   ❌ 缺少或无效的 nodes 字段`);
      return;
    }
    console.log(`   ✅ 包含 nodes 数组: ${parsed.nodes.length} 个节点`);
    
    // 3. 检查节点结构
    const hasValidNodes = parsed.nodes.every(node => 
      node.name && node.type && node.position
    );
    if (!hasValidNodes) {
      console.log(`   ⚠️  部分节点缺少必需字段`);
    } else {
      console.log(`   ✅ 所有节点结构完整`);
    }
    
    // 4. 检查连接（如果存在）
    if (parsed.connections) {
      console.log(`   ✅ 包含连接配置`);
    } else {
      console.log(`   ℹ️  无连接配置（独立工作流）`);
    }
    
    // 5. 模拟 n8n 导入验证
    const importCheck = simulateN8nImport(parsed);
    if (importCheck.valid) {
      console.log(`   ✅ 通过 n8n 导入兼容性检查`);
      passedTests++;
    } else {
      console.log(`   ❌ n8n 导入兼容性检查失败: ${importCheck.error}`);
    }
    
  } catch (error) {
    console.log(`   ❌ 测试失败: ${error.message}`);
  }
  
  console.log('');
});

console.log('=== 测试结果 ===');
console.log(`通过测试: ${passedTests}/${totalTests}`);
console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(2)}%\n`);

if (passedTests === totalTests) {
  console.log('🎉 所有测试通过！工作流应该可以正常导入到 n8n 中。');
} else {
  console.log('⚠️  部分测试未通过，可能需要进一步修复。');
}

// 模拟 n8n 导入验证的函数
function simulateN8nImport(workflow) {
  try {
    // 检查基本结构
    if (!workflow.id || typeof workflow.id !== 'string') {
      return { valid: false, error: '无效的工作流 ID' };
    }
    
    if (!workflow.nodes || !Array.isArray(workflow.nodes) || workflow.nodes.length === 0) {
      return { valid: false, error: '无效或空的节点数组' };
    }
    
    // 检查每个节点
    for (const node of workflow.nodes) {
      // n8n 可以自动生成缺少的节点 ID，所以这是可选的
      if (!node.name || !node.type) {
        return { valid: false, error: '节点缺少必需字段 (name, type)' };
      }
      
      if (!node.position || !Array.isArray(node.position) || node.position.length !== 2) {
        return { valid: false, error: '节点位置配置无效' };
      }
    }
    
    // 检查连接（如果存在）
    if (workflow.connections) {
      for (const [sourceNode, connections] of Object.entries(workflow.connections)) {
        if (!connections.main || !Array.isArray(connections.main)) {
          return { valid: false, error: '连接配置格式无效' };
        }
      }
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}