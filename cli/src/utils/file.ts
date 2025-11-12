import fs from 'fs-extra';
import path from 'path';
import { Logger } from './logger.js';

export class FileUtil {
    static async readDirRecursive (dir: string): Promise<string[]> {
        try {
            const items = await fs.readdir(dir);
            let files: string[] = [];

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = await fs.stat(fullPath);

                if (stat.isDirectory()) {
                    const subFiles = await this.readDirRecursive(fullPath);
                    files = files.concat(subFiles);
                } else {
                    files.push(fullPath);
                }
            }

            return files;
        } catch (error) {
            Logger.error(`读取目录失败: ${dir}`, error);
            throw error;
        }
    }

    static async ensureDir (dir: string): Promise<void> {
        await fs.ensureDir(dir);
    }

    static async copy (src: string, dest: string): Promise<void> {
        await fs.copy(src, dest);
    }

    static async exists (path: string): Promise<boolean> {
        return fs.pathExists(path);
    }

    static async readJSON (filePath: string): Promise<any> {
        try {
            return await fs.readJSON(filePath);
        } catch (error) {
            Logger.error(`读取JSON文件失败: ${filePath}`, error);
            throw error;
        }
    }

    static async writeJSON (filePath: string, data: any): Promise<void> {
        try {
            await fs.writeJSON(filePath, data, { spaces: 2 });
        } catch (error) {
            Logger.error(`写入JSON文件失败: ${filePath}`, error);
            throw error;
        }
    }

    static async isDirectory (path: string): Promise<boolean> {
        try {
            const stat = await fs.stat(path);
            return stat.isDirectory();
        } catch {
            return false;
        }
    }
}