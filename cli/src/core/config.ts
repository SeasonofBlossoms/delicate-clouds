import fs from 'fs-extra';
import path from 'path';
import { Logger } from '../utils/logger.js';

export interface CLIConfig {
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

export class ConfigManager {
    private static instance: ConfigManager;
    private config: CLIConfig = {};
    private configPath: string;

    private constructor() {
        this.configPath = this.getConfigPath();
        this.loadConfig();
    }

    static getInstance (): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    private getConfigPath (): string {
        const homeDir = process.env.HOME || process.env.USERPROFILE;
        if (!homeDir) {
            throw new Error('无法确定用户主目录');
        }
        return path.join(homeDir, '.fe-cli', 'config.json');
    }

    private loadConfig (): void {
        try {
            if (fs.existsSync(this.configPath)) {
                this.config = fs.readJSONSync(this.configPath);
                Logger.debug('配置文件加载成功');
            } else {
                this.config = this.getDefaultConfig();
                this.saveConfig();
            }
        } catch (error) {
            Logger.warn('配置文件加载失败，使用默认配置:', error);
            this.config = this.getDefaultConfig();
        }
    }

    private getDefaultConfig (): CLIConfig {
        return {

            templates: {
                customPath: path.join(process.cwd(), '.fe-cli', 'templates')
            },
            tensorflow: {
                autoDownloadModels: true,
                modelCachePath: path.join(process.cwd(), '.tfjs-models')
            },
            features: {
                enableAI: true,
                enableTensorFlow: true
            }
        };
    }

    getConfig (): CLIConfig {
        return { ...this.config };
    }

    get<T> (key: string): T | undefined {
        const keys = key.split('.');
        let value: any = this.config;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return undefined;
            }
        }
        return value;
    }

    set (key: string, value: any): void {
        const keys = key.split('.');

        // 验证键路径不为空
        if (keys.some(k => k.trim() === '')) {
            throw new Error(`Invalid key path: ${key}`);
        }

        let current: any = this.config;

        // 处理除最后一个键之外的所有键
        for (const k of keys.slice(0, -1)) {
            if (current[k] === undefined || typeof current[k] !== 'object') {
                current[k] = {};
            }
            current = current[k];
        }

        // 设置最后一个键的值，添加明确的检查
        const lastKey = keys[keys.length - 1];
        if (lastKey === undefined) {
            throw new Error(`Invalid key path: ${key}`);
        }
        current[lastKey] = value;
        this.saveConfig();
    }

    private saveConfig (): void {
        try {
            fs.ensureDirSync(path.dirname(this.configPath));
            fs.writeJSONSync(this.configPath, this.config, { spaces: 2 });
            Logger.debug('配置文件保存成功');
        } catch (error) {
            Logger.error('保存配置文件失败:', error);
        }
    }
}