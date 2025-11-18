// src/core/GeneratorRegistry.ts
import type { GeneratorConfig, GeneratorResult } from '../types/generator.js';
import type { Answers } from '../types/prompts.js';
import type { ActionResult } from '../types/actions.js'; // 确保从正确的路径导入
import { InteractivePrompter } from './InteractivePrompter.js';
import { ActionExecutor } from './ActionExecutor.js';

export class GeneratorRegistry {
    private generators: Map<string, GeneratorConfig> = new Map();
    private prompter: InteractivePrompter;
    private actionExecutor: ActionExecutor;

    constructor() {
        this.prompter = new InteractivePrompter();
        this.actionExecutor = new ActionExecutor();
    }

    registerGenerator (name: string, config: GeneratorConfig): void {
        this.generators.set(name, config);
    }

    getGenerator (name: string): GeneratorConfig | undefined {
        return this.generators.get(name);
    }

    listGenerators (): Array<{ name: string; description: string }> {
        return Array.from(this.generators.entries()).map(([name, config]) => ({
            name,
            description: config.description
        }));
    }

    async runGenerator (name: string, initialData: Answers = {}): Promise<GeneratorResult> {
        const generator = this.generators.get(name);

        if (!generator) {
            throw new Error(`Generator "${name}" not found`);
        }

        // 执行前置钩子
        if (generator.hooks?.preAction) {
            await generator.hooks.preAction(initialData);
        }

        // 执行交互式提问
        const answers = await this.prompter.prompt(
            generator.prompts,
            initialData,
            generator.aiEnhancement
        );

        // 准备 actions
        const actions = await this.prompter.prepareActions(generator.actions, answers);

        // 执行 actions
        const actionResults: ActionResult[] = await this.actionExecutor.executeActions(actions, answers);

        // 执行后置钩子
        if (generator.hooks?.postAction) {
            await generator.hooks.postAction(answers, actionResults);
        }

        return {
            generator: name,
            answers,
            actions: actionResults
        };
    }
}