"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpmUtil = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const logger_1 = require("./logger");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class NpmUtil {
    static async installDependencies(cwd, dependencies, isDev = false) {
        if (dependencies.length === 0)
            return;
        const flag = isDev ? '--save-dev' : '--save';
        const command = `npm install ${flag} ${dependencies.join(' ')}`;
        try {
            logger_1.Logger.progress(`安装 ${isDev ? '开发' : '生产'}依赖`);
            // const { stdout, stderr } = await execAsync(command, { cwd });
            const { stderr } = await execAsync(command, { cwd });
            if (stderr) {
                logger_1.Logger.warn(`安装依赖警告: ${stderr}`);
            }
            logger_1.Logger.progressEnd(true);
            logger_1.Logger.debug(`依赖安装完成: ${dependencies.join(', ')}`);
        }
        catch (error) {
            logger_1.Logger.progressEnd(false);
            logger_1.Logger.error(`安装依赖失败: ${dependencies.join(', ')}`, error);
            throw error;
        }
    }
    static async checkNodeVersion() {
        try {
            const { stdout } = await execAsync('node --version');
            return stdout.trim();
        }
        catch (error) {
            logger_1.Logger.error('检查Node.js版本失败', error);
            throw error;
        }
    }
    static async checkNpmVersion() {
        try {
            const { stdout } = await execAsync('npm --version');
            return stdout.trim();
        }
        catch (error) {
            logger_1.Logger.error('检查npm版本失败', error);
            throw error;
        }
    }
    static async runScript(cwd, script, args = '') {
        const command = `npm run ${script} ${args}`;
        try {
            logger_1.Logger.info(`执行脚本: ${script}`);
            const { stdout, stderr } = await execAsync(command, { cwd });
            if (stdout)
                console.log(stdout);
            if (stderr)
                console.error(stderr);
        }
        catch (error) {
            logger_1.Logger.error(`执行脚本失败: ${script}`, error);
            throw error;
        }
    }
}
exports.NpmUtil = NpmUtil;
//# sourceMappingURL=npm.js.map