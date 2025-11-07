import { TemplateConfig } from '../template-manager';
export declare abstract class BaseGenerator {
    abstract type: string;
    generate(template: TemplateConfig, targetPath: string, variables: Record<string, any>): Promise<void>;
    protected copyTemplateFiles(sourcePath: string, targetPath: string, variables: Record<string, any>): Promise<void>;
    protected processTemplateFile(sourceFile: string, targetFile: string, variables: Record<string, any>): Promise<void>;
    protected abstract generateProjectSpecific(targetPath: string, variables: Record<string, any>): Promise<void>;
}
//# sourceMappingURL=base-generator.d.ts.map