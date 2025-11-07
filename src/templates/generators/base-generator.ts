import fs from 'fs-extra';
import path from 'path';
import handlebars from 'handlebars';
import { TemplateConfig } from '../template-manager';
import { Logger } from '../../utils/logger';
import { FileUtil } from '../../utils/file';

export abstract class BaseGenerator {
    abstract type: string;

    async generate (
        template: TemplateConfig,
        targetPath: string,
        variables: Record<string, any>
    ): Promise<void> {
        try {
            // 执行前置钩子
            if (template.hooks?.preGenerate) {
                await template.hooks.preGenerate();
            }

            // 检查目标路径
            if (fs.existsSync(targetPath)) {
                throw new Error(`目标路径 ${targetPath} 已存在`);
            }

            // 创建目标目录
            await fs.ensureDir(targetPath);

            // 复制模板文件
            await this.copyTemplateFiles(template.path, targetPath, variables);

            // 执行项目特定逻辑
            await this.generateProjectSpecific(targetPath, variables);

            // 执行后置钩子
            if (template.hooks?.postGenerate) {
                await template.hooks.postGenerate();
            }
        } catch (error) {
            Logger.error('生成模板失败:', error);
            throw error;
        }
    }

    protected async copyTemplateFiles (
        sourcePath: string,
        targetPath: string,
        variables: Record<string, any>
    ): Promise<void> {
        const files = await FileUtil.readDirRecursive(sourcePath);

        for (const file of files) {
            const relativePath = path.relative(sourcePath, file);

            // 处理目标文件名：移除 .hbs 后缀
            let targetRelativePath = relativePath;
            if (relativePath.endsWith('.hbs')) {
                targetRelativePath = relativePath.slice(0, -4); // 移除 .hbs
            }

            const targetFile = path.join(targetPath, targetRelativePath);

            // 处理模板变量
            await this.processTemplateFile(file, targetFile, variables);
        }
    }

    protected async processTemplateFile (
        sourceFile: string,
        targetFile: string,
        variables: Record<string, any>
    ): Promise<void> {
        const content = await fs.readFile(sourceFile, 'utf-8');

        // 只有 .hbs 文件才使用 Handlebars 处理
        if (sourceFile.endsWith('.hbs')) {
            // 对于 JSX/TSX 文件，需要特殊处理内联样式
            let processedContent = content;

            // 转义 JSX 中的 {{ 和 }}，避免 Handlebars 解析
            // if (sourceFile.endsWith('.tsx.hbs') || sourceFile.endsWith('.jsx.hbs')) {
            //     processedContent = content.replace(/\{\{/g, '\\{\\{').replace(/\}\}/g, '\\}\\}');
            // }

            const template = handlebars.compile(processedContent);
            let result = template(variables);

            // 恢复转义的 JSX 语法
            // if (sourceFile.endsWith('.tsx.hbs') || sourceFile.endsWith('.jsx.hbs')) {
            //     result = result.replace(/\\\{\\{/g, '{{').replace(/\\\}\}/g, '}}');
            // }

            await fs.ensureDir(path.dirname(targetFile));
            await fs.writeFile(targetFile, result, 'utf-8');
        } else {
            // 非模板文件直接复制
            await fs.ensureDir(path.dirname(targetFile));
            await fs.copy(sourceFile, targetFile);
        }
    }

    protected abstract generateProjectSpecific (
        targetPath: string,
        variables: Record<string, any>
    ): Promise<void>;
}