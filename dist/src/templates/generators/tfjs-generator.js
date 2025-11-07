"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TFJSGenerator = void 0;
const base_generator_1 = require("./base-generator");
const npm_1 = require("../../utils/npm");
const logger_1 = require("../../utils/logger");
class TFJSGenerator extends base_generator_1.BaseGenerator {
    type = 'tensorflow';
    async generateProjectSpecific(targetPath, variables) {
        // 安装TensorFlow.js依赖
        const dependencies = [
            '@tensorflow/tfjs',
            '@tensorflow/tfjs-vis'
        ];
        if (variables.useNode) {
            dependencies.push('@tensorflow/tfjs-node');
        }
        if (variables.useReact) {
            dependencies.push('@tensorflow/tfjs-react');
        }
        logger_1.Logger.info('安装TensorFlow.js依赖...');
        await npm_1.NpmUtil.installDependencies(targetPath, dependencies, false);
        // 安装开发依赖
        const devDependencies = [
            'typescript',
            '@types/node'
        ];
        await npm_1.NpmUtil.installDependencies(targetPath, devDependencies, true);
        // 生成AI模型配置文件（如果适用）
        if (variables.aiModel) {
            await this.generateAIModelConfig(targetPath, variables);
        }
    }
    async generateAIModelConfig(targetPath, variables) {
        console.log('targetPath', targetPath);
        const modelConfig = {
            modelType: variables.aiModel,
            inputShape: variables.inputShape || [224, 224, 3],
            classes: variables.classes || 1000,
            preprocess: variables.preprocess || 'imagenet'
        };
        const configContent = `export const modelConfig = ${JSON.stringify(modelConfig, null, 2)};`;
        console.log('configContent', configContent);
        // 写入模型配置文件
        // 实现具体文件写入逻辑
    }
}
exports.TFJSGenerator = TFJSGenerator;
//# sourceMappingURL=tfjs-generator.js.map