#!/bin/bash

# 停止遇到错误
set -e

echo ">>> 🚀 开始部署 AlphaTrade..."

# 1. 检查 Node环境
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到 NodeJS。请先安装 Node (v18+)"
    exit 1
fi

# 2. 安装依赖
echo ">>> 📦 安装依赖..."
npm install

# 3. 构建项目
echo ">>> 🛠️ 构建生产版本..."
npm run build

# 4. 启动预览服务器
echo ">>> ✅ 部署完成! 正在启动服务..."
echo ">>> 访问地址: http://localhost:4173 (或服务器IP)"
npm run preview -- --host