# Photo Border - 图片边框处理工具

这是一个基于Tauri + React开发的跨平台桌面应用程序，用于为图片添加边框、水印等效果。

## 功能特点

- 支持批量导入图片
- 自定义边框样式和颜色
- 添加品牌水印
- 图片预览和实时效果
- 批量导出处理后的图片
- 跨平台支持（Windows、macOS）

## 开发环境配置

### 前置要求

1. Node.js (推荐 v18+)
2. Rust (用于Tauri开发)
   - Windows: 安装[Visual Studio C++ 生成工具](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - 安装[Rust](https://www.rust-lang.org/tools/install)

### 开发工具推荐

- [VS Code](https://code.visualstudio.com/) 
- VS Code插件:
  - [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
  - [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## 本地开发

1. 安装依赖:
```bash
npm install
```

2. 启动开发服务器:
```bash
npm run tauri dev
```

## 构建应用

### Windows版本构建

1. 确保已安装所有依赖
2. 运行构建命令:
```bash
npm run tauri build
```

构建完成后，可以在 `src-tauri/target/release/bundle` 目录下找到打包好的Windows安装程序。

### 其他平台构建

- macOS: 同样使用 `npm run tauri build` 命令
- Linux: 需要安装额外的依赖，请参考[Tauri官方文档](https://tauri.app/v1/guides/getting-started/prerequisites#linux)

## 技术栈

- 前端框架: React + TypeScript
- UI组件: Radix UI
- 样式: Tailwind CSS
- 桌面应用框架: Tauri
- 构建工具: Vite

## 项目结构

```
photo-border/
├── src/                # React源代码
├── src-tauri/         # Tauri/Rust源代码
├── public/            # 静态资源
└── ...
```

## 贡献指南

1. Fork 项目
2. 创建新的功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

[MIT License](LICENSE)
