export declare class FileUtil {
    static readDirRecursive(dir: string): Promise<string[]>;
    static ensureDir(dir: string): Promise<void>;
    static copy(src: string, dest: string): Promise<void>;
    static exists(path: string): Promise<boolean>;
    static readJSON(filePath: string): Promise<any>;
    static writeJSON(filePath: string, data: any): Promise<void>;
    static isDirectory(path: string): Promise<boolean>;
}
//# sourceMappingURL=file.d.ts.map