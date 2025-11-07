import { Command } from 'commander';
import inquirer from 'inquirer';
import { AIHelper } from '../utils/ai-helper';
import { ConfigManager } from '../core/config';
import { Logger } from '../utils/logger';
import chalk from 'chalk'
export class AICommand {
    private config: ConfigManager;

    constructor() {
        this.config = ConfigManager.getInstance();
    }

    register (program: Command): void {
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

    private async generateCode (description: string, options: any): Promise<void> {
        try {
            this.checkAIConfig();

            Logger.info(`正在为描述生成代码: "${description}"`);
            const code = await AIHelper.generateAICode(description, {
                language: options.language,
                framework: options.framework
            });

            Logger.success('AI生成的代码:');
            console.log('\n' + chalk.gray('```' + options.language));
            console.log(code);
            console.log(chalk.gray('```\n'));
        } catch (error) {
            Logger.error('生成代码失败:', error);
        }
    }

    private async suggestArchitecture (projectType: string): Promise<void> {
        try {
            this.checkAIConfig();

            Logger.info(`正在为项目类型获取架构建议: ${projectType}`);
            const suggestion = await AIHelper.analyzeProjectRequirements(
                `project-${projectType}`,
                projectType,
                {}
            );

            Logger.success('AI架构建议:');
            console.log(JSON.stringify(suggestion, null, 2));
        } catch (error) {
            Logger.error('获取架构建议失败:', error);
        }
    }

    private async setupAI (): Promise<void> {
        const answers = await inquirer.prompt([
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
        AIHelper.initialize(answers.apiKey);
        Logger.success('AI服务配置完成!');
    }

    private checkAIConfig (): void {
        const apiKey = this.config.get<string>('ai.openaiApiKey');
        if (!apiKey) {
            throw new Error('未配置AI服务，请先运行 "fe-cli ai setup" 进行配置');
        }
        AIHelper.initialize(apiKey);
    }
}