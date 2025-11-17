// src/types/actions.ts
import { type PromptAnswer } from './prompts.js';

export type ActionType = 'add' | 'modify' | 'append' | 'custom';

export interface BaseAction {
    type: ActionType;
    path: string;
    template?: string;
    data?: Record<string, any>;
    skip?: (answers: PromptAnswer) => boolean;
}

export interface AddAction extends BaseAction {
    type: 'add';
    templateFile?: string;
    force?: boolean;
}

export interface ModifyAction extends BaseAction {
    type: 'modify';
    pattern?: RegExp;
    template?: string;
}

export interface AppendAction extends BaseAction {
    type: 'append';
    separator?: string;
}

export type Action = AddAction | ModifyAction | AppendAction;

export type ActionFunction = (answers: PromptAnswer) => Action | Action[];

// 添加缺失的 ActionResult 类型
export interface ActionResult {
    action: Action;
    success: boolean;
    result?: any;
    error?: string;
}