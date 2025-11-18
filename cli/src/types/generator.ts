// src/types/generator.ts
import type { PromptDefinition, Answers, AIPromptEnhancement } from './prompts.js';
import type { Action, ActionFunction, ActionResult } from './actions.js';

// 更严格的 GeneratorConfig 类型
export interface GeneratorConfig<T extends Answers = Answers> {
    description: string;
    prompts: PromptDefinition;
    actions: Action[] | ActionFunction<T>;
    aiEnhancement?: AIPromptEnhancement;
    hooks?: {
        preAction?: (answers: T) => Promise<void> | void;
        postAction?: (answers: T, results: ActionResult[]) => Promise<void> | void;
    };
}

// 基础配置接口，用于共享通用属性
export interface BaseGeneratorConfig {
    description: string;
    aiEnhancement?: AIPromptEnhancement;
}

// 同步生成器配置
export interface SyncGeneratorConfig<T extends Answers = Answers> extends BaseGeneratorConfig {
    prompts: PromptDefinition;
    actions: Action[];
    hooks?: {
        preAction?: (answers: T) => void;
        postAction?: (answers: T, results: ActionResult[]) => void;
    };
}

// 异步生成器配置
export interface AsyncGeneratorConfig<T extends Answers = Answers> extends BaseGeneratorConfig {
    prompts: PromptDefinition;
    actions: ActionFunction<T>;
    hooks?: {
        preAction?: (answers: T) => Promise<void>;
        postAction?: (answers: T, results: ActionResult[]) => Promise<void>;
    };
}

// 条件类型，根据 actions 类型推断 hooks 的同步/异步
export type ResolvedGeneratorConfig<T extends Answers = Answers> =
    T['actions'] extends Action[] ? SyncGeneratorConfig<T> : AsyncGeneratorConfig<T>;

export interface GeneratorResult<T extends Answers = Answers> {
    generator: string;
    answers: T;
    actions: ActionResult[];
    duration?: number;
    timestamp?: Date;
}

// 生成器元数据
export interface GeneratorMetadata {
    name: string;
    version?: string;
    category?: string;
    tags?: string[];
    author?: string;
}

// 完整的生成器定义
export interface Generator<T extends Answers = Answers> extends GeneratorConfig<T>, GeneratorMetadata {
    // 可以添加其他特定方法或属性
}

// 类型守卫
export function isSyncGenerator (config: GeneratorConfig): config is SyncGeneratorConfig {
    return Array.isArray(config.actions);
}

export function isAsyncGenerator (config: GeneratorConfig): config is AsyncGeneratorConfig {
    return typeof config.actions === 'function';
}

// 工具类型：从生成器中提取答案类型
export type ExtractAnswers<T> = T extends GeneratorConfig<infer U> ? U : Answers;

// 创建生成器的辅助函数
export function createGenerator<T extends Answers = Answers> (
    config: GeneratorConfig<T> & Partial<GeneratorMetadata>
): Generator<T> {
    return {
        name: 'unnamed',
        ...config
    };
}