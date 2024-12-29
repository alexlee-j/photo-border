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

# 创建发布目录
RELEASE_DIR="windows"
RELEASE_NAME="photo-border-windows"
mkdir -p "$RELEASE_DIR"

# 复制必要的文件到发布目录
echo "正在准备发布文件..."
cp target/x86_64-pc-windows-msvc/release/photo-border.exe "$RELEASE_DIR/"

# 复制所有 DLL 文件
cp target/x86_64-pc-windows-msvc/release/*.dll "$RELEASE_DIR/"
cp target/x86_64-pc-windows-msvc/release/WixTools/*.dll "$RELEASE_DIR/" 2>/dev/null || true

# 复制 WebView2 Loader
cp target/x86_64-pc-windows-msvc/release/WebView2Loader.dll "$RELEASE_DIR/" 2>/dev/null || true

# 创建 README 文件
echo "Photo Border Windows 版本

使用说明：
1. 首先下载并安装 Visual C++ Redistributable：
   https://aka.ms/vs/17/release/vc_redist.x64.exe

2. 解压后，所有文件必须保持在同一目录下
   - photo-border.exe
   - *.dll 文件
   这些文件都是程序运行所必需的，请不要分开移动它们

3. 双击 photo-border.exe 运行程序

如果运行时遇到问题：
1. 确保已正确安装 Visual C++ Redistributable
2. 确保所有文件都在同一个目录中
3. 如果看到"无法找到入口"错误，请检查：
   - 是否所有 .dll 文件都在 photo-border.exe 同目录下
   - 是否已安装 Visual C++ Redistributable
4. 如果仍有问题，请联系开发者

祝您使用愉快！" > "$RELEASE_DIR/README.txt"

# 创建 ZIP 文件
echo "正在创建 ZIP 文件..."
cd "$RELEASE_DIR"
zip -r "../$RELEASE_NAME.zip" ./*
cd ..

echo "构建完成！"
echo "你可以在 target/x86_64-pc-windows-msvc/release/$RELEASE_NAME.zip 中找到打包好的应用。"
