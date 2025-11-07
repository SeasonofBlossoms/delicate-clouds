"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateManager = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
const react_generator_1 = require("./generators/react-generator");
const vue_generator_1 = require("./generators/vue-generator");
const tfjs_generator_1 = require("./generators/tfjs-generator");
class TemplateManager {
    templates = new Map();
    generators = new Map();
    constructor() {
        this.initializeGenerators();
        this.loadTemplates();
    }
    initializeGenerators() {
        this.generators.set('react', new react_generator_1.ReactGenerator());
        this.generators.set('vue', new vue_generator_1.VueGenerator());
        this.generators.set('tensorflow', new tfjs_generator_1.TFJSGenerator());
    }
    loadTemplates() {
        const builtInTemplates = this.loadBuiltInTemplates();
        const customTemplates = this.loadCustomTemplates();
        [...builtInTemplates, ...customTemplates].forEach(template => {
            this.templates.set(template.name, template);
        });
    }
    loadBuiltInTemplates() {
        return [
            {
                name: 'react-ts',
                description: 'React + TypeScript 项目模板',
                type: 'react',
                path: path_1.default.join(__dirname, '../../templates/react')
            },
            {
                name: 'vue-ts',
                description: 'Vue 3 + TypeScript 项目模板',
                type: 'vue',
                path: path_1.default.join(__dirname, '../../templates/vue')
            },
            {
                name: 'tfjs-starter',
                description: 'TensorFlow.js 入门模板',
                type: 'tensorflow',
                path: path_1.default.join(__dirname, '../../templates/tensorflow/starter')
            },
            {
                name: 'tfjs-ai-app',
                description: 'TensorFlow.js AI应用模板',
                type: 'tensorflow',
                path: path_1.default.join(__dirname, '../../templates/tensorflow/ai-app')
            }
        ];
    }
    loadCustomTemplates() {
        const customTemplatePath = path_1.default.join(process.cwd(), '.fe-cli/templates');
        if (!fs_extra_1.default.existsSync(customTemplatePath)) {
            return [];
        }
        // 加载用户自定义模板
        // 实现自定义模板加载逻辑
        return [];
    }
    async registerCustomTemplate(templateConfig) {
        this.templates.set(templateConfig.name, templateConfig);
        await this.saveCustomTemplates();
    }
    getAvailableTemplates() {
        return Array.from(this.templates.values());
    }
    getTemplate(name) {
        return this.templates.get(name);
    }
    async generateTemplate(templateName, targetPath, variables = {}, options = {}) {
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
        logger_1.Logger.success(`模板 ${templateName} 生成成功!`);
    }
    async installDependencies(generator, targetPath) {
        if ('installDependencies' in generator && typeof generator.installDependencies === 'function') {
            await generator.installDependencies(targetPath);
        }
        else {
            logger_1.Logger.info('该模板不支持自动安装依赖');
            logger_1.Logger.info('请手动运行: npm install');
        }
    }
    async saveCustomTemplates() {
        // 保存自定义模板配置
    }
}
exports.TemplateManager = TemplateManager;
//# sourceMappingURL=template-manager.js.map