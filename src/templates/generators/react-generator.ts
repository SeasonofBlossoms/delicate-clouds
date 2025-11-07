import { BaseGenerator } from './base-generator';
import { NpmUtil } from '../../utils/npm';
import { Logger } from '../../utils/logger';
import path from 'path';
export class ReactGenerator extends BaseGenerator {
    type = 'react';

    protected async generateProjectSpecific (
        targetPath: string,
        variables: Record<string, any>
    ): Promise<void> {
        console.log('variables', variables);

        // 不再自动安装依赖，而是显示提示信息
        Logger.info('📦 React 项目已创建完成！');
        Logger.info('下一步操作:');
        Logger.info(`  cd ${path.basename(targetPath)}`);
        Logger.info('  npm install');
        Logger.info('  npm run dev');

        // 可选：如果用户想要自动安装，可以在这里添加逻辑
        // 但我们默认不自动安装，让用户手动控制
    }

    // 添加一个可选的方法用于安装依赖
    async installDependencies (targetPath: string): Promise<void> {
        Logger.info('正在安装 React 依赖...');

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
            await NpmUtil.installDependencies(targetPath, dependencies, false);
            await NpmUtil.installDependencies(targetPath, devDependencies, true);
            Logger.success('依赖安装完成！');
        } catch (error) {
            Logger.warn('依赖安装失败，请手动运行: npm install');
        }
    }
}