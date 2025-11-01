#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 验证 tag 名称是否与 package.json 中的 version 匹配
 * @param {string} tagName - tag 名称，例如 "v1.2.3"
 * @returns {boolean} - 如果验证通过返回 true，否则返回 false
 */
function validateTag(tagName) {
  // 检查 tag 是否符合 vx.y.z 格式
  const tagPattern = /^v(\d+)\.(\d+)\.(\d+)$/;
  const match = tagName.match(tagPattern);
  
  if (!match) {
    // 如果不是 vx.y.z 格式，跳过验证（允许其他格式的 tag）
    return true;
  }
  
  // 提取版本号
  const tagVersion = match[1] + '.' + match[2] + '.' + match[3];
  
  // 读取 package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ 错误: 找不到 package.json 文件');
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const packageVersion = packageJson.version;
    
    if (!packageVersion) {
      console.error('❌ 错误: package.json 中没有 version 字段');
      return false;
    }
    
    // 比较版本号
    if (tagVersion !== packageVersion) {
      console.error('\n❌ Tag 版本与 package.json 版本不匹配！');
      console.error('='.repeat(50));
      console.error(`Tag 版本:     v${tagVersion}`);
      console.error(`package.json: ${packageVersion}`);
      console.error('='.repeat(50));
      console.error('\n请确保 tag 版本（去掉 v 前缀）与 package.json 中的 version 字段相同。\n');
      return false;
    }
    
    console.log(`✅ Tag 版本验证通过: v${tagVersion} 与 package.json 版本 ${packageVersion} 匹配`);
    return true;
  } catch (error) {
    console.error('❌ 错误: 无法读取或解析 package.json:', error.message);
    return false;
  }
}

// 如果直接运行此脚本（不是通过 hook 调用）
if (require.main === module) {
  const tagName = process.argv[2];
  
  if (!tagName) {
    console.error('用法: node validate-tag.cjs <tag-name>');
    process.exit(1);
  }
  
  if (!validateTag(tagName)) {
    process.exit(1);
  }
  
  process.exit(0);
}

module.exports = { validateTag };

