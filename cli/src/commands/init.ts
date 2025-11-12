import { Command } from 'commander';
import inquirer from 'inquirer';
import { ConfigManager } from '../core/config.js';
import { Logger } from '../utils/logger.js';

export class InitCommand {
    private config: ConfigManager;

    constructor() {
        this.config = ConfigManager.getInstance();
    }

    register (program: Command): void {
        program
            .command('init')
            .description('初始化CLI配置')
            .option('--reset', '重置为默认配置', false)
            .action(async (options) => {
                await this.execute(options);
            });
    }

    private async execute (options: { reset: boolean }): Promise<void> {
        try {
            if (options.reset) {
                // 重置配置逻辑
                Logger.info('重置配置为默认值');
                // 实现重置逻辑
                return;
            }

            await this.interactiveSetup();
            Logger.success('CLI配置初始化完成!');
        } catch (error) {
            Logger.error('初始化配置失败:', error);
            process.exit(1);
        }
    }

    private async interactiveSetup (): Promise<void> {
        const answers = await inquirer.prompt([
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
                    if (!input) return true; // 可选
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