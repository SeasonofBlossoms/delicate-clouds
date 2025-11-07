import { BaseGenerator } from './base-generator';
import { NpmUtil } from '../../utils/npm';
import { Logger } from '../../utils/logger';

export class TFJSGenerator extends BaseGenerator {
    type = 'tensorflow';

    protected async generateProjectSpecific (
        targetPath: string,
        variables: Record<string, any>
    ): Promise<void> {
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

        Logger.info('安装TensorFlow.js依赖...');
        await NpmUtil.installDependencies(targetPath, dependencies, false);

        // 安装开发依赖
        const devDependencies = [
            'typescript',
            '@types/node'
        ];

        await NpmUtil.installDependencies(targetPath, devDependencies, true);

        // 生成AI模型配置文件（如果适用）
        if (variables.aiModel) {
            await this.generateAIModelConfig(targetPath, variables);
        }
    }

    private async generateAIModelConfig (
        targetPath: string,
        variables: Record<string, any>
    ): Promise<void> {
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