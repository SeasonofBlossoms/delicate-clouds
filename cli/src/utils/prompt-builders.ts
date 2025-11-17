// src/utils/prompt-builders.ts
import type { PromptConfig, InputPromptConfig, ConfirmPromptConfig, ListPromptConfig, CheckboxPromptConfig } from '../types/inquirer-types.js';

export const PromptBuilder = {
    input (name: string, message: string, options: Partial<Omit<InputPromptConfig, 'type' | 'name' | 'message'>> = {}): InputPromptConfig {
        return {
            type: 'input',
            name,
            message,
            ...options
        };
    },

    confirm (name: string, message: string, options: Partial<Omit<ConfirmPromptConfig, 'type' | 'name' | 'message'>> = {}): ConfirmPromptConfig {
        return {
            type: 'confirm',
            name,
            message,
            ...options
        };
    },

    list (name: string, message: string, choices: Array<{ name: string; value: any }>, options: Partial<Omit<ListPromptConfig, 'type' | 'name' | 'message' | 'choices'>> = {}): ListPromptConfig {
        return {
            type: 'list',
            name,
            message,
            choices,
            ...options
        };
    },

    checkbox (name: string, message: string, choices: Array<{ name: string; value: any; checked?: boolean }>, options: Partial<Omit<CheckboxPromptConfig, 'type' | 'name' | 'message' | 'choices'>> = {}): CheckboxPromptConfig {
        return {
            type: 'checkbox',
            name,
            message,
            choices,
            ...options
        };
    }
};