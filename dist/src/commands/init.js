"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitCommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const config_1 = require("../core/config");
const logger_1 = require("../utils/logger");
class InitCommand {
    config;
    constructor() {
        this.config = config_1.ConfigManager.getInstance();
    }
    register(program) {
        program
            .command('init')
            .description('初始化CLI配置')
            .option('--reset', '重置为默认配置', false)
            .action(async (options) => {
            await this.execute(options);
        });
    }
    async execute(options) {
        try {
            if (options.reset) {
                // 重置配置逻辑
                logger_1.Logger.info('重置配置为默认值');
                // 实现重置逻辑
                return;
            }
            await this.interactiveSetup();
            logger_1.Logger.success('CLI配置初始化完成!');
        }
        catch (error) {
            logger_1.Logger.error('初始化配置失败:', error);
            process.exit(1);
        }
    }
    async interactiveSetup() {
        const answers = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'enableAI',
                message: '是否启用AI功能?',
                default: true
            },
            {
                type: 'input',
                name: 'openaiApiKey',
                message: 'OpenAI API Key (可选):',
                when: (answers) => answers.enableAI,
                validate: (input) => {
                    if (!input)
                        return true; // 可选
                    return input.startsWith('sk-') || 'API Key 应以 sk- 开头';
                }
            },
            {
                type: 'confirm',
                name: 'enableTensorFlow',
                message: '是否启用TensorFlow.js功能?',
                default: true
            },
            {
                type: 'input',
                name: 'customTemplatesPath',
                message: '自定义模板路径 (可选):',
                default: '.fe-cli/templates'
            }
        ]);
        // 保存配置
        if (answers.enableAI && answers.openaiApiKey) {
            this.config.set('ai.openaiApiKey', answers.openaiApiKey);
        }
        this.config.set('features.enableAI', answers.enableAI);
        this.config.set('features.enableTensorFlow', answers.enableTensorFlow);
        this.config.set('templates.customPath', answers.customTemplatesPath);
    }
}
exports.InitCommand = InitCommand;
//# sourceMappingURL=init.js.map