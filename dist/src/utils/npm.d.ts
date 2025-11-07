export declare class NpmUtil {
    static installDependencies(cwd: string, dependencies: string[], isDev?: boolean): Promise<void>;
    static checkNodeVersion(): Promise<string>;
    static checkNpmVersion(): Promise<string>;
    static runScript(cwd: string, script: string, args?: string): Promise<void>;
}
//# sourceMappingURL=npm.d.ts.map