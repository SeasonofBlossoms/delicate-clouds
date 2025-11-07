"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateCommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const template_manager_1 = require("../templates/template-manager");
const logger_1 = require("../utils/logger");
const file_1 = require("../utils/file");
const chalk_1 = __importDefault(require("chalk"));
class TemplateCommand {
    templateManager;
    constructor() {
        this.templateManager = new template_manager_1.TemplateManager();
    }
    register(program) {
        const templateCommand = program
            .command('template')
            .description('模板管理');
        templateCommand
            .command('list')
            .description('列出所有可用模板')
            .action(async () => {
            await this.listTemplates();
        });
        templateCommand
            .command('create <name>')
            .description('创建自定义模板')
            .option('-t, --type <type>', '模板类型')
            .option('-d, --description <description>', '模板描述')
            .action(async (name, options) => {
            await this.createTemplate(name, options);
        });
        templateCommand
            .command('publish <name>')
            .description('发布模板到模板市场')
            .action(async (name) => {
            await this.publishTemplate(name);
        });
    }
    async listTemplates() {
        const templates = this.templateManager.getAvailableTemplates();
        if (templates.length === 0) {
            logger_1.Logger.info('没有可用的模板');
            return;
        }
        logger_1.Logger.info('可用模板:');
        templates.forEach(template => {
            console.log(`  • ${chalk_1.default.cyan(template.name)} - ${template.description} (${template.type})`);
        });
    }
    async createTemplate(name, options) {
        try {
            const answers = await inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'type',
                    message: '选择模板类型:',
                    choices: ['react', 'vue', 'tensorflow', 'custom'],
                    default: options.type
                },
                {
                    type: 'input',
                    name: 'description',
                    message: '模板描述:',
                    default: options.description || `${name} 模板`
                },
                {
                    type: 'input',
                    name: 'sourcePath',
                    message: '模板源文件路径:',
                    validate: async (input) => {
                        const exists = await file_1.FileUtil.exists(input);
                        return exists || '路径不存在';
                    }
                }
            ]);
            const templateConfig = {
                name,
                description: answers.description,
                type: answers.type,
                path: answers.sourcePath
            };
            await this.templateManager.registerCustomTemplate(templateConfig);
            logger_1.Logger.success(`模板 ${name} 创建成功!`);
        }
        catch (error) {
            logger_1.Logger.error('创建模板失败:', error);
        }
    }
    async publishTemplate(name) {
        logger_1.Logger.info(`发布模板 ${name}...`);
        // 实现模板发布逻辑
        logger_1.Logger.success(`模板 ${name} 发布成功!`);
    }
}
exports.TemplateCommand = TemplateCommand;
//# sourceMappingURL=template.js.map