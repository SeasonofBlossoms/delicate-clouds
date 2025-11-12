import { Command } from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import { TemplateManager, type GenerateOptions } from '../templates/template-manager.js';
import { Logger } from '../utils/logger.js';

interface GenerateCLIOptions {
    template?: string;
    output?: string;
    install?: boolean;
    noInstall?: boolean;
}

export class GenerateCommand {
    private templateManager: TemplateManager;

    constructor() {
        this.templateManager = new TemplateManager();
    }

    register (program: Command): void {
        program
            .command('generate [project-name]')
            .description('生成新项目')
            .option('-t, --template <template>', '指定模板名称')
            .option('-o, --output <output>', '输出目录', process.cwd())
            .option('--install', '自动安装依赖')
            .option('--no-install', '不自动安装依赖（默认）')
            .action(async (projectName, options: GenerateCLIOptions) => {
                await this.execute(projectName, options);
            });
    }

    private async execute (projectName: string, options: GenerateCLIOptions): Promise<void> {
        try {
            if (!projectName) {
                const answer = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'projectName',
                        message: '请输入项目名称:',
                        validate: (input: string) => !!input || '项目名称不能为空'
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
                path.join(options.output, projectName) :
                path.join(process.cwd(), projectName);

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
            const generateOptions: GenerateOptions = {
                installDependencies
            };

            await this.templateManager.generateTemplate(templateName!, targetPath, variables, generateOptions);

            // 显示下一步操作提示
            this.showNextSteps(projectName, targetPath, installDependencies);

        } catch (error) {
            Logger.error('生成项目失败:', error);
            process.exit(1);
        }
    }

    private async promptForTemplate (): Promise<any> {
        const templates = this.templateManager.getAvailableTemplates();

        return inquirer.prompt([
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

    private showNextSteps (projectName: string, targetPath: string, installed: boolean): void {
        Logger.success('\n🎉 项目创建成功!');

        if (installed) {
            Logger.info('✅ 依赖已自动安装');
            Logger.info('下一步操作:');
            console.log(`
  cd ${projectName}
  npm run dev
      `);
        } else {
            Logger.info('下一步操作:');
            console.log(`
  cd ${projectName}
  npm install      # 安装依赖
  npm run dev      # 启动开发服务器
      `);
        }

        Logger.info(`项目目录: ${targetPath}`);
    }
}