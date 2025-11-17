# Delicate Clouds CLI 项目结构解析图

## 📁 完整项目结构树

```
@delicate-clouds/cli/
├── 📂 bin/                           # CLI 可执行文件
│   └── dc-cli.js                    # CLI 入口点 (编译后)
├── 📂 src/                          # 源代码目录
│   ├── 📂 types/                    # TypeScript 类型定义
│   │   ├── prompts.ts               # 交互提示相关类型
│   │   ├── actions.ts               # 动作执行相关类型
│   │   ├── generator.ts             # 生成器相关类型
│   │   └── handlebars.d.ts          # Handlebars 类型扩展
│   ├── 📂 core/                     # 核心引擎模块
│   │   ├── InteractivePrompter.ts   # 交互式提示器
│   │   ├── GeneratorRegistry.ts     # 生成器注册表
│   │   ├── ActionExecutor.ts        # 动作执行器
│   │   └── TemplateEngine.ts        # 模板引擎
│   ├── 📂 generators/               # 代码生成器定义
│   │   ├── ComponentGenerator.ts    # Vue 组件生成器
│   │   ├── PageGenerator.ts         # 页面生成器
│   │   ├── StoreGenerator.ts        # 状态管理生成器
│   │   └── index.ts                 # 生成器统一导出
│   ├── 📂 templates/                # 代码模板文件
│   │   ├── 📂 components/           # 组件模板
│   │   │   ├── componentTemplate.ts
│   │   │   ├── styleTemplate.ts
│   │   │   └── testTemplate.ts
│   │   └── 📂 pages/                # 页面模板
│   │       └── pageTemplate.ts
│   ├── 📂 commands/                 # CLI 命令实现
│   │   ├── GenerateCommand.ts       # 生成命令
│   │   └── InteractiveCommand.ts    # 交互式命令
│   ├── 📂 utils/                    # 工具函数库
│   │   ├── handlebarsHelpers.ts     # Handlebars 辅助函数
│   │   ├── prompt-builders.ts       # 提示构建器
│   │   ├── fileUtils.ts             # 文件操作工具
│   │   └── stringUtils.ts           # 字符串处理工具
│   └── index.ts                     # 主程序入口
├── 📂 dist/                         # 编译输出目录
├── package.json                     # 项目配置和依赖
├── tsconfig.json                    # TypeScript 配置
└── README.md                        # 项目文档
```

## 🔄 核心架构流程图

```
用户输入
    ↓
CLI 入口 (index.ts)
    ↓
命令解析 (commander)
    ├── generate 命令 (GenerateCommand.ts)
    └── interactive 命令 (InteractiveCommand.ts)
        ↓
生成器注册表 (GeneratorRegistry.ts)
    ↓
交互式提示器 (InteractivePrompter.ts)
    ↓
模板引擎 (TemplateEngine.ts) ← Handlebars Helpers
    ↓
动作执行器 (ActionExecutor.ts)
    ↓
文件系统操作
    ↓
生成结果反馈
```

## 🏗️ 模块依赖关系图

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CLI 命令层     │    │    核心引擎层     │    │    工具层        │
│                 │    │                  │    │                 │
│ GenerateCommand │◄──►│ GeneratorRegistry│◄──►│ TemplateEngine  │
│ InteractiveCmd  │    │ InteractivePromp │    │ HandlebarsUtils │
└─────────────────┘    │ ActionExecutor   │    └─────────────────┘
         │              └──────────────────┘             │
         │                        │                      │
         ▼                        ▼                      ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   生成器层        │    │    模板层         │    │    类型层        │
│                 │    │                  │    │                 │
│ ComponentGen    │    │ ComponentTpl     │    │ TypeDefs        │
│ PageGenerator   │    │ PageTemplates    │    │ Interfaces      │
│ StoreGenerator  │    └──────────────────┘    └─────────────────┘
└─────────────────┘
```

## 🔧 核心模块详细解析

### 1. **类型系统 (types/)**

```
types/
├── prompts.ts      # 交互提示类型定义
│   ├── PromptAnswer
│   ├── PromptDefinition
│   └── AIPromptEnhancement
├── actions.ts      # 动作执行类型定义
│   ├── ActionType
│   ├── BaseAction
│   ├── AddAction
│   ├── ActionResult
│   └── ActionFunction
└── generator.ts    # 生成器类型定义
    ├── GeneratorConfig
    ├── GeneratorResult
    └── GeneratorHooks
```

### 2. **核心引擎 (core/)**

```
core/
├── InteractivePrompter.ts    # 交互式提示处理器
│   ├── prompt()              # 执行用户交互
│   ├── prepareActions()      # 准备执行动作
│   └── aiEnhanceAnswers()    # AI 增强答案
├── GeneratorRegistry.ts      # 生成器管理器
│   ├── registerGenerator()   # 注册生成器
│   ├── runGenerator()        # 运行生成器
│   └── listGenerators()      # 列出可用生成器
├── ActionExecutor.ts         # 动作执行器
│   ├── executeActions()      # 执行动作列表
│   ├── addFile()            # 添加文件
│   ├── modifyFile()         # 修改文件
│   └── appendToFile()       # 追加内容
└── TemplateEngine.ts         # 模板引擎
    ├── compile()            # 编译模板
    ├── registerHelper()     # 注册辅助函数
    └── registerPartial()    # 注册局部模板
```

### 3. **生成器系统 (generators/)**

```
generators/
├── ComponentGenerator.ts     # Vue 组件生成器
│   ├── 输入: 组件名、类型、样式、测试
│   ├── 输出: .vue 文件、样式文件、测试文件
│   └── 功能: 生成完整的 Vue 单文件组件
├── PageGenerator.ts          # 页面生成器
│   ├── 输入: 页面名、布局、功能特性
│   ├── 输出: 页面组件、路由配置
│   └── 功能: 生成业务页面模板
└── StoreGenerator.ts         # 状态管理生成器
    ├── 输入: Store 名、动作、Getter
    ├── 输出: Pinia Store 文件
    └── 功能: 生成状态管理模块
```

### 4. **模板系统 (templates/)**

```
templates/
├── components/               # 组件模板
│   ├── componentTemplate.ts  # Vue 组件模板
│   ├── styleTemplate.ts      # 样式文件模板
│   └── testTemplate.ts       # 测试文件模板
└── pages/                   # 页面模板
    └── pageTemplate.ts       # 页面组件模板
```

### 5. **命令系统 (commands/)**

```
commands/
├── GenerateCommand.ts        # 生成命令
│   ├── createCommand()       # 创建命令定义
│   ├── execute()            # 执行生成命令
│   ├── interactiveMode()    # 交互式模式
│   └── directGenerate()     # 直接生成模式
└── InteractiveCommand.ts     # 交互式命令
    ├── createCommand()       # 创建交互命令
    ├── execute()            # 执行交互循环
    └── handleAction()       # 处理用户选择
```

### 6. **工具库 (utils/)**

```
utils/
├── handlebarsHelpers.ts      # Handlebars 辅助函数
│   ├── 字符串转换: pascalCase, camelCase, kebabCase
│   ├── 条件判断: if_eq, unless_eq
│   └── 其他工具: json, includes, formatDate
├── prompt-builders.ts        # 提示构建器
│   ├── input()              # 构建输入提示
│   ├── confirm()            # 构建确认提示
│   ├── list()               # 构建列表提示
│   └── checkbox()           # 构建多选提示
├── fileUtils.ts             # 文件操作工具
│   ├── ensureDirectory()    # 确保目录存在
│   ├── readFile()           # 读取文件
│   └── copyTemplate()       # 复制模板文件
└── stringUtils.ts           # 字符串工具
    ├── toPascalCase()       # 转换为 PascalCase
    ├── toCamelCase()        # 转换为 camelCase
    └── toKebabCase()        # 转换为 kebab-case
```

## 🎯 数据流分析

### 生成流程数据流：

```
用户输入 → 命令解析 → 生成器选择 → 交互式提问 →
AI 增强 → 模板编译 → 动作执行 → 文件生成 → 结果反馈
```

### 类型安全流程：

```
TypeScript 类型定义 → 编译时类型检查 →
运行时数据验证 → 错误处理 → 用户反馈
```

## 🔄 扩展点说明

### 1. **添加新生成器**

```typescript
// 1. 在 generators/ 创建新生成器
// 2. 在 generators/index.ts 导出
// 3. 在 InteractiveCommand.ts 中注册
```

### 2. **添加新模板**

```typescript
// 1. 在 templates/ 创建新模板
// 2. 在生成器中引用模板
// 3. 模板支持 Handlebars 语法和自定义 helpers
```

### 3. **添加新命令**

```typescript
// 1. 在 commands/ 创建新命令
// 2. 在 index.ts 中注册命令
// 3. 更新 package.json 的 bin 配置
```

### 4. **添加新 Handlebars Helper**

```typescript
// 1. 在 handlebarsHelpers.ts 注册新 helper
// 2. 在模板中使用 {{newHelper value}}
```

## 📊 技术栈总结

| 技术领域     | 使用技术            | 用途               |
| ------------ | ------------------- | ------------------ |
| **CLI 框架** | Commander.js        | 命令行界面构建     |
| **交互提示** | Inquirer.js         | 用户交互界面       |
| **模板引擎** | Handlebars          | 代码模板渲染       |
| **类型系统** | TypeScript          | 类型安全和开发体验 |
| **文件操作** | fs-extra            | 增强的文件系统操作 |
| **样式输出** | chalk               | 彩色控制台输出     |
| **构建工具** | TypeScript Compiler | 代码编译和打包     |

这个架构设计具有良好的可扩展性和维护性，每个模块职责单一，便于测试和扩展。
