// src/core/TemplateEngine.ts
import Handlebars from 'handlebars';
import { registerHelpers } from '../utils/handlebarsHelpers.js';
import type { Answers } from '../types/prompts.js';

export class TemplateEngine {
    private handlebars: typeof Handlebars;

    constructor() {
        this.handlebars = Handlebars.create();
        registerHelpers(this.handlebars);
    }

    compile (template: string, data: Answers): string {
        try {
            const compiledTemplate = this.handlebars.compile(template);
            return compiledTemplate(data);
        } catch (error) {
            throw new Error(`Template compilation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    registerHelper (name: string, helper: Handlebars.HelperDelegate): void {
        this.handlebars.registerHelper(name, helper);
    }

    registerPartial (name: string, partial: string): void {
        this.handlebars.registerPartial(name, partial);
    }
}