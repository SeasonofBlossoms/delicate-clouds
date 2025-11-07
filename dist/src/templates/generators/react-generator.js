"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactGenerator = void 0;
const base_generator_1 = require("./base-generator");
const npm_1 = require("../../utils/npm");
const logger_1 = require("../../utils/logger");
const path_1 = __importDefault(require("path"));
class ReactGenerator extends base_generator_1.BaseGenerator {
    type = 'react';
    async generateProjectSpecific(targetPath, variables) {
        console.log('variables', variables);
        // 不再自动安装依赖，而是显示提示信息
        logger_1.Logger.info('📦 React 项目已创建完成！');
        logger_1.Logger.info('下一步操作:');
        logger_1.Logger.info(`  cd ${path_1.default.basename(targetPath)}`);
        logger_1.Logger.info('  npm install');
        logger_1.Logger.info('  npm run dev');
        // 可选：如果用户想要自动安装，可以在这里添加逻辑
        // 但我们默认不自动安装，让用户手动控制
    }
    // 添加一个可选的方法用于安装依赖
    async installDependencies(targetPath) {
        logger_1.Logger.info('正在安装 React 依赖...');
        const dependencies = [
            'react',
            'react-dom'
        ];
        const devDependencies = [
            '@types/react',
            '@types/react-dom',
            '@vitejs/plugin-react',
            'typescript',
            'vite'
        ];
        try {
            await npm_1.NpmUtil.installDependencies(targetPath, dependencies, false);
            await npm_1.NpmUtil.installDependencies(targetPath, devDependencies, true);
            logger_1.Logger.success('依赖安装完成！');
        }
        catch (error) {
            logger_1.Logger.warn('依赖安装失败，请手动运行: npm install');
        }
    }
}
exports.ReactGenerator = ReactGenerator;
//# sourceMappingURL=react-generator.js.map