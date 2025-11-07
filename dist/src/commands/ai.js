"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AICommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const ai_helper_1 = require("../utils/ai-helper");
const config_1 = require("../core/config");
const logger_1 = require("../utils/logger");
const chalk_1 = __importDefault(require("chalk"));
class AICommand {
    config;
    constructor() {
        this.config = config_1.ConfigManager.getInstance();
    }
    register(program) {
        const aiCommand = program
            .command('ai')
            .description('AI相关功能');
        aiCommand
            .command('generate-code <description>')
            .description('使用AI生成代码')
            .option('-l, --language <language>', '编程语言', 'typescript')
            .option('-f, --framework <framework>', '框架', 'react')
            .action(async (description, options) => {
            await this.generateCode(description, options);
        });
        aiCommand
            .command('suggest-architecture <projectType>')
            .description('获取项目架构建议')
            .action(async (projectType) => {
            await this.suggestArchitecture(projectType);
        });
        aiCommand
            .command('setup')
            .description('配置AI服务')
            .action(async () => {
            await this.setupAI();
        });
    }
    async generateCode(description, options) {
        try {
            this.checkAIConfig();
            logger_1.Logger.info(`正在为描述生成代码: "${description}"`);
            const code = await ai_helper_1.AIHelper.generateAICode(description, {
                language: options.language,
                framework: options.framework
            });
            logger_1.Logger.success('AI生成的代码:');
            console.log('\n' + chalk_1.default.gray('```' + options.language));
            console.log(code);
            console.log(chalk_1.default.gray('```\n'));
        }
        catch (error) {
            logger_1.Logger.error('生成代码失败:', error);
        }
    }
    async suggestArchitecture(projectType) {
        try {
            this.checkAIConfig();
            logger_1.Logger.info(`正在为项目类型获取架构建议: ${projectType}`);
            const suggestion = await ai_helper_1.AIHelper.analyzeProjectRequirements(`project-${projectType}`, projectType, {});
            logger_1.Logger.success('AI架构建议:');
            console.log(JSON.stringify(suggestion, null, 2));
        }
        catch (error) {
            logger_1.Logger.error('获取架构建议失败:', error);
        }
    }
    async setupAI() {
        const answers = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'provider',
                message: '选择AI服务提供商:',
                choices: [
                    { name: 'OpenAI', value: 'openai' },
                    { name: 'Claude', value: 'claude' },
                    { name: '自定义', value: 'custom' }
                ]
            },
            {
                type: 'input',
                name: 'apiKey',
                message: '输入API Key:',
                validate: (input) => !!input || 'API Key不能为空'
            },
            {
                type: 'input',
                name: 'endpoint',
                message: '自定义端点 (可选):',
                when: (answers) => answers.provider === 'custom'
            }
        ]);
        this.config.set('ai.provider', answers.provider);
        this.config.set('ai.openaiApiKey', answers.apiKey);
        if (answers.endpoint) {
            this.config.set('ai.endpoint', answers.endpoint);
        }
        // 初始化AI助手
        ai_helper_1.AIHelper.initialize(answers.apiKey);
        logger_1.Logger.success('AI服务配置完成!');
    }
    checkAIConfig() {
        const apiKey = this.config.get('ai.openaiApiKey');
        if (!apiKey) {
            throw new Error('未配置AI服务，请先运行 "fe-cli ai setup" 进行配置');
        }
        ai_helper_1.AIHelper.initialize(apiKey);
    }
}
exports.AICommand = AICommand;
//# sourceMappingURL=ai.js.map