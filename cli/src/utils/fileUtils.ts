// src/utils/fileUtils.ts
import fs from 'fs-extra';
import path from 'path';

export interface FileStats {
    exists: boolean;
    isFile: boolean;
    isDirectory: boolean;
    size: number;
    modified: Date;
}

export class FileUtils {
    static async ensureDirectory (dirPath: string): Promise<void> {
        await fs.ensureDir(dirPath);
    }

    static async fileExists (filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    static async readFile (filePath: string): Promise<string> {
        return await fs.readFile(filePath, 'utf8');
    }

    static async writeFile (filePath: string, content: string): Promise<void> {
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, content, 'utf8');
    }

    static async getFileStats (filePath: string): Promise<FileStats | null> {
        try {
            const stats = await fs.stat(filePath);
            return {
                exists: true,
                isFile: stats.isFile(),
                isDirectory: stats.isDirectory(),
                size: stats.size,
                modified: stats.mtime
            };
        } catch {
            return null;
        }
    }

    static async copyTemplate (sourcePath: string, targetPath: string, data: Record<string, any> = {}): Promise<void> {
        if (await this.fileExists(sourcePath)) {
            let content = await this.readFile(sourcePath);

            // 简单的模板变量替换
            Object.keys(data).forEach(key => {
                const placeholder = new RegExp(`{{${key}}}`, 'g');
                content = content.replace(placeholder, data[key]);
            });

            await this.writeFile(targetPath, content);
        } else {
            throw new Error(`Template file not found: ${sourcePath}`);
        }
    }

    static async findFiles (dir: string, pattern: RegExp): Promise<string[]> {
        const files: string[] = [];

        async function scanDirectory (currentDir: string) {
            const items = await fs.readdir(currentDir);

            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stats = await fs.stat(fullPath);

                if (stats.isDirectory()) {
                    await scanDirectory(fullPath);
                } else if (stats.isFile() && pattern.test(item)) {
                    files.push(fullPath);
                }
            }
        }

        await scanDirectory(dir);
        return files;
    }
}