// src/types/inquirer-types.ts
import inquirer from 'inquirer';

// 为不同的 prompt 类型创建具体的接口
export interface InputPromptConfig {
    type: 'input';
    name: string;
    message: string;
    validate?: (value: string) => boolean | string;
    default?: string | ((answers: any) => string);
}

export interface ConfirmPromptConfig {
    type: 'confirm';
    name: string;
    message: string;
    default?: boolean;
}

export interface ListPromptConfig {
    type: 'list';
    name: string;
    message: string;
    choices: Array<{ name: string; value: any }>;
    default?: any;
}

export interface CheckboxPromptConfig {
    type: 'checkbox';
    name: string;
    message: string;
    choices: Array<{ name: string; value: any; checked?: boolean }>;
    default?: any[];
}

export type PromptConfig =
    | InputPromptConfig
    | ConfirmPromptConfig
    | ListPromptConfig
    | CheckboxPromptConfig;

export type PromptDefinition = PromptConfig | PromptConfig[];