// src/core/ActionExecutor.ts
import fs from 'fs-extra';
import path from 'path';
import type { Action, ActionResult, AddAction, ModifyAction, AppendAction } from '../types/actions.js'; // 确保从正确的路径导入
import type { Answers } from '../types/prompts.js';

export class ActionExecutor {
    async executeActions (actions: Action[], answers: Answers): Promise<ActionResult[]> {
        const results: ActionResult[] = [];

        for (const action of actions) {
            // 检查是否跳过该 action
            if (action.skip && action.skip(answers)) {
                results.push({
                    action,
                    success: true,
                    result: 'skipped'
                });
                continue;
            }

            try {
                const result = await this.executeAction(action, answers);
                results.push({
                    action,
                    success: true,
                    result
                });
            } catch (error) {
                results.push({
                    action,
                    success: false,
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        }

        return results;
    }

    private async executeAction (action: Action, answers: Answers): Promise<any> {
        switch (action.type) {
            case 'add':
                return await this.addFile(action, answers);
            case 'modify':
                return await this.modifyFile(action, answers);
            case 'append':
                return await this.appendToFile(action, answers);
            default:
                throw new Error(`Unknown action type: ${action}`);
        }
    }

    private async addFile (action: Action, answers: Answers): Promise<{ filePath: string; action: string }> {
        if (!action.path) {
            throw new Error('Path is required for add action');
        }

        const filePath = path.resolve(process.cwd(), action.path);

        // 确保目录存在
        await fs.ensureDir(path.dirname(filePath));

        // 检查文件是否已存在
        const fileExists = await fs.pathExists(filePath);

        if (fileExists && !(action as AddAction).force) {
            throw new Error(`File already exists: ${filePath}. Use force option to overwrite.`);
        }

        // 写入文件
        const content = action.template || '';
        await fs.writeFile(filePath, content, 'utf8');

        return { filePath, action: fileExists ? 'overwritten' : 'created' };
    }

    private async modifyFile (action: Action, answers: Answers): Promise<{ filePath: string; changes: number }> {
        if (!action.path) {
            throw new Error('Path is required for modify action');
        }

        const filePath = path.resolve(process.cwd(), action.path);
        const fileExists = await fs.pathExists(filePath);

        if (!fileExists) {
            throw new Error(`File not found: ${filePath}`);
        }

        const content = await fs.readFile(filePath, 'utf8');

        if (action.template) {
            // 直接替换整个文件内容
            await fs.writeFile(filePath, action.template, 'utf8');
            return { filePath, changes: 1 };
        } else if ((action as ModifyAction).pattern && action.template) {
            // 使用正则表达式替换
            const pattern = (action as ModifyAction).pattern as RegExp;
            const newContent = content.replace(pattern, action.template);
            await fs.writeFile(filePath, newContent, 'utf8');
            return { filePath, changes: content !== newContent ? 1 : 0 };
        }

        throw new Error('Modify action requires either template or pattern with template');
    }

    private async appendToFile (action: Action, answers: Answers): Promise<{ filePath: string; appended: boolean }> {
        if (!action.path || !action.template) {
            throw new Error('Path and template are required for append action');
        }

        const filePath = path.resolve(process.cwd(), action.path);
        const separator = (action as AppendAction).separator || '\n';

        let existingContent = '';
        if (await fs.pathExists(filePath)) {
            existingContent = await fs.readFile(filePath, 'utf8');
        } else {
            await fs.ensureDir(path.dirname(filePath));
        }

        const newContent = existingContent
            ? `${existingContent}${separator}${action.template}`
            : action.template;

        await fs.writeFile(filePath, newContent, 'utf8');
        return { filePath, appended: true };
    }
}