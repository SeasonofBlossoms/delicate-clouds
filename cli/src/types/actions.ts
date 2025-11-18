// src/types/actions.ts
import { type Answers } from './prompts.js';

export type ActionType = 'add' | 'modify' | 'append' | 'custom';

// 基础 Action 接口
export interface BaseAction<T extends ActionType = ActionType> {
    type: T;
    path: string;
    template?: string;
    data?: Record<string, any>;
    skip?: (answers: Answers) => boolean;
    when?: (answers: Answers) => boolean;
    description?: string;
}

// 具体的 Action 类型
export interface AddAction extends BaseAction<'add'> {
    templateFile?: string;
    force?: boolean;
    skipIfExists?: boolean;
}

export interface ModifyAction extends BaseAction<'modify'> {
    pattern: RegExp | string;
    template: string;
    flags?: string; // 用于正则表达式标志
}

export interface AppendAction extends BaseAction<'append'> {
    pattern?: RegExp | string; // 用于确定插入位置
    template: string;
    separator?: string;
    position?: 'before' | 'after'; // 相对于匹配位置
}

export interface CustomAction extends BaseAction<'custom'> {
    execute: (answers: Answers) => Promise<void> | void;
}

export type Action = AddAction | ModifyAction | AppendAction | CustomAction;

// Action 函数类型
export type ActionFunction<T extends Answers = Answers> = (answers: T) => Action | Action[] | Promise<Action | Action[]>;

// Action 执行结果
export interface ActionResult<T extends Action = Action> {
    action: T;
    success: boolean;
    result?: any;
    error?: any;
    duration?: number;
    filePath?: string; // 实际操作的文件路径
}

// Action 上下文，用于在执行时传递额外信息
export interface ActionContext<T extends Answers = Answers> {
    answers: T;
    cwd: string;
    dryRun?: boolean;
}

// 类型守卫函数
export function isAddAction (action: Action): action is AddAction {
    return action.type === 'add';
}

export function isModifyAction (action: Action): action is ModifyAction {
    return action.type === 'modify';
}

export function isAppendAction (action: Action): action is AppendAction {
    return action.type === 'append';
}

export function isCustomAction (action: Action): action is CustomAction {
    return action.type === 'custom';
}

// Action 创建工具函数
export function createAddAction (path: string, options: Omit<AddAction, 'type' | 'path'>): AddAction {
    return {
        type: 'add',
        path,
        ...options
    };
}

export function createModifyAction (path: string, pattern: RegExp | string, template: string, options: Omit<ModifyAction, 'type' | 'path' | 'pattern' | 'template'> = {}): ModifyAction {
    return {
        type: 'modify',
        path,
        pattern,
        template,
        ...options
    };
}

export function createAppendAction (path: string, template: string, options: Omit<AppendAction, 'type' | 'path' | 'template'> = {}): AppendAction {
    return {
        type: 'append',
        path,
        template,
        ...options
    };
}

// Action 处理器类型
export type ActionHandler<T extends Action = Action> = (action: T, context: ActionContext) => Promise<ActionResult<T>>;

// Action 处理器映射
export interface ActionHandlers {
    add: ActionHandler<AddAction>;
    modify: ActionHandler<ModifyAction>;
    append: ActionHandler<AppendAction>;
    custom: ActionHandler<CustomAction>;
}

// 批量操作结果
export interface BatchActionResult {
    total: number;
    successful: number;
    failed: number;
    results: ActionResult[];
}