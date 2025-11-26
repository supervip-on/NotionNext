#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const workflowsDir = path.join(__dirname, '../public/workflows');
const backupDir = path.join(__dirname, '../public/workflows-backup');

console.log('开始修复工作流文件格式...');

// 创建备份目录
function createBackup() {
    console.log('创建备份目录...');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const { execSync } = require('child_process');
    console.log('备份工作流文件...');
    execSync(`cp -r "${workflowsDir}" "${backupDir}"`, { stdio: 'inherit' });
    console.log('备份完成！');
}

// 检查文件是否为包装格式
function isWrappedFormat(content) {
    try {
        const parsed = JSON.parse(content);
        // 检查是否有 workflow 包装层
        return parsed && parsed.workflow && typeof parsed.workflow === 'object';
    } catch (e) {
        return false;
    }
}

// 修复单个文件
function fixFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (!isWrappedFormat(content)) {
            return { fixed: false, reason: '不是包装格式' };
        }
        
        const parsed = JSON.parse(content);
        
        // 检查内层是否为有效的工作流格式
        if (!parsed.workflow || !parsed.workflow.id || !parsed.workflow.nodes) {
            return { fixed: false, reason: '内层不是有效的工作流格式' };
        }
        
        // 提取内层工作流内容
        const workflowContent = JSON.stringify(parsed.workflow, null, 2);
        
        // 写回文件
        fs.writeFileSync(filePath, workflowContent, 'utf8');
        
        return { fixed: true, originalSize: content.length, newSize: workflowContent.length };
        
    } catch (error) {
        console.error(`处理文件 ${filePath} 时出错:`, error.message);
        return { fixed: false, reason: error.message };
    }
}

// 批量修复文件
function fixAllFiles() {
    const files = fs.readdirSync(workflowsDir).filter(file => file.endsWith('.json'));
    
    let totalFiles = files.length;
    let fixedFiles = 0;
    let skippedFiles = 0;
    let errorFiles = 0;
    
    console.log(`\n开始处理 ${totalFiles} 个文件...\n`);
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = path.join(workflowsDir, file);
        
        process.stdout.write(`\r进度: ${i + 1}/${totalFiles} (${Math.round((i + 1) / totalFiles * 100)}%)`);
        
        const result = fixFile(filePath);
        
        if (result.fixed) {
            fixedFiles++;
        } else if (result.reason.includes('不是包装格式')) {
            skippedFiles++;
        } else {
            errorFiles++;
            console.error(`\n错误处理文件 ${file}: ${result.reason}`);
        }
    }
    
    console.log('\n\n=== 修复完成 ===');
    console.log(`总文件数: ${totalFiles}`);
    console.log(`成功修复: ${fixedFiles}`);
    console.log(`跳过文件（非包装格式）: ${skippedFiles}`);
    console.log(`错误文件: ${errorFiles}`);
    
    return { totalFiles, fixedFiles, skippedFiles, errorFiles };
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
        
        // 询问是否创建备份
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('是否创建备份？(y/n): ', (answer) => {
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                createBackup();
            }
            
            // 执行修复
            const result = fixAllFiles();
            
            // 验证结果
            const isValid = verifyFixes();
            
            if (isValid && result.errorFiles === 0) {
                console.log('\n✅ 所有文件修复成功！');
            } else {
                console.log('\n⚠️  修复过程中发现问题，请检查错误信息');
                if (result.errorFiles > 0) {
                    console.log('建议从备份恢复并调查错误原因');
                }
            }
            
            rl.close();
        });
        
    } catch (error) {
        console.error('脚本执行失败:', error);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = { fixFile, isWrappedFormat, fixAllFiles, verifyFixes };
