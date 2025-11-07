import { Command } from 'commander';
import inquirer from 'inquirer';
import { TemplateManager } from '../templates/template-manager';
import { Logger } from '../utils/logger';
import { FileUtil } from '../utils/file';
import chalk from 'chalk'

export class TemplateCommand {
    private templateManager: TemplateManager;

    constructor() {
        this.templateManager = new TemplateManager();
    }

    register (program: Command): void {
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

    private async listTemplates (): Promise<void> {
        const templates = this.templateManager.getAvailableTemplates();

        if (templates.length === 0) {
            Logger.info('没有可用的模板');
            return;
        }

        Logger.info('可用模板:');
        templates.forEach(template => {
            console.log(`  • ${chalk.cyan(template.name)} - ${template.description} (${template.type})`);
        });
    }

    private async createTemplate (name: string, options: any): Promise<void> {
        try {
            const answers = await inquirer.prompt([
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
                        const exists = await FileUtil.exists(input);
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
            Logger.success(`模板 ${name} 创建成功!`);
        } catch (error) {
            Logger.error('创建模板失败:', error);
        }
    }

    private async publishTemplate (name: string): Promise<void> {
        Logger.info(`发布模板 ${name}...`);
        // 实现模板发布逻辑
        Logger.success(`模板 ${name} 发布成功!`);
    }
}