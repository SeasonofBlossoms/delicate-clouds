import { fileURLToPath } from 'url';
import path from 'path';
import { existsSync } from 'fs';

/**
 * CLI 路径工具类
 * 解决 ESM 模块中的路径处理问题
 */
export class PathUtils {
    /**
     * 获取当前文件的目录路径（ESM 替代 __dirname）
     */
    static getCurrentDir (importMetaUrl: string): string {
        return path.dirname(fileURLToPath(importMetaUrl));
    }

    /**
     * 获取当前文件路径（ESM 替代 __filename）
     */
    static getCurrentFile (importMetaUrl: string): string {
        return fileURLToPath(importMetaUrl);
    }

    /**
     * 从当前文件解析相对路径
     */
    static resolveFromCurrent (importMetaUrl: string, ...paths: string[]): string {
        const currentDir = this.getCurrentDir(importMetaUrl);
        return path.join(currentDir, ...paths);
    }

    /**
     * 从项目根目录解析路径
     */
    static resolveFromRoot (...paths: string[]): string {
        return path.join(process.cwd(), ...paths);
    }

    /**
     * 从 CLI 包根目录解析路径（适用于模板等资源）
     */
    static resolveFromPackage (importMetaUrl: string, ...paths: string[]): string {
        // 假设 CLI 包根目录是当前文件的上两层
        const currentDir = this.getCurrentDir(importMetaUrl);
        const packageRoot = path.join(currentDir, '../..');
        return path.join(packageRoot, ...paths);
    }

    /**
     * 获取用户主目录路径
     */
    static getHomeDir (...paths: string[]): string {
        const homeDir = process.env.HOME || process.env.USERPROFILE || '';
        return path.join(homeDir, ...paths);
    }

    /**
     * 获取 CLI 配置目录（通常位于用户主目录）
     */
    static getConfigDir (cliName: string, ...paths: string[]): string {
        const homeDir = this.getHomeDir();

        // 跨平台配置目录
        const configDir = process.platform === 'win32'
            ? path.join(homeDir, 'AppData', 'Roaming', cliName)
            : path.join(homeDir, '.config', cliName);

        return path.join(configDir, ...paths);
    }

    /**
     * 获取临时目录路径
     */
    static getTempDir (...paths: string[]): string {
        return path.join(process.env.TMPDIR || '/tmp', ...paths);
    }

    /**
     * 确保目录存在，不存在则创建
     */
    static async ensureDir (dirPath: string): Promise<void> {
        const fs = await import('fs/promises');
        try {
            await fs.access(dirPath);
        } catch {
            await fs.mkdir(dirPath, { recursive: true });
        }
    }

    /**
     * 路径是否存在
     */
    static exists (filePath: string): boolean {
        return existsSync(filePath);
    }

    /**
     * 标准化路径（处理 ~ 等特殊字符）
     */
    static normalizePath (filePath: string): string {
        if (filePath.startsWith('~')) {
            return path.join(this.getHomeDir(), filePath.slice(1));
        }
        return path.normalize(filePath);
    }

    /**
     * 获取相对路径（相对于当前工作目录）
     */
    static getRelativePath (absolutePath: string): string {
        return path.relative(process.cwd(), absolutePath);
    }

    /**
     * 路径是否是绝对路径
     */
    static isAbsolute (filePath: string): boolean {
        return path.isAbsolute(filePath);
    }

}

/**
 * 创建路径解析器的快捷方式
 */
export function createPathResolver (importMetaUrl: string) {
    return {
        currentDir: () => PathUtils.getCurrentDir(importMetaUrl),
        currentFile: () => PathUtils.getCurrentFile(importMetaUrl),
        resolve: (...paths: string[]) => PathUtils.resolveFromCurrent(importMetaUrl, ...paths),
        fromPackage: (...paths: string[]) => PathUtils.resolveFromPackage(importMetaUrl, ...paths)
    };
}

// 默认导出
export default PathUtils;