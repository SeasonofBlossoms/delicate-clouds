import { exec } from 'child_process';
import { promisify } from 'util';
import { Logger } from './logger';

const execAsync = promisify(exec);

export class NpmUtil {
    static async installDependencies (
        cwd: string,
        dependencies: string[],
        isDev: boolean = false
    ): Promise<void> {
        if (dependencies.length === 0) return;

        const flag = isDev ? '--save-dev' : '--save';
        const command = `npm install ${flag} ${dependencies.join(' ')}`;

        try {
            Logger.progress(`安装 ${isDev ? '开发' : '生产'}依赖`);
            // const { stdout, stderr } = await execAsync(command, { cwd });
            const { stderr } = await execAsync(command, { cwd });


            if (stderr) {
                Logger.warn(`安装依赖警告: ${stderr}`);
            }

            Logger.progressEnd(true);
            Logger.debug(`依赖安装完成: ${dependencies.join(', ')}`);
        } catch (error) {
            Logger.progressEnd(false);
            Logger.error(`安装依赖失败: ${dependencies.join(', ')}`, error);
            throw error;
        }
    }

    static async checkNodeVersion (): Promise<string> {
        try {
            const { stdout } = await execAsync('node --version');
            return stdout.trim();
        } catch (error) {
            Logger.error('检查Node.js版本失败', error);
            throw error;
        }
    }

    static async checkNpmVersion (): Promise<string> {
        try {
            const { stdout } = await execAsync('npm --version');
            return stdout.trim();
        } catch (error) {
            Logger.error('检查npm版本失败', error);
            throw error;
        }
    }

    static async runScript (cwd: string, script: string, args: string = ''): Promise<void> {
        const command = `npm run ${script} ${args}`;

        try {
            Logger.info(`执行脚本: ${script}`);
            const { stdout, stderr } = await execAsync(command, { cwd });

            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);
        } catch (error) {
            Logger.error(`执行脚本失败: ${script}`, error);
            throw error;
        }
    }
}