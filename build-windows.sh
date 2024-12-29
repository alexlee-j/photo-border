#!/bin/bash

# 确保脚本在错误时停止
set -e

echo "开始构建 Windows 应用..."

# 首先构建前端
npm run build

# 进入 Tauri 目录
cd src-tauri

# 使用 cargo-xwin 构建 Windows 应用
cargo xwin build --target x86_64-pc-windows-msvc --release

# 进入构建目录
cd target/x86_64-pc-windows-msvc/release

# 创建发布目录
RELEASE_DIR="windows"
RELEASE_NAME="photo-border-windows"
mkdir -p "$RELEASE_DIR"

# 复制必要的文件到发布目录
echo "正在准备发布文件..."
cp photo-border.exe "$RELEASE_DIR/"
cp photo_border_lib.dll "$RELEASE_DIR/"

# 创建 ZIP 文件
echo "正在创建 ZIP 文件..."
cd "$RELEASE_DIR"
zip -r "../$RELEASE_NAME.zip" ./*
cd ..

echo "构建完成！"
echo "你可以在 src-tauri/target/x86_64-pc-windows-msvc/release/$RELEASE_NAME.zip 中找到打包好的应用。"
