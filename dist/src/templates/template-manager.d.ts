export interface GenerateOptions {
    installDependencies?: boolean;
    packageManager?: 'npm' | 'yarn' | 'pnpm';
}
export interface TemplateConfig {
    name: string;
    description: string;
    type: 'react' | 'vue' | 'tensorflow' | 'custom';
    path: string;
    variables?: Record<string, any>;
    hooks?: {
        preGenerate?: () => Promise<void>;
        postGenerate?: () => Promise<void>;
    };
}
export declare class TemplateManager {
    private templates;
    private generators;
    constructor();
    private initializeGenerators;
    private loadTemplates;
    private loadBuiltInTemplates;
    private loadCustomTemplates;
    registerCustomTemplate(templateConfig: TemplateConfig): Promise<void>;
    getAvailableTemplates(): TemplateConfig[];
    getTemplate(name: string): TemplateConfig | undefined;
    generateTemplate(templateName: string, targetPath: string, variables?: Record<string, any>, options?: GenerateOptions): Promise<void>;
    private installDependencies;
    private saveCustomTemplates;
}
//# sourceMappingURL=template-manager.d.ts.map