# CLI 工具搭建全流程指南

## 🎯 设计理念与核心思想

### 1. 设计原则

- **单一职责**：每个模块/类只负责一个特定功能
- **开闭原则**：对扩展开放，对修改关闭
- **依赖倒置**：依赖抽象而非具体实现
- **配置驱动**：通过配置文件控制行为

### 2. 架构模式

```
输入层 (bin/) → 控制层 (core/) → 业务层 (commands/) → 数据层 (templates/)
```

## 📚 需要掌握的核心知识

### 1. Node.js 核心模块

```javascript
// 必须掌握的核心模块
const path = require("path"); // 路径处理
const fs = require("fs-extra"); // 文件系统（增强版）
const child_process = require("child_process"); // 子进程
const os = require("os"); // 操作系统信息
```

### 2. CLI 开发相关库

```bash
# 核心依赖
npm install commander inquirer chalk fs-extra handlebars

# 类型定义（开发依赖）
npm install -D @types/node @types/inquirer @types/fs-extra
```

### 3. TypeScript 知识要点

```typescript
// 1. 类型定义
interface TemplateConfig {
  name: string;
  description: string;
  type: "react" | "vue" | "tensorflow";
  path: string;
}

// 2. 类与继承
abstract class BaseGenerator {
  abstract type: string;
  abstract generate(): Promise<void>;
}

// 3. 模块系统
export class TemplateManager {}
import { TemplateManager } from "./template-manager";
```

## 🏗️ 搭建过程详解

### 阶段 1：项目初始化

#### 1.1 项目结构设计

```bash
my-cli/
├── bin/                 # CLI 入口
├── src/
│   ├── core/           # 核心架构
│   ├── commands/       # 命令实现
│   ├── templates/      # 模板系统
│   ├── utils/          # 工具函数
│   └── types/          # 类型定义
├── templates/          # 模板文件
├── scripts/           # 构建脚本
└── dist/              # 编译输出
```

#### 1.2 Package.json 配置

```json
{
  "name": "my-cli",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "my-cli": "./bin/cli.js"
  },
  "files": ["bin", "dist"],
  "scripts": {
    "build": "tsc && node scripts/copy-templates.js",
    "dev": "ts-node src/core/cli.ts"
  }
}
```

### 阶段 2：核心架构搭建

#### 2.1 CLI 入口设计

```typescript
// bin/cli.js
#!/usr/bin/env node
require('../dist/core/cli');

// src/core/cli.ts
class FECLI {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCLI();
  }

  private setupCLI() {
    this.program
      .name('fe-cli')
      .description('前端CLI工具')
      .version('1.0.0');
  }
}
```

#### 2.2 命令系统设计

```typescript
// 命令接口
interface CommandInterface {
  register(program: Command): void;
}

// 命令管理器
class CommandManager {
  private commands: CommandInterface[] = [];

  registerCommands(program: Command) {
    this.commands.forEach((command) => command.register(program));
  }
}
```

### 阶段 3：模板系统实现

#### 3.1 模板管理器

```typescript
class TemplateManager {
  private templates: Map<string, TemplateConfig> = new Map();

  async generateTemplate(
    templateName: string,
    targetPath: string,
    variables: Record<string, any>
  ): Promise<void> {
    // 模板生成逻辑
  }
}
```

#### 3.2 模板处理器

```typescript
abstract class BaseGenerator {
  protected async processTemplateFile(
    sourceFile: string,
    targetFile: string,
    variables: Record<string, any>
  ): Promise<void> {
    // 文件处理逻辑
  }
}
```

### 阶段 4：功能扩展

#### 4.1 交互式命令

```typescript
class GenerateCommand {
  private async promptForTemplate() {
    return inquirer.prompt([
      {
        type: "list",
        name: "template",
        message: "选择模板:",
        choices: templates.map((t) => ({
          name: `${t.name} - ${t.description}`,
          value: t.name,
        })),
      },
    ]);
  }
}
```

#### 4.2 依赖管理

```typescript
class NpmUtil {
  static async installDependencies(
    cwd: string,
    dependencies: string[],
    isDev: boolean = false
  ): Promise<void> {
    // npm 安装逻辑
  }
}
```

## 🔧 关键技术细节

### 1. 路径处理最佳实践

```typescript
// 使用 path.join 避免路径分隔符问题
const templatePath = path.join(__dirname, "../../templates");

// 使用 path.resolve 处理绝对路径
const absolutePath = path.resolve(process.cwd(), projectName);
```

### 2. 错误处理策略

```typescript
class Logger {
  static error(message: string, error?: any) {
    console.error(chalk.red(`[ERROR] ${message}`));
    if (error) console.error(chalk.gray(error.stack));
  }

  static success(message: string) {
    console.log(chalk.green(`[SUCCESS] ${message}`));
  }
}
```

### 3. 异步流程控制

```typescript
// 使用 async/await 处理异步操作
async function generateProject() {
  try {
    await this.validateInput();
    await this.copyTemplates();
    await this.installDependencies();
    Logger.success("项目创建成功!");
  } catch (error) {
    Logger.error("项目创建失败", error);
    process.exit(1);
  }
}
```

### 4. 配置管理

```typescript
class ConfigManager {
  private static instance: ConfigManager;
  private config: CLIConfig = {};

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }
}
```

## 🎨 用户体验设计

### 1. 进度反馈

```typescript
class ProgressIndicator {
  static start(message: string) {
    process.stdout.write(chalk.cyan(`➤ ${message}... `));
  }

  static end(success: boolean = true) {
    console.log(success ? chalk.green("✓") : chalk.red("✗"));
  }
}
```

### 2. 颜色和样式

```typescript
// 使用 chalk 提供丰富的颜色
import chalk from "chalk";

console.log(chalk.blue("信息消息"));
console.log(chalk.green("成功消息"));
console.log(chalk.yellow("警告消息"));
console.log(chalk.red("错误消息"));
```

### 3. 帮助信息

```typescript
program.addHelpText(
  "after",
  `
示例:
  $ fe-cli generate my-app
  $ fe-cli generate my-app --template react-ts
  $ fe-cli --version
  `
);
```

## 🚀 高级特性实现

### 1. 插件系统设计

```typescript
interface Plugin {
  name: string;
  version: string;
  register(program: Command): void;
}

class PluginManager {
  private plugins: Plugin[] = [];

  loadPlugin(pluginPath: string) {
    // 动态加载插件
  }
}
```

### 2. AI 集成

```typescript
class AIHelper {
  static async analyzeProjectRequirements(
    projectName: string,
    templateType: string
  ): Promise<AISuggestion> {
    // AI 分析逻辑
  }
}
```

### 3. 模板市场

```typescript
class TemplateRegistry {
  async searchTemplates(keyword: string): Promise<Template[]> {
    // 从远程仓库搜索模板
  }

  async downloadTemplate(templateName: string): Promise<void> {
    // 下载模板逻辑
  }
}
```

## 📦 构建和发布

### 1. 构建配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### 2. 资源复制脚本

```javascript
// scripts/copy-templates.js
const fs = require("fs-extra");

async function copyTemplates() {
  await fs.copy("templates", "dist/templates");
}
```

### 3. 发布准备

```bash
# 本地测试
npm link

# 构建
npm run build

# 发布
npm publish
```

## 🧪 测试和调试

### 1. 单元测试

```typescript
// __tests__/template-manager.test.ts
describe("TemplateManager", () => {
  it("应该正确加载模板", () => {
    const manager = new TemplateManager();
    expect(manager.getAvailableTemplates().length).toBeGreaterThan(0);
  });
});
```

### 2. 集成测试

```typescript
// 测试完整的命令流程
test("generate command", async () => {
  await runCommand("fe-cli generate test-app --template react-ts");
  expect(fs.existsSync("test-app/package.json")).toBe(true);
});
```

### 3. 调试技巧

```typescript
// 添加详细的调试信息
console.log("🔧 调试信息:", {
  sourcePath,
  targetPath,
  variables: Object.keys(variables),
});
```

## 📈 性能优化

### 1. 懒加载

```typescript
class LazyLoader {
  private loaded = false;
  private data: any;

  async load() {
    if (!this.loaded) {
      this.data = await this.loadData();
      this.loaded = true;
    }
    return this.data;
  }
}
```

### 2. 缓存策略

```typescript
class TemplateCache {
  private cache = new Map();

  getTemplate(name: string) {
    if (this.cache.has(name)) {
      return this.cache.get(name);
    }
    // 加载并缓存模板
  }
}
```

## 🔍 学习路径建议

### 初级阶段（1-2 周）

1. **Node.js 基础**：模块系统、文件操作、路径处理
2. **TypeScript 基础**：类型、接口、类、模块
3. **CLI 基础**：process.argv、标准输入输出

### 中级阶段（2-3 周）

1. **常用库学习**：commander、inquirer、chalk、handlebars
2. **设计模式**：命令模式、工厂模式、单例模式
3. **错误处理**：try/catch、错误类型、日志系统

### 高级阶段（3-4 周）

1. **架构设计**：模块划分、依赖管理、配置系统
2. **用户体验**：进度指示、颜色方案、交互设计
3. **扩展性设计**：插件系统、模板市场、AI 集成

## 💡 实践建议

1. **从简单开始**：先实现基本功能，再逐步添加高级特性
2. **频繁测试**：每添加一个功能就进行测试
3. **用户视角**：思考用户会如何使用你的 CLI
4. **文档先行**：先写使用文档，再实现功能
5. **社区学习**：参考优秀的 CLI 工具源码（如 create-react-app、vue-cli）

这个 CLI 工具的开发涵盖了现代 JavaScript/TypeScript 开发的各个方面，是一个很好的全栈学习项目。通过这个项目，你可以掌握从设计到发布的完整开发流程！
