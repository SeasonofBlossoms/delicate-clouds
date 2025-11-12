frontend-cli/
├── bin/
│ └── dc-cli.js # CLI 入口文件
├── src/
│ ├── core/ # 核心模块
│ │ ├── cli.js # CLI 主程序
│ │ ├── command.js # 命令管理器
│ │ └── config.js # 配置管理器
│ ├── commands/ # 命令实现
│ │ ├── init.js # 初始化命令
│ │ ├── generate.js # 生成模板命令
│ │ ├── ai.js # AI 相关命令
│ │ └── tensorflow.js # TensorFlow.js 命令
│ ├── templates/ # 模板系统
│ │ ├── template-manager.js # 模板管理器
│ │ ├── generators/ # 模板生成器
│ │ │ ├── base-generator.js
│ │ │ ├── react-generator.js
│ │ │ ├── vue-generator.js
│ │ │ └── tfjs-generator.js
│ │ └── types/ # 模板类型定义
│ ├── utils/ # 工具函数
│ │ ├── logger.js
│ │ ├── file.js
│ │ ├── npm.js
│ │ └── ai-helper.js # AI 工具函数
│ └── types/ # TypeScript 类型定义
├── templates/ # 模板文件
│ ├── react/
│ ├── vue/
│ ├── tensorflow/
│ └── custom/
├── plugins/ # 插件系统
├── config/ # 配置文件
├── package.json
├── tsconfig.json
└── README.md
