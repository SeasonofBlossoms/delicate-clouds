import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

export class BuildUtils {
    // 执行命令
    static async execCommand (cmd: string, cwd = rootDir) {
        const { execSync } = await import('child_process');
        return execSync(cmd, { stdio: 'inherit', cwd });
    }


    static async access (dir: string) {
        return fs.access(dir);
    }
    static async clean (dir: string) {
        try {
            await fs.access(dir);
            await fs.rm(dir, { recursive: true, force: true });
            console.log(`✅ 清除${dir}`);
        } catch (error) {

        }
    }
    static async copyItem (
        source: string,
        targetBaseDir: string,
        type: 'file' | 'directory'
    ): Promise<boolean> {
        try {
            if (!await fs.pathExists(source)) {
                console.warn(`⚠️ 源路径不存在: ${source}`);
                return false;
            }
            // 验证类型匹配
            const sourceStat = await fs.stat(source);
            if ((type === 'file' && !sourceStat.isFile()) ||
                (type === 'directory' && !sourceStat.isDirectory())) {
                console.error(`❌ 类型不匹配: 期望${type}，实际是${sourceStat.isFile() ? '文件' : '目录'}`);
                return false;
            }
            // 确保目标目录存在
            await fs.ensureDir(targetBaseDir);
            // 构建完整目标路径
            const itemName = path.basename(source);
            const targetPath = path.join(targetBaseDir, itemName);
            // 执行复制
            if (type === 'file') {
                await fs.copyFile(source, targetPath);

            } else {
                // 使用 fs.copy 的覆盖选项
                await fs.copy(source, targetPath, { overwrite: true });

            }
            return true;
        } catch (error) {
            console.error(`❌ 复制失败: ${source}`, error);
            return false;
        }
    }
    static async copyMultipleItems (
        items: Array<{ source: string; type: 'file' | 'directory' }>,
        targetBaseDir: string
    ): Promise<boolean> {
        const results = await Promise.allSettled(
            items.map(item => this.copyItem(item.source, targetBaseDir, item.type))
        );
        let successCount = 0;
        results.forEach((result, index) => {
            const item = items[index];
            if (!item) {
                console.error(`❌ 复制失败: 第 ${index} 个项目不存在`);
                return;
            }
            if (result.status === 'fulfilled' && result.value) {
                successCount++;
            } else {
                console.error(`❌ 复制失败: ${item.source} (${item.type})`);
            }
        });
        const allSuccess = successCount === items.length;
        if (!allSuccess) {
            console.log('⚠️ 部分项目复制失败');
        }
        return allSuccess;
    }
    static async copyAuto (source: string, targetBaseDir: string): Promise<boolean> {
        if (!await fs.pathExists(source)) {
            console.warn(`⚠️ 源路径不存在: ${source}`);
            return false;
        }
        const sourceStat = await fs.stat(source);
        const type = sourceStat.isFile() ? 'file' : 'directory';
        return this.copyItem(source, targetBaseDir, type);
    }
}
export default BuildUtils