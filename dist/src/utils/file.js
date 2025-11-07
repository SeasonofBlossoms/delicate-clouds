"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtil = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("./logger");
class FileUtil {
    static async readDirRecursive(dir) {
        try {
            const items = await fs_extra_1.default.readdir(dir);
            let files = [];
            for (const item of items) {
                const fullPath = path_1.default.join(dir, item);
                const stat = await fs_extra_1.default.stat(fullPath);
                if (stat.isDirectory()) {
                    const subFiles = await this.readDirRecursive(fullPath);
                    files = files.concat(subFiles);
                }
                else {
                    files.push(fullPath);
                }
            }
            return files;
        }
        catch (error) {
            logger_1.Logger.error(`读取目录失败: ${dir}`, error);
            throw error;
        }
    }
    static async ensureDir(dir) {
        await fs_extra_1.default.ensureDir(dir);
    }
    static async copy(src, dest) {
        await fs_extra_1.default.copy(src, dest);
    }
    static async exists(path) {
        return fs_extra_1.default.pathExists(path);
    }
    static async readJSON(filePath) {
        try {
            return await fs_extra_1.default.readJSON(filePath);
        }
        catch (error) {
            logger_1.Logger.error(`读取JSON文件失败: ${filePath}`, error);
            throw error;
        }
    }
    static async writeJSON(filePath, data) {
        try {
            await fs_extra_1.default.writeJSON(filePath, data, { spaces: 2 });
        }
        catch (error) {
            logger_1.Logger.error(`写入JSON文件失败: ${filePath}`, error);
            throw error;
        }
    }
    static async isDirectory(path) {
        try {
            const stat = await fs_extra_1.default.stat(path);
            return stat.isDirectory();
        }
        catch {
            return false;
        }
    }
}
exports.FileUtil = FileUtil;
//# sourceMappingURL=file.js.map