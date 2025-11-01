#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// 引入验证函数
const { validateTag } = require('./validate-tag.cjs');

try {
  // 获取即将推送的引用（refs）
  // pre-push hook 会通过标准输入接收: <local-ref> <local-sha1> <remote-ref> <remote-sha1>
  let input = '';
  
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    input += chunk;
  });
  
  process.stdin.on('end', () => {
    const lines = input.trim().split('\n').filter(line => line.length > 0);
    
    if (lines.length === 0) {
      // 没有要推送的内容，直接通过
      process.exit(0);
    }
    
    // 收集所有要推送的 tag
    const tagsToPush = [];
    
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 3) {
        const localRef = parts[0];
        const remoteRef = parts[2];
        
        // 检查是否是 tag 引用
        if (localRef && localRef.startsWith('refs/tags/')) {
          const tagName = localRef.replace('refs/tags/', '');
          tagsToPush.push(tagName);
        }
      }
    }
    
    // 如果没有要推送的 tag，直接通过（可能是推送分支或其他引用）
    if (tagsToPush.length === 0) {
      process.exit(0);
    }
    
    // 验证每个 tag
    let hasError = false;
    
    for (const tagName of tagsToPush) {
      console.log(`\n🔍 验证 tag: ${tagName}`);
      
      if (!validateTag(tagName)) {
        hasError = true;
      }
    }
    
    if (hasError) {
      console.error('\n❌ Tag 验证失败，推送已阻止。');
      console.error('请修正 tag 版本或更新 package.json 中的 version 字段。\n');
      process.exit(1);
    }
    
    console.log('\n✅ 所有 tag 验证通过\n');
    process.exit(0);
  });
  
} catch (error) {
  console.error('Git Hook 执行出错:', error.message);
  process.exit(1);
}

