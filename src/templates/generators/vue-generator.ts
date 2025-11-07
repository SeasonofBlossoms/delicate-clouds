import { BaseGenerator } from './base-generator';
import { NpmUtil } from '../../utils/npm';
import { Logger } from '../../utils/logger';
export class VueGenerator extends BaseGenerator {
    type = 'vue';

    protected async generateProjectSpecific (
        targetPath: string,
        // variables: Record<string, any>
    ): Promise<void> {
        // 安装Vue依赖
        const dependencies = [
            'vue'
        ];

        const devDependencies = [
            '@vitejs/plugin-vue',
            'vite',
            'typescript',
            // ... 其他依赖
        ];

        Logger.info('安装Vue依赖...');
        await NpmUtil.installDependencies(targetPath, dependencies, false);
        await NpmUtil.installDependencies(targetPath, devDependencies, true);
    }
}