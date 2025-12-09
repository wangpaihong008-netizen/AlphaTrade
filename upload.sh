#!/bin/bash
# 一键上传代码到 GitHub - Linux/Mac 脚本

echo "=========================================="
echo "上传代码到 GitHub"
echo "=========================================="

# 进入项目目录
cd ~/Desktop/AlphaTrade || cd ~/桌面/AlphaTrade || exit 1

echo "📍 项目目录: $(pwd)"

# 检查 Git 状态
echo ""
echo "📋 检查更改..."
git status

# 添加所有更改
echo ""
echo "📦 添加所有更改..."
git add .

# 检查是否有更改需要提交
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️  没有需要提交的更改"
else
    # 提交更改
    echo ""
    echo "💾 提交更改..."
    echo -n "请输入提交说明 (直接回车使用默认消息): "
    read commit_message
    if [ -z "$commit_message" ]; then
        commit_message="更新代码: $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    git commit -m "$commit_message"
    
    # 推送到远程仓库
    echo ""
    echo "🚀 推送到 GitHub..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 上传成功！"
        echo "查看: https://github.com/wangpaihong008-netizen/AlphaTrade"
    else
        echo ""
        echo "❌ 推送失败，尝试先拉取..."
        git pull origin main --rebase
        git push origin main
    fi
fi

echo ""
echo "完成！"

