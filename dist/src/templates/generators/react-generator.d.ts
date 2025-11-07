import { BaseGenerator } from './base-generator';
export declare class ReactGenerator extends BaseGenerator {
    type: string;
    protected generateProjectSpecific(targetPath: string, variables: Record<string, any>): Promise<void>;
    installDependencies(targetPath: string): Promise<void>;
}
//# sourceMappingURL=react-generator.d.ts.map