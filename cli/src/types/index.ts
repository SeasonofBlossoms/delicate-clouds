export interface ProjectOptions {
    name: string;
    template: string;
    description?: string;
    author?: string;
    version?: string;
    features: string[];
    useTensorFlow: boolean;
    useTypeScript: boolean;
    packageManager: 'npm' | 'yarn' | 'pnpm';
}

export interface AISuggestion {
    architecture: string[];
    dependencies: string[];
    devDependencies: string[];
    projectStructure: Record<string, any>;
    tensorFlowConfig?: {
        models: string[];
        preprocess: string[];
    };
}

export interface TemplateVariables {
    projectName: string;
    projectDescription: string;
    author: string;
    version: string;
    [key: string]: any;
}

export interface AIConfig {
    provider: 'openai' | 'claude' | 'custom';
    apiKey: string;
    endpoint?: string;
    model?: string;
}