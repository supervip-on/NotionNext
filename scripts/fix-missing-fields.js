#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const workflowsDir = path.join(__dirname, '../public/workflows');

console.log('开始修复缺失字段的工作流文件...');

// 修复缺少id字段的文件
function fixMissingId(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(content);
        
        // 如果已经有id字段，跳过
        if (parsed.id) {
            return { fixed: false, reason: '已有id字段' };
        }
        
        // 尝试从文件名提取id
        const filename = path.basename(filePath, '.json');
        const match = filename.match(/^(\d+)_/);
        if (match) {
            parsed.id = match[1];
            fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf8');
            return { fixed: true, id: match[1] };
        }
        
        return { fixed: false, reason: '无法从文件名提取id' };
        
    } catch (error) {
        console.error(`处理文件 ${filePath} 时出错:`, error.message);
        return { fixed: false, reason: error.message };
    }
}

// 修复缺少nodes字段的文件
function fixMissingNodes(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(content);
        
        // 如果已经有nodes字段，跳过
        if (parsed.nodes && Array.isArray(parsed.nodes)) {
            return { fixed: false, reason: '已有nodes字段' };
        }
        
        // 如果没有nodes字段，添加空数组
        parsed.nodes = [];
        fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf8');
        return { fixed: true };
        
    } catch (error) {
        console.error(`处理文件 ${filePath} 时出错:`, error.message);
        return { fixed: false, reason: error.message };
    }
}

// 批量修复文件
function fixAllFiles() {
    const files = fs.readdirSync(workflowsDir).filter(file => file.endsWith('.json'));
    
    let totalFiles = files.length;
    let fixedIdFiles = 0;
    let fixedNodesFiles = 0;
    let errorFiles = 0;
    
    console.log(`\n开始处理 ${totalFiles} 个文件...\n`);
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = path.join(workflowsDir, file);
        
        process.stdout.write(`\r进度: ${i + 1}/${totalFiles} (${Math.round((i + 1) / totalFiles * 100)}%)`);
        
        // 修复缺失的id字段
        const idResult = fixMissingId(filePath);
        if (idResult.fixed) {
            fixedIdFiles++;
        }
        
        // 修复缺失的nodes字段
        const nodesResult = fixMissingNodes(filePath);
        if (nodesResult.fixed) {
            fixedNodesFiles++;
        }
        
        if (!idResult.fixed && !nodesResult.fixed && 
            idResult.reason !== '已有id字段' && 
            idResult.reason !== '已有nodes字段') {
            errorFiles++;
        }
    }
    
    console.log('\n\n=== 修复完成 ===');
    console.log(`总文件数: ${totalFiles}`);
    console.log(`修复id字段: ${fixedIdFiles}`);
    console.log(`修复nodes字段: ${fixedNodesFiles}`);
    console.log(`错误文件: ${errorFiles}`);
    
    return { totalFiles, fixedIdFiles, fixedNodesFiles, errorFiles };
}

// 验证修复结果
function verifyFixes() {
    console.log('\n验证修复结果...');
    
    const files = fs.readdirSync(workflowsDir).filter(file => file.endsWith('.json'));
    let validFiles = 0;
    let invalidFiles = 0;
    
    // 随机抽样验证（最多检查100个文件）
    const sampleSize = Math.min(100, files.length);
    const sampleFiles = [];
    
    for (let i = 0; i < sampleSize; i++) {
        const randomIndex = Math.floor(Math.random() * files.length);
        sampleFiles.push(files[randomIndex]);
    }
    
    for (const file of sampleFiles) {
        const filePath = path.join(workflowsDir, file);
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const parsed = JSON.parse(content);
            
            // 检查是否为有效的工作流格式
            if (parsed && parsed.id && parsed.nodes && Array.isArray(parsed.nodes)) {
                validFiles++;
            } else {
                invalidFiles++;
                console.error(`无效格式: ${file}`);
            }
        } catch (error) {
            invalidFiles++;
            console.error(`JSON解析错误 ${file}: ${error.message}`);
        }
    }
    
    console.log(`\n验证结果（抽样 ${sampleSize} 个文件）:`);
    console.log(`有效格式: ${validFiles}`);
    console.log(`无效格式: ${invalidFiles}`);
    
    return invalidFiles === 0;
}

// 主函数
function main() {
    try {
        // 检查工作流目录是否存在
        if (!fs.existsSync(workflowsDir)) {
            console.error(`工作流目录不存在: ${workflowsDir}`);
            process.exit(1);
        }
        
        // 执行修复
        const result = fixAllFiles();
        
        // 验证结果
        const isValid = verifyFixes();
        
        if (isValid && result.errorFiles === 0) {
            console.log('\n✅ 所有文件修复成功！');
        } else {
            console.log('\n⚠️  修复过程中存在问题，请检查错误信息');
        }
        
    } catch (error) {
        console.error('脚本执行失败:', error);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = { fixMissingId, fixMissingNodes, fixAllFiles, verifyFixes };
