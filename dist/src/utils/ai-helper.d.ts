export declare class AIHelper {
    private static apiKey;
    static buildCodeGenerationPrompt: any;
    static initialize(apiKey: string): void;
    static analyzeProjectRequirements(projectName: string, templateType: string, baseVariables: Record<string, any>): Promise<Record<string, any>>;
    static generateAICode(description: string, context: any): Promise<string>;
    private static buildAnalysisPrompt;
    private static callAIService;
    private static parseAIResponse;
    private static extractCodeFromResponse;
}
//# sourceMappingURL=ai-helper.d.ts.map