// src/types/generator.ts
import type { PromptDefinition, PromptAnswer, AIPromptEnhancement } from './prompts.js';
import type { Action, ActionFunction, ActionResult } from './actions.js';

export interface GeneratorConfig {
    description: string;
    prompts: PromptDefinition;
    actions: Action[] | ActionFunction;
    aiEnhancement?: AIPromptEnhancement;
    hooks?: {
        preAction?: (answers: PromptAnswer) => Promise<void>;
        postAction?: (answers: PromptAnswer, results: ActionResult[]) => Promise<void>;
    };
}

export interface GeneratorResult {
    generator: string;
    answers: PromptAnswer;
    actions: ActionResult[];
}