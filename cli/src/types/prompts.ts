// src/types/prompts.ts

// 方案1：不使用 inquirer 类型，自己定义
export interface PromptAnswer {
    [key: string]: any;
}

// 自己定义 Prompt 类型
export interface BasePrompt {
    type: string;
    name: string;
    message: string;
    default?: any;
    validate?: (value: any) => boolean | string;
    when?: (answers: PromptAnswer) => boolean;
    choices?: Array<{ name: string; value: any }>;
}

export interface InputPrompt extends BasePrompt {
    type: 'input';
}

export interface ConfirmPrompt extends BasePrompt {
    type: 'confirm';
}

export interface ListPrompt extends BasePrompt {
    type: 'list';
    choices: Array<{ name: string; value: any }>;
}

export interface CheckboxPrompt extends BasePrompt {
    type: 'checkbox';
    choices: Array<{ name: string; value: any; checked?: boolean }>;
}

export type Prompt = InputPrompt | ConfirmPrompt | ListPrompt | CheckboxPrompt;
export type PromptDefinition = Prompt | Prompt[];

export interface AIPromptEnhancement {
    enabled: boolean;
    model?: string;
    temperature?: number;
}