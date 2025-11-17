// src/core/InteractivePrompter.ts
import inquirer, { type DistinctQuestion } from 'inquirer';
import type { PromptAnswer, PromptDefinition, AIPromptEnhancement } from '../types/prompts.js';
import type { Action, ActionFunction } from '../types/actions.js';
import { TemplateEngine } from './TemplateEngine.js';

export class InteractivePrompter {
    private templateEngine: TemplateEngine;

    constructor() {
        this.templateEngine = new TemplateEngine();
    }

    async prompt (
        prompts: PromptDefinition,
        initialAnswers: PromptAnswer = {},
        aiEnhancement?: AIPromptEnhancement
    ): Promise<PromptAnswer> {
        // 修复：直接使用 inquirer.prompt
        const answers = await inquirer.prompt(prompts as DistinctQuestion, initialAnswers);

        // AI 增强答案
        const enhancedAnswers = aiEnhancement?.enabled
            ? await this.aiEnhanceAnswers(answers, aiEnhancement)
            : answers;

        return enhancedAnswers;
    }

    async prepareActions (
        actions: Action[] | ActionFunction,
        answers: PromptAnswer
    ): Promise<Action[]> {
        let actionList: Action[];

        if (typeof actions === 'function') {
            const actionFunction = actions as ActionFunction;
            const result = actionFunction(answers);
            actionList = Array.isArray(result) ? result : [result];
        } else {
            actionList = actions as Action[];
        }

        // 处理模板路径和内容
        return actionList.map(action => this.processActionTemplate(action, answers));
    }

    private processActionTemplate (action: Action, data: PromptAnswer): Action {
        const processedAction = { ...action };

        // 处理路径模板
        if (action.path) {
            processedAction.path = this.templateEngine.compile(action.path, data);
        }

        // 处理模板内容
        if (action.template) {
            processedAction.template = this.templateEngine.compile(action.template, data);
        }

        return processedAction;
    }

    private async aiEnhanceAnswers (
        answers: PromptAnswer,
        enhancement: AIPromptEnhancement
    ): Promise<PromptAnswer> {
        // TODO: 集成 AI 服务来增强答案
        // 这里可以调用 OpenAI、本地模型等
        console.log('AI enhancement would be applied here');
        return answers;
    }
}