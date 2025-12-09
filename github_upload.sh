#!/bin/bash
echo "=== GitHub 一键上传助手 ==="
echo "正在初始化 Git..."
git init
git branch -M main

echo "正在添加文件..."
cat > .gitignore << 'IGEOF'
node_modules
dist
.env
IGEOF
git add .

echo "正在提交..."
git commit -m "Auto upload by AlphaTrade Helper"

echo "---------------------------------------------"
echo "请输入您的 GitHub 仓库地址 (例如 https://github.com/xxx/xxx.git):"
read -r REPO_URL

if [ -z "$REPO_URL" ]; then
  echo " 地址不能为空！"
  exit 1
fi

echo "正在关联远程仓库..."
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"

echo "正在推送代码 (请稍等)..."
git push -u origin main

echo "---------------------------------------------"
if [ $? -eq 0 ]; then
  echo " 恭喜！上传成功！请刷新 GitHub 页面查看。"
else
  echo " 上传失败，请检查网络或地址是否正确。"
fi
