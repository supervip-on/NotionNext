#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const workflowsDir = path.join(__dirname, '../public/workflows');

console.log('开始扁平化工作流文件结构...');

// 检查是否有文件名冲突
function checkFileConflicts() {
    const conflicts = [];
    const rootFiles = new Set();
    
    // 获取根目录所有文件
    const rootFilesList = fs.readdirSync(workflowsDir)
        .filter(file => file.endsWith('.json'));
    
    rootFilesList.forEach(file => rootFiles.add(file));
    
    // 查找子目录中的文件
    function findSubdirectoryFiles(dir) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                findSubdirectoryFiles(fullPath);
            } else if (item.endsWith('.json')) {
                if (rootFiles.has(item)) {
                    conflicts.push({
                        filename: item,
                        existingPath: path.join(workflowsDir, item),
                        newPath: fullPath
                    });
                }
            }
        }
    }
    
    const items = fs.readdirSync(workflowsDir);
    for (const item of items) {
        const fullPath = path.join(workflowsDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            findSubdirectoryFiles(fullPath);
        }
    }
    
    return conflicts;
}

// 移动文件
function moveFiles() {
    let movedCount = 0;
    let errorCount = 0;
    
    function processDirectory(dir) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                processDirectory(fullPath);
                
                // 如果目录为空，删除它
                try {
                    const remainingItems = fs.readdirSync(fullPath);
                    if (remainingItems.length === 0) {
                        fs.rmdirSync(fullPath);
                        console.log(`删除空目录: ${fullPath}`);
                    }
                } catch (error) {
                    console.error(`检查目录时出错 ${fullPath}:`, error.message);
                }
            } else if (item.endsWith('.json')) {
                const targetPath = path.join(workflowsDir, item);
                
                try {
                    // 如果目标文件已存在，跳过（应该已经通过冲突检查处理）
                    if (fs.existsSync(targetPath)) {
                        console.log(`跳过已存在的文件: ${item}`);
                        continue;
                    }
                    
                    fs.renameSync(fullPath, targetPath);
                    console.log(`移动文件: ${fullPath} -> ${targetPath}`);
                    movedCount++;
                } catch (error) {
                    console.error(`移动文件失败 ${fullPath}:`, error.message);
                    errorCount++;
                }
            }
        }
    }
    
    processDirectory(workflowsDir);
    
    return { movedCount, errorCount };
}

// 主函数
function main() {
    try {
        // 检查文件名冲突
        console.log('检查文件名冲突...');
        const conflicts = checkFileConflicts();
        
        if (conflicts.length > 0) {
            console.log('\n发现文件名冲突:');
            conflicts.forEach(conflict => {
                console.log(`- ${conflict.filename}`);
                console.log(`  已存在: ${conflict.existingPath}`);
                console.log(`  新文件: ${conflict.newPath}`);
            });
            console.log('\n请先处理这些冲突后再运行脚本。');
            process.exit(1);
        }
        
        console.log('没有发现文件名冲突，开始移动文件...\n');
        
        // 移动文件
        const result = moveFiles();
        
        console.log('\n=== 操作完成 ===');
        console.log(`成功移动文件: ${result.movedCount}`);
        console.log(`失败文件: ${result.errorCount}`);
        
        if (result.errorCount === 0) {
            console.log('所有文件已成功移动到根目录！');
        } else {
            console.log('部分文件移动失败，请检查错误信息。');
            process.exit(1);
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

module.exports = { checkFileConflicts, moveFiles };