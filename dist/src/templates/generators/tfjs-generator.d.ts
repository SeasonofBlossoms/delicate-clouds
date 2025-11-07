import { BaseGenerator } from './base-generator';
export declare class TFJSGenerator extends BaseGenerator {
    type: string;
    protected generateProjectSpecific(targetPath: string, variables: Record<string, any>): Promise<void>;
    private generateAIModelConfig;
}
//# sourceMappingURL=tfjs-generator.d.ts.map