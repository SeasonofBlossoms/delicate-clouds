"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateCommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const template_manager_1 = require("../templates/template-manager");
const logger_1 = require("../utils/logger");
class GenerateCommand {
    templateManager;
    constructor() {
        this.templateManager = new template_manager_1.TemplateManager();
    }
    register(program) {
        program
            .command('generate [project-name]')
            .description('生成新项目')
            .option('-t, --template <template>', '指定模板名称')
            .option('-o, --output <output>', '输出目录', process.cwd())
            .option('--install', '自动安装依赖')
            .option('--no-install', '不自动安装依赖（默认）')
            .action(async (projectName, options) => {
            await this.execute(projectName, options);
        });
    }
    async execute(projectName, options) {
        try {
            if (!projectName) {
                const answer = await inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'projectName',
                        message: '请输入项目名称:',
                        validate: (input) => !!input || '项目名称不能为空'
                    }
                ]);
                projectName = answer.projectName;
            }
            let templateName = options.template;
            // 交互式选择模板
            if (!templateName) {
                const answers = await this.promptForTemplate();
                templateName = answers.template;
            }
            const targetPath = options.output ?
                path_1.default.join(options.output, projectName) :
                path_1.default.join(process.cwd(), projectName);
            // 确定是否安装依赖
            const installDependencies = options.install || false;
            // 模板变量
            const variables = {
                projectName,
                projectDescription: `${projectName} - 由fe-cli创建`,
                author: process.env.USERNAME || 'developer',
                version: '1.0.0',
                date: new Date().toISOString().split('T')[0]
            };
            // 生成选项
            const generateOptions = {
                installDependencies
            };
            await this.templateManager.generateTemplate(templateName, targetPath, variables, generateOptions);
            // 显示下一步操作提示
            this.showNextSteps(projectName, targetPath, installDependencies);
        }
        catch (error) {
            logger_1.Logger.error('生成项目失败:', error);
            process.exit(1);
        }
    }
    async promptForTemplate() {
        const templates = this.templateManager.getAvailableTemplates();
        return inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'template',
                message: '请选择项目模板:',
                choices: templates.map(t => ({
                    name: `${t.name} - ${t.description}`,
                    value: t.name
                }))
            },
            {
                type: 'confirm',
                name: 'installDependencies',
                message: '是否自动安装依赖?',
                default: false
            }
        ]);
    }
    showNextSteps(projectName, targetPath, installed) {
        logger_1.Logger.success('\n🎉 项目创建成功!');
        if (installed) {
            logger_1.Logger.info('✅ 依赖已自动安装');
            logger_1.Logger.info('下一步操作:');
            console.log(`
  cd ${projectName}
  npm run dev
      `);
        }
        else {
            logger_1.Logger.info('下一步操作:');
            console.log(`
  cd ${projectName}
  npm install      # 安装依赖
  npm run dev      # 启动开发服务器
      `);
        }
        logger_1.Logger.info(`项目目录: ${targetPath}`);
    }
}
exports.GenerateCommand = GenerateCommand;
//# sourceMappingURL=generate.js.map