#!/bin/bash
echo "正在安装依赖..."
npm install
echo "正在构建项目..."
npm run build
echo "启动预览..."
npm run preview
