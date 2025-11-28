// src/core/InteractivePrompter.ts
import inquirer, { type DistinctQuestion } from 'inquirer';
import type {
    Answers,
    PromptDefinition,
    AIPromptEnhancement,
    Question
} from '../types/prompts.js';
import type {
    Action,
    ActionFunction,
    ActionResult,
    ActionContext
} from '../types/actions.js';
import { TemplateEngine } from './TemplateEngine.js';
import { DeepSeekService } from './DeepSeekService.js';
import { tableTemplate, tableHook, baseLayout, framework } from '../templates/index.js';

export class InteractivePrompter {
    private templateEngine: TemplateEngine;
    private DeepSeekService: DeepSeekService;
    constructor() {
        this.templateEngine = new TemplateEngine();
        this.DeepSeekService = new DeepSeekService();
    }

    /**
     * 执行交互式提示
     */
    async prompt<T extends Answers = Answers> (
        prompts: PromptDefinition,
        initialAnswers: Partial<T> = {},
        aiEnhancement?: AIPromptEnhancement
    ): Promise<T> {
        try {
            // 转换 prompts 为 inquirer 兼容格式
            const inquirerPrompts = this.normalizePrompts(prompts);
            // 执行提示 
            const answers = await inquirer.prompt(inquirerPrompts, initialAnswers);

            // AI 增强答案  
            // const enhancedAnswers = aiEnhancement?.enabled
            //     ? await this.aiEnhanceAnswers(answers, aiEnhancement)
            //     : answers;
            const enhancedAnswers = answers

            return enhancedAnswers as T;
        } catch (error) {
            console.error('Prompt execution failed:', error);
            throw new Error(`Interactive prompting failed: ${error}`);
        }
    }

    /**
     * 准备并处理 actions
     */
    async prepareActions<T extends Answers = Answers> (
        actions: Action[] | ActionFunction<T>,
        answers: T,
        context: Partial<ActionContext<T>> = {}
    ): Promise<Action[]> {
        let actionList: Action[];

        try {
            if (typeof actions === 'function') {
                const actionFunction = actions as ActionFunction<T>;
                const result = actionFunction(answers);

                // 处理异步 ActionFunction
                if (result instanceof Promise) {
                    const resolvedResult = await result;
                    actionList = Array.isArray(resolvedResult) ? resolvedResult : [resolvedResult];
                } else {
                    actionList = Array.isArray(result) ? result : [result];
                }
            } else {
                actionList = actions;
            }

            // 过滤需要跳过的 actions
            const filteredActions = actionList.filter(action =>
                !action.skip || !action.skip(answers)
            );
            const finallyActions = filteredActions.map(action =>
                this.processActionTemplate(action, answers, context)
            );
            const prompt = `
    请根据以下配置生成一个 Vue 页面代码:
    页面名称: ${answers.name}
    页面类型: ${answers.pageType}  
    表格配置: ${JSON.stringify(answers.tableOptions)}
    操作项: ${JSON.stringify(answers.operaOptions)}
    表格模板：${tableTemplate(answers)}
    表格钩子：${tableHook(answers)}
    布局模板：${baseLayout({ content: '页面内容' })}
    框架模板：${framework({ templateContent: '模板内容', scriptContent: '脚本内容', styleContent: '样式内容' })}
    请生成嵌套的 Vue 页面代码。
  `;
            try {
                const res = await this.DeepSeekService.generateResponse(prompt)
                console.log('generateResponse', res);

            } catch (error) {
            }

            // 处理模板
            return finallyActions
        } catch (error) {
            console.error('Action preparation failed:', error);
            throw new Error(`Failed to prepare actions: ${error}`);
        }
    }

    /**
     * 批量执行 actions
     */
    async executeActions<T extends Answers = Answers> (
        actions: Action[],
        answers: T,
        context: Partial<ActionContext<T>> = {}
    ): Promise<ActionResult[]> {
        const results: ActionResult[] = [];

        for (const action of actions) {
            try {
                const result = await this.executeSingleAction(action, answers, context);
                results.push(result);

                if (!result.success) {
                    console.warn(`Action failed: ${action.type} ${action.path}`, result.error);
                }
            } catch (error) {
                results.push({
                    action,
                    success: false,
                    error: error
                });
            }
        }

        return results;
    }

    /**
     * 规范化 prompts，确保与 inquirer 兼容
     */
    private normalizePrompts (prompts: PromptDefinition): DistinctQuestion[] {
        if (Array.isArray(prompts)) {
            return prompts.map(prompt => this.normalizeSinglePrompt(prompt));
        }
        return [this.normalizeSinglePrompt(prompts)];
    }

    /**
     * 规范化单个 prompt
     */
    private normalizeSinglePrompt (prompt: any): DistinctQuestion {
        // 处理 choices 函数
        if (prompt.choices && typeof prompt.choices === 'function') {
            return {
                ...prompt,
                choices: (answers: Answers) => {
                    const result = prompt.choices(answers);
                    return this.normalizeChoices(result);
                }
            };
        }

        // 处理静态 choices
        if (prompt.choices && Array.isArray(prompt.choices)) {
            return {
                ...prompt,
                choices: this.normalizeChoices(prompt.choices)
            };
        }

        return prompt;
    }

    /**
     * 规范化 choices 选项
     */
    private normalizeChoices (choices: any[]): Question[] {
        return choices.map(choice => {
            if (typeof choice === 'string') {
                return { name: choice, value: choice };
            }
            return choice;
        });
    }

    /**
     * 处理 action 模板
     */
    private processActionTemplate<T extends Answers> (
        action: Action,
        data: T,
        context: Partial<ActionContext<T>>
    ): Action {
        const processedAction = { ...action };

        // 处理路径模板
        if (action.path) {
            processedAction.path = this.templateEngine.compile(action.path, {
                ...data,
                ...context
            });
        }

        // 处理模板内容
        if (action.template) {
            processedAction.template = this.templateEngine.compile(action.template, {
                ...data,
                ...context
            });
        }

        // 处理数据模板（如果有）
        if (action.data) {
            processedAction.data = Object.fromEntries(
                Object.entries(action.data).map(([key, value]) => [
                    key,
                    typeof value === 'string'
                        ? this.templateEngine.compile(value, { ...data, ...context })
                        : value
                ])
            );
        }

        return processedAction;
    }

    /**
     * 执行单个 action
     */
    private async executeSingleAction<T extends Answers> (
        action: Action,
        answers: T,
        context: Partial<ActionContext<T>>
    ): Promise<ActionResult> {
        const startTime = Date.now();

        try {
            let result: any;

            switch (action.type) {
                case 'add':
                    result = await this.executeAddAction(action, answers, context);
                    break;
                case 'modify':
                    result = await this.executeModifyAction(action, answers, context);
                    break;
                case 'append':
                    result = await this.executeAppendAction(action, answers, context);
                    break;
                case 'custom':
                    result = await this.executeCustomAction(action, answers, context);
                    break;
                default:
                    throw new Error(`Unknown action type: ${(action as any).type}`);
            }

            return {
                action,
                success: true,
                result,
                duration: Date.now() - startTime,
                filePath: action.path
            };
        } catch (error) {
            return {
                action,
                success: false,
                error,
                duration: Date.now() - startTime,
                filePath: action.path
            };
        }
    }

    /**
     * 执行添加文件 action
     */
    private async executeAddAction<T extends Answers> (
        action: Action,
        answers: T,
        context: Partial<ActionContext<T>>
    ): Promise<any> {
        // 实现具体的文件添加逻辑
        console.log(`Adding file: ${action.path}`);
        // TODO: 实现实际的文件创建逻辑
        return { created: true, path: action.path };
    }

    /**
     * 执行修改文件 action
     */
    private async executeModifyAction<T extends Answers> (
        action: Action,
        answers: T,
        context: Partial<ActionContext<T>>
    ): Promise<any> {
        // 实现具体的文件修改逻辑
        console.log(`Modifying file: ${action.path}`);
        // TODO: 实现实际的文件修改逻辑
        return { modified: true, path: action.path };
    }

    /**
     * 执行追加内容 action
     */
    private async executeAppendAction<T extends Answers> (
        action: Action,
        answers: T,
        context: Partial<ActionContext<T>>
    ): Promise<any> {
        // 实现具体的文件追加逻辑
        console.log(`Appending to file: ${action.path}`);
        // TODO: 实现实际的文件追加逻辑
        return { appended: true, path: action.path };
    }

    /**
     * 执行自定义 action
     */
    private async executeCustomAction<T extends Answers> (
        action: Action,
        answers: T,
        context: Partial<ActionContext<T>>
    ): Promise<any> {
        // 执行自定义逻辑
        if ((action as any).execute) {
            return await (action as any).execute(answers);
        }
        throw new Error('Custom action missing execute function');
    }

    /**
     * AI 增强答案
     */
    private async aiEnhanceAnswers<T extends Answers> (
        answers: T,
        enhancement: AIPromptEnhancement
    ): Promise<T> {
        console.log('AI enhancement would be applied here');
        // TODO: 集成实际的 AI 服务
        return answers;
    }
}