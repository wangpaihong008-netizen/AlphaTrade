#!/bin/bash

echo "=== 🚀 GitHub 一键上传助手 ==="

# 1. 检查是否安装了 Git
if ! command -v git &> /dev/null; then
    echo "❌ 错误: 未检测到 git。请先安装 Git (git-scm.com)"
    exit 1
fi

# 2. 初始化仓库 (如果尚未初始化)
if [ ! -d ".git" ]; then
    echo "📦 初始化本地 Git 仓库..."
    git init
    git branch -M main
fi

# 3. 添加 .gitignore (防止上传垃圾文件)
echo "📄 检查 .gitignore..."
cat > .gitignore << 'EOF'
node_modules
dist
.env
.DS_Store
EOF

# 4. 添加文件到暂存区
echo "➕ 添加文件..."
git add .

# 5. 提交更改
echo "💾 提交更改..."
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
git commit -m "Auto update: $TIMESTAMP"

# 6. 设置远程仓库
echo "🔗 设置远程仓库..."
echo "请输入您的 GitHub 仓库地址 (例如 https://github.com/user/repo.git):"
read -r REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ 地址不能为空！"
    exit 1
fi

# 移除旧的 origin (如果存在)，添加新的
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"

# 7. 推送代码
echo "⬆️ 正在推送到 GitHub (main)..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ 成功！代码已上传到仓库。"
else
    echo "❌ 上传失败。请检查网络或仓库地址是否正确。"
    echo "提示: 如果是第一次上传到非空仓库，可能需要强制推送，或者先 pull。"
fi