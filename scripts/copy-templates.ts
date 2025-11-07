import fs from 'fs-extra';
import path from 'path';

interface CopyResult {
    success: boolean;
    message: string;
    filesCopied?: number;
    error?: string;
}

interface VerificationResult {
    isValid: boolean;
    details: string;
    missingFiles?: string[];
}

class TemplateCopier {
    private sourceDir: string;
    private targetDir: string;

    constructor() {
        // 使用 process.cwd() 获取根目录，确保兼容性
        const rootDir = process.cwd();
        this.sourceDir = path.join(rootDir, 'templates');
        this.targetDir = path.join(rootDir, 'dist', 'templates');
    }

    /**
     * 主复制函数
     */
    async copyTemplates (): Promise<CopyResult> {
        try {
            console.log('🚀 开始模板复制流程...');
            console.log('📍 源目录:', this.sourceDir);
            console.log('🎯 目标目录:', this.targetDir);

            // 检查源目录是否存在
            if (!(await fs.pathExists(this.sourceDir))) {
                const error = `源模板目录不存在: ${this.sourceDir}`;
                console.error('❌', error);
                return {
                    success: false,
                    message: '源模板目录不存在',
                    error
                };
            }

            // 确保目标目录存在
            await fs.ensureDir(this.targetDir);

            // 复制模板文件
            const copyResult = await this.copyDirectory(this.sourceDir, this.targetDir);

            // 验证复制结果
            const verificationResult = await this.verifyCopy();

            if (!verificationResult.isValid) {
                console.warn('⚠️ 验证警告:', verificationResult.details);
            }

            console.log('✅ 模板文件复制完成!');
            console.log(`📊 统计: 复制了 ${copyResult.filesCopied} 个文件`);

            return {
                success: true,
                message: '模板文件复制成功',
                filesCopied: copyResult.filesCopied
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('❌ 复制模板文件失败:', errorMessage);
            return {
                success: false,
                message: '复制模板文件失败',
                error: errorMessage
            };
        }
    }

    /**
     * 递归复制目录
     */
    private async copyDirectory (source: string, target: string): Promise<{ filesCopied: number }> {
        let filesCopied = 0;

        // 确保目标目录存在
        await fs.ensureDir(target);

        // 读取源目录内容
        const items = await fs.readdir(source);

        for (const item of items) {
            const sourcePath = path.join(source, item);
            const targetPath = path.join(target, item);

            const stat = await fs.stat(sourcePath);

            if (stat.isDirectory()) {
                // 递归复制子目录
                console.log(`📂 复制目录: ${item}`);
                const result = await this.copyDirectory(sourcePath, targetPath);
                filesCopied += result.filesCopied;
            } else {
                // 复制文件
                await fs.copy(sourcePath, targetPath);
                filesCopied++;

                // 只显示部分文件，避免输出太多
                if (filesCopied <= 10) {
                    console.log(`  📄 ${item}`);
                } else if (filesCopied === 11) {
                    console.log('  📄 ... 和其他文件');
                }
            }
        }

        return { filesCopied };
    }

    /**
     * 验证复制结果
     */
    private async verifyCopy (): Promise<VerificationResult> {
        try {
            // 检查目标目录是否存在
            if (!(await fs.pathExists(this.targetDir))) {
                return {
                    isValid: false,
                    details: '目标目录不存在',
                    missingFiles: []
                };
            }

            // 检查关键文件是否存在
            const criticalFiles = [
                'react/package.json.hbs',
                'vue-ts/package.json.hbs',
                'tensorflow/starter/package.json.hbs',
                'tensorflow/ai-app/package.json.hbs'
            ];

            const missingFiles: string[] = [];
            for (const file of criticalFiles) {
                const filePath = path.join(this.targetDir, file);
                if (!(await fs.pathExists(filePath))) {
                    missingFiles.push(file);
                }
            }

            if (missingFiles.length > 0) {
                return {
                    isValid: false,
                    details: `缺少关键文件: ${missingFiles.join(', ')}`,
                    missingFiles
                };
            }

            // 获取文件统计
            const sourceStats = await this.getDirectoryStats(this.sourceDir);
            const targetStats = await this.getDirectoryStats(this.targetDir);

            // 检查文件数量
            if (sourceStats.totalFiles !== targetStats.totalFiles) {
                return {
                    isValid: false,
                    details: `文件数量不匹配: 源目录 ${sourceStats.totalFiles} 个文件, 目标目录 ${targetStats.totalFiles} 个文件`,
                    missingFiles: []
                };
            }

            return {
                isValid: true,
                details: `验证成功: 所有 ${sourceStats.totalFiles} 个文件都已正确复制`,
                missingFiles: []
            };

        } catch (error) {
            return {
                isValid: false,
                details: `验证失败: ${error instanceof Error ? error.message : String(error)}`,
                missingFiles: []
            };
        }
    }

    /**
     * 获取目录统计信息
     */
    private async getDirectoryStats (dir: string): Promise<{ totalFiles: number; templates: Record<string, number> }> {
        const templates: Record<string, number> = {};
        let totalFiles = 0;

        async function scanDirectory (currentDir: string, relativePath: string = '') {
            const items = await fs.readdir(currentDir);

            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const newRelativePath = relativePath ? path.join(relativePath, item) : item;
                const stat = await fs.stat(fullPath);

                if (stat.isDirectory()) {
                    await scanDirectory(fullPath, newRelativePath);
                } else {
                    totalFiles++;

                    // 按模板类型统计
                    const templateType = newRelativePath.split(path.sep)[0];
                    if (templateType) {
                        templates[templateType] = (templates[templateType] || 0) + 1;
                    }
                }
            }
        }

        await scanDirectory(dir);
        return { totalFiles, templates };
    }

    /**
     * 显示详细的复制统计信息
     */
    async showStats (): Promise<void> {
        try {
            const sourceStats = await this.getDirectoryStats(this.sourceDir);
            const targetStats = await this.getDirectoryStats(this.targetDir);

            console.log('\n📊 复制统计信息:');
            console.log('='.repeat(40));
            console.log(`📁 源目录文件总数: ${sourceStats.totalFiles}`);
            console.log(`📁 目标目录文件总数: ${targetStats.totalFiles}`);

            // 按模板类型显示详细统计
            console.log('\n🎨 模板文件分布:');
            for (const [templateType, fileCount] of Object.entries(sourceStats.templates)) {
                const targetCount = targetStats.templates[templateType] || 0;
                const status = fileCount === targetCount ? '✅' : '❌';
                console.log(`  ${status} ${templateType}: ${fileCount} 个文件`);
            }

            // 显示关键文件检查
            console.log('\n🔍 关键文件检查:');
            const criticalFiles = [
                'react/package.json.hbs',
                'vue-ts/package.json.hbs',
                'tensorflow/starter/package.json.hbs',
                'tensorflow/ai-app/package.json.hbs'
            ];

            for (const file of criticalFiles) {
                const filePath = path.join(this.targetDir, file);
                const exists = await fs.pathExists(filePath);
                console.log(`  ${exists ? '✅' : '❌'} ${file}`);
            }

        } catch (error) {
            console.log('📊 无法获取统计信息:', error);
        }
    }

    /**
     * 显示模板预览
     */
    async showTemplatePreview (): Promise<void> {
        try {
            console.log('\n👀 模板预览:');
            console.log('='.repeat(40));

            const templateTypes = ['react', 'vue-ts', 'tensorflow/starter', 'tensorflow/ai-app'];

            for (const templateType of templateTypes) {
                const templatePath = path.join(this.targetDir, templateType);
                if (await fs.pathExists(templatePath)) {
                    const files = await this.getTemplateFiles(templatePath);
                    console.log(`\n📂 ${templateType}:`);

                    // 显示前5个文件作为预览
                    files.slice(0, 5).forEach(file => {
                        console.log(`  📄 ${file}`);
                    });

                    if (files.length > 5) {
                        console.log(`  ... 还有 ${files.length - 5} 个文件`);
                    }
                }
            }
        } catch (error) {
            console.log('👀 无法显示模板预览:', error);
        }
    }

    /**
     * 获取模板文件列表
     */
    private async getTemplateFiles (templatePath: string): Promise<string[]> {
        const files: string[] = [];

        async function scanDirectory (currentDir: string, baseDir: string = templatePath) {
            const items = await fs.readdir(currentDir);

            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const relativePath = path.relative(baseDir, fullPath);
                const stat = await fs.stat(fullPath);

                if (stat.isDirectory()) {
                    await scanDirectory(fullPath, baseDir);
                } else {
                    files.push(relativePath);
                }
            }
        }

        await scanDirectory(templatePath);
        return files;
    }
}

/**
 * 主函数
 */
async function main (): Promise<void> {
    const copier = new TemplateCopier();

    console.log('='.repeat(50));
    console.log('🛠️  前端 CLI - 模板复制工具');
    console.log('='.repeat(50));

    const result = await copier.copyTemplates();

    console.log('='.repeat(50));

    if (result.success) {
        console.log('🎉 模板复制成功!');

        // 显示详细统计信息
        await copier.showStats();

        // 显示模板预览
        await copier.showTemplatePreview();

        console.log('\n✅ 构建流程完成，模板已准备就绪!');
        console.log('💡 现在可以运行: fe-cli generate <项目名>');
    } else {
        console.log('❌ 模板复制失败!');
        console.log('错误信息:', result.error);
        process.exit(1);
    }
}

// 错误处理
process.on('unhandledRejection', (error) => {
    console.error('💥 未处理的 Promise 拒绝:', error);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('💥 未捕获的异常:', error);
    process.exit(1);
});

// 直接执行主函数
main().catch(error => {
    console.error('💥 脚本执行失败:', error);
    process.exit(1);
});

export { TemplateCopier, type CopyResult, type VerificationResult };