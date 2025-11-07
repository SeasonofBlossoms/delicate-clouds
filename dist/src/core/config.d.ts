export interface CLIConfig {
    ai?: {
        openaiApiKey?: string;
        provider?: 'openai' | 'claude' | 'custom';
        endpoint?: string;
    };
    templates?: {
        registry?: string;
        customPath?: string;
    };
    tensorflow?: {
        autoDownloadModels?: boolean;
        modelCachePath?: string;
    };
    features?: {
        enableAI?: boolean;
        enableTensorFlow?: boolean;
    };
}
export declare class ConfigManager {
    private static instance;
    private config;
    private configPath;
    private constructor();
    static getInstance(): ConfigManager;
    private getConfigPath;
    private loadConfig;
    private getDefaultConfig;
    getConfig(): CLIConfig;
    get<T>(key: string): T | undefined;
    set(key: string, value: any): void;
    private saveConfig;
}
//# sourceMappingURL=config.d.ts.map