import fs from 'fs-extra';
import path from 'path';
import { Logger } from '../utils/logger.js';
// import { FileUtil } from '../utils/file'; 
import { PathUtils } from '@delicate-clouds/tools'
import { BaseGenerator } from './generators/base-generator.js';
import { ReactGenerator } from './generators/react-generator.js';
export interface GenerateOptions {
    installDependencies?: boolean;
    packageManager?: 'npm' | 'yarn' | 'pnpm';
}

export interface TemplateConfig {
    name: string;
    description: string;
    type: 'react' | 'vue' | 'tensorflow' | 'custom';
    path: string;
    variables?: Record<string, any>;
    hooks?: {
        preGenerate?: () => Promise<void>;
        postGenerate?: () => Promise<void>;
    };
}

export class TemplateManager {
    private templates: Map<string, TemplateConfig> = new Map();
    private generators: Map<string, BaseGenerator> = new Map();

    constructor() {
        this.initializeGenerators();
        this.loadTemplates();
    }

    private initializeGenerators (): void {
        this.generators.set('react', new ReactGenerator());


    }

    private loadTemplates (): void {
        const builtInTemplates = this.loadBuiltInTemplates();
        const customTemplates = this.loadCustomTemplates();

        [...builtInTemplates, ...customTemplates].forEach(template => {
            this.templates.set(template.name, template);
        });
    }

    private loadBuiltInTemplates (): TemplateConfig[] {
        return [
            {
                name: 'react-ts',
                description: 'React + TypeScript 项目模板',
                type: 'react',
                path: PathUtils.resolveFromPackage(import.meta.url, 'templates/react')
            },

        ];
    }

    private loadCustomTemplates (): TemplateConfig[] {
        const customTemplatePath = path.join(process.cwd(), '.fe-cli/templates');
        if (!fs.existsSync(customTemplatePath)) {
            return [];
        }

        // 加载用户自定义模板
        // 实现自定义模板加载逻辑
        return [];
    }

    async registerCustomTemplate (templateConfig: TemplateConfig): Promise<void> {
        this.templates.set(templateConfig.name, templateConfig);
        await this.saveCustomTemplates();
    }

    getAvailableTemplates (): TemplateConfig[] {
        return Array.from(this.templates.values());
    }

    getTemplate (name: string): TemplateConfig | undefined {
        return this.templates.get(name);
    }

    async generateTemplate (
        templateName: string,
        targetPath: string,
        variables: Record<string, any> = {},
        options: GenerateOptions = {}
    ): Promise<void> {
        const template = this.getTemplate(templateName);
        if (!template) {
            throw new Error(`模板 ${templateName} 不存在`);
        }

        const generator = this.generators.get(template.type);
        if (!generator) {
            throw new Error(`不支持的项目类型: ${template.type}`);
        }

        // 生成模板
        await generator.generate(template, targetPath, variables);

        // 如果用户选择安装依赖
        if (options.installDependencies) {
            await this.installDependencies(generator, targetPath);
        }

        Logger.success(`模板 ${templateName} 生成成功!`);
    }
    private async installDependencies (generator: BaseGenerator, targetPath: string): Promise<void> {
        if ('installDependencies' in generator && typeof (generator as any).installDependencies === 'function') {
            await (generator as any).installDependencies(targetPath);
        } else {
            Logger.info('该模板不支持自动安装依赖');
            Logger.info('请手动运行: npm install');
        }
    }
    private async saveCustomTemplates (): Promise<void> {
        // 保存自定义模板配置
    }
}