# Travelogue-Management-System

游记审核管理系统

## 项目简介

这是一个基于 React + TypeScript + Vite 开发的游记审核管理系统，用于管理和审核用户提交的游记内容。

### 主要功能

- 用户管理：支持用户注册、登录、权限控制
- 游记管理：
  - 待审核游记列表
  - 已通过游记列表
  - 已拒绝游记列表
- 审核功能：
  - 游记内容审核
  - 审核状态更新
  - 审核意见反馈

### 系统特点

- 实时更新：审核状态实时同步
- 用户友好：直观的操作界面
- 安全性：完善的权限控制和数据验证
- 可扩展性：模块化设计，易于扩展

## 技术栈

- React 19
- TypeScript
- Vite
- Ant Design 5
- TailwindCSS
- React Router 7
- Axios

## 项目结构

```
src/
├── assets/        # 静态资源文件
├── components/    # 公共组件
├── const/         # 常量定义
├── context/       # React Context
├── pages/         # 页面组件
├── services/      # API 服务
├── types/         # TypeScript 类型定义
└── main.tsx       # 应用入口
```

## 开发环境要求

- Node.js (推荐使用最新 LTS 版本)
- npm

## 安装和运行

1. 克隆项目

```bash
git clone [项目地址]
cd travelogue-management-system
```

2. 安装依赖

````bash
npm install

3. 启动开发服务器

```bash
npm run dev

4. 构建生产版本

```bash
npm run build

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run lint` - 运行 ESLint 检查
- `npm run preview` - 预览生产构建

## 开发规范

- 使用 TypeScript 进行开发
- 遵循 ESLint 规范
- 使用 Prettier 进行代码格式化

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request



