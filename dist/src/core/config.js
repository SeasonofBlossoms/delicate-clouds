"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
class ConfigManager {
    static instance;
    config = {};
    configPath;
    constructor() {
        this.configPath = this.getConfigPath();
        this.loadConfig();
    }
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    getConfigPath() {
        const homeDir = process.env.HOME || process.env.USERPROFILE;
        if (!homeDir) {
            throw new Error('无法确定用户主目录');
        }
        return path_1.default.join(homeDir, '.fe-cli', 'config.json');
    }
    loadConfig() {
        try {
            if (fs_extra_1.default.existsSync(this.configPath)) {
                this.config = fs_extra_1.default.readJSONSync(this.configPath);
                logger_1.Logger.debug('配置文件加载成功');
            }
            else {
                this.config = this.getDefaultConfig();
                this.saveConfig();
            }
        }
        catch (error) {
            logger_1.Logger.warn('配置文件加载失败，使用默认配置:', error);
            this.config = this.getDefaultConfig();
        }
    }
    getDefaultConfig() {
        return {
            ai: {
                provider: 'openai'
            },
            templates: {
                customPath: path_1.default.join(process.cwd(), '.fe-cli', 'templates')
            },
            tensorflow: {
                autoDownloadModels: true,
                modelCachePath: path_1.default.join(process.cwd(), '.tfjs-models')
            },
            features: {
                enableAI: true,
                enableTensorFlow: true
            }
        };
    }
    getConfig() {
        return { ...this.config };
    }
    get(key) {
        const keys = key.split('.');
        let value = this.config;
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            }
            else {
                return undefined;
            }
        }
        return value;
    }
    set(key, value) {
        const keys = key.split('.');
        let current = this.config;
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!(k in current)) {
                current[k] = {};
            }
            current = current[k];
        }
        current[keys[keys.length - 1]] = value;
        this.saveConfig();
    }
    saveConfig() {
        try {
            fs_extra_1.default.ensureDirSync(path_1.default.dirname(this.configPath));
            fs_extra_1.default.writeJSONSync(this.configPath, this.config, { spaces: 2 });
            logger_1.Logger.debug('配置文件保存成功');
        }
        catch (error) {
            logger_1.Logger.error('保存配置文件失败:', error);
        }
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=config.js.map