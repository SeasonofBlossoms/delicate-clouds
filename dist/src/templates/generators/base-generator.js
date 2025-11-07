"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGenerator = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
const logger_1 = require("../../utils/logger");
const file_1 = require("../../utils/file");
class BaseGenerator {
    async generate(template, targetPath, variables) {
        try {
            // 执行前置钩子
            if (template.hooks?.preGenerate) {
                await template.hooks.preGenerate();
            }
            // 检查目标路径
            if (fs_extra_1.default.existsSync(targetPath)) {
                throw new Error(`目标路径 ${targetPath} 已存在`);
            }
            // 创建目标目录
            await fs_extra_1.default.ensureDir(targetPath);
            // 复制模板文件
            await this.copyTemplateFiles(template.path, targetPath, variables);
            // 执行项目特定逻辑
            await this.generateProjectSpecific(targetPath, variables);
            // 执行后置钩子
            if (template.hooks?.postGenerate) {
                await template.hooks.postGenerate();
            }
        }
        catch (error) {
            logger_1.Logger.error('生成模板失败:', error);
            throw error;
        }
    }
    async copyTemplateFiles(sourcePath, targetPath, variables) {
        const files = await file_1.FileUtil.readDirRecursive(sourcePath);
        for (const file of files) {
            const relativePath = path_1.default.relative(sourcePath, file);
            // 处理目标文件名：移除 .hbs 后缀
            let targetRelativePath = relativePath;
            if (relativePath.endsWith('.hbs')) {
                targetRelativePath = relativePath.slice(0, -4); // 移除 .hbs
            }
            const targetFile = path_1.default.join(targetPath, targetRelativePath);
            // 处理模板变量
            await this.processTemplateFile(file, targetFile, variables);
        }
    }
    async processTemplateFile(sourceFile, targetFile, variables) {
        const content = await fs_extra_1.default.readFile(sourceFile, 'utf-8');
        // 只有 .hbs 文件才使用 Handlebars 处理
        if (sourceFile.endsWith('.hbs')) {
            // 对于 JSX/TSX 文件，需要特殊处理内联样式
            let processedContent = content;
            // 转义 JSX 中的 {{ 和 }}，避免 Handlebars 解析
            // if (sourceFile.endsWith('.tsx.hbs') || sourceFile.endsWith('.jsx.hbs')) {
            //     processedContent = content.replace(/\{\{/g, '\\{\\{').replace(/\}\}/g, '\\}\\}');
            // }
            const template = handlebars_1.default.compile(processedContent);
            let result = template(variables);
            // 恢复转义的 JSX 语法
            // if (sourceFile.endsWith('.tsx.hbs') || sourceFile.endsWith('.jsx.hbs')) {
            //     result = result.replace(/\\\{\\{/g, '{{').replace(/\\\}\}/g, '}}');
            // }
            await fs_extra_1.default.ensureDir(path_1.default.dirname(targetFile));
            await fs_extra_1.default.writeFile(targetFile, result, 'utf-8');
        }
        else {
            // 非模板文件直接复制
            await fs_extra_1.default.ensureDir(path_1.default.dirname(targetFile));
            await fs_extra_1.default.copy(sourceFile, targetFile);
        }
    }
}
exports.BaseGenerator = BaseGenerator;
//# sourceMappingURL=base-generator.js.map