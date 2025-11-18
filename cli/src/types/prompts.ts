// src/types/prompts.ts
import type { Question, Answers, } from 'inquirer';

// 重新导出 inquirer 类型
export type { Question, Answers };

// 扩展 inquirer 类型以支持你的特定需求
export interface AIPromptEnhancement {
    enabled: boolean;
    model?: string;
    temperature?: number;

}

// 自定义 Question 类型，继承 inquirer 的类型
export interface EnhancedQuestion<T extends Answers = Answers> extends Question<T> {
    aiEnhancement?: AIPromptEnhancement;
    validate?: (value: any) => boolean | string;
}

// 特定类型的快捷方式
export type InputQuestion = EnhancedQuestion & { type: 'input' };
export type ConfirmQuestion = EnhancedQuestion & { type: 'confirm' };
export type ListQuestion = EnhancedQuestion & { type: 'list' };
export type CheckboxQuestion = EnhancedQuestion & { type: 'checkbox' };
export type ExpandQuestion = EnhancedQuestion & { type: 'expand' };

export type PromptDefinition = EnhancedQuestion | EnhancedQuestion[];