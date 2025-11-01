# Git Hooks

一套用于代码质量控制和版本管理的 Git Hooks 集合。

## 功能说明

### pre-commit
在提交代码前检查暂存的文件：
- 检查代码文件行数，如果超过 1000 行会给出警告提示
- 支持的代码文件类型：`.js`, `.ts`, `.vue`, `.py`, `.java`, `.cpp`, `.c`, `.go`, `.rs` 等常见代码文件
- 当前仅警告，不阻止提交（可根据需要调整）

### pre-push
在推送代码前验证 tag 版本：
- 当推送 tag 时，检查 tag 版本（如 `v1.2.3`）是否与 `package.json` 中的 `version` 字段匹配
- 如果不匹配，会阻止推送并提示错误信息
- 仅验证符合 `vx.y.z` 格式的 tag

### pre-tag
在创建 tag 时验证版本：
- 验证创建的 tag 版本是否与 `package.json` 中的 `version` 字段匹配
- **注意**：Git 本身不支持 pre-tag hook，需要通过 Git alias 或包装器调用

## 安装使用

1. 将 hook 文件复制到项目的 `.git/hooks/` 目录：
```bash
cp pre-commit .git/hooks/
cp pre-push .git/hooks/
cp pre-tag .git/hooks/
```

2. 确保 hook 文件有执行权限：
```bash
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push
chmod +x .git/hooks/pre-tag
```

## 依赖

- Node.js（用于运行 `.cjs` 脚本）

## 后续计划

项目将持续新增更多实用的 Git Hooks，包括但不限于：
- 代码格式检查
- 单元测试自动运行
- 提交信息规范检查
- 等等...

## 文件结构

```
.
├── pre-commit              # pre-commit hook 入口脚本
├── pre-commit.cjs          # pre-commit 验证逻辑
├── pre-push                # pre-push hook 入口脚本
├── pre-tag                 # pre-tag hook 入口脚本
├── validate-tag.cjs        # tag 版本验证逻辑
└── validate-tag-push.cjs   # pre-push 中的 tag 验证逻辑
```

