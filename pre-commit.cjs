#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

try {
  // 获取暂存区的文件列表
  const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(file => file.length > 0);

  if (stagedFiles.length === 0) {
    console.log('没有暂存的文件');
    process.exit(1);
  }

  const largeFiles = [];

  // 检查每个暂存文件的行数
  for (const file of stagedFiles) {
    // 检查文件是否存在（可能是删除的文件）
    if (!fs.existsSync(file)) {
      continue;
    }

    // 检查是否为代码文件（根据扩展名）
    const ext = path.extname(file).toLowerCase();
    const codeExtensions = ['.js','.vue', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.h', '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.clj', '.hs', '.ml', '.fs', '.vb', '.pl', '.sh', '.bash', '.zsh', '.fish', '.ps1', '.r', '.m', '.mm', '.dart', '.lua', '.vim', '.el', '.lisp', '.scm', '.rkt', '.jl', '.nim', '.cr', '.zig', '.v', '.sol', '.move'];
    
    if (!codeExtensions.includes(ext)) {
      continue;
    }

    try {
      // 读取文件内容并计算行数
      const content = fs.readFileSync(file, 'utf8');
      const lineCount = content.split('\n').length;

      if (lineCount > 1000) {
        largeFiles.push({
          file: file,
          lines: lineCount
        });
      }
    } catch (error) {
      console.warn(`警告: 无法读取文件 ${file}: ${error.message}`);
    }
  }

  // 如果有超过1000行的文件，提醒用户
  if (largeFiles.length > 0) {
    console.log('\n⚠️  警告: 发现以下代码文件超过1000行:');
    console.log('=' .repeat(50));
    
    largeFiles.forEach(item => {
      console.log(`📄 ${item.file}: ${item.lines} 行`);
    });
    
    console.log('=' .repeat(50));
    console.log('');
    console.log('请将上述超过1000行的代码进行重构，先了解原来代码，然后深度分析如何拆分，重构之后，功能要完全幂等幂等幂等幂等');
    console.log('');
    console.log('');
    console.log('\n是否继续提交？如需继续，请再次执行 git commit。');
    console.log('如需取消，请使用 Ctrl+C 或修改文件后重新提交。\n');
    
    // 不阻止提交，只是提醒
    // 如果需要阻止提交，可以取消注释下面这行
    // process.exit(1);
  } else {
    console.log('✅ 所有代码文件行数检查通过');
  }

  process.exit(1);

} catch (error) {
  console.error('Git Hook 执行出错:', error.message);
  process.exit(1);
}