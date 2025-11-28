// src/commands/GenerateCommand.ts
import { Command } from 'commander';
import inquirer from 'inquirer'; // 直接导入 inquirer
import { GeneratorRegistry } from '../core/GeneratorRegistry.js';
import { ComponentGenerator, PageGenerator } from '../generators/index.js';
import chalk from 'chalk';

export class GenerateCommand {
    private generatorRegistry: GeneratorRegistry;

    constructor() {
        this.generatorRegistry = new GeneratorRegistry();
        this.setupGenerators();
    }

    private setupGenerators (): void {
        this.generatorRegistry.registerGenerator('component', ComponentGenerator);
        this.generatorRegistry.registerGenerator('page', PageGenerator);
        // 注册更多生成器...
    }

    createCommand (): Command {
        const command = new Command('generate')
            .description('Generate code using predefined templates')
            .argument('[generator]', 'Generator name')
            .option('-i, --interactive', 'Interactive mode')
            .action(async (generatorName: string, options: any) => {
                await this.execute(generatorName, options);
            });

        return command;
    }

    async execute (generatorName?: string, options: any = {}): Promise<void> {
        try {
            if (options.interactive || !generatorName) {
                await this.interactiveMode();
            } else {
                await this.directGenerate(generatorName);
            }
        } catch (error) {
            console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error));
            process.exit(1);
        }
    }

    private async interactiveMode (): Promise<void> {
        const generators = this.generatorRegistry.listGenerators();

        if (generators.length === 0) {
            console.log(chalk.yellow('No generators available.'));
            return;
        }

        const { generator } = await inquirer.prompt([
            {
                type: 'list',
                name: 'generator',
                message: 'Select generator:',
                choices: generators.map(gen => ({
                    name: `${gen.name} - ${gen.description}`,
                    value: gen.name
                }))
            }
        ]);

        await this.directGenerate(generator);
    }

    private async directGenerate (generatorName: string): Promise<void> {
        const result = await this.generatorRegistry.runGenerator(generatorName);

        console.log(chalk.green('✓ Generation completed!'));
        console.log('');

        // 显示生成结果
        result.actions.forEach(actionResult => {
            const status = actionResult.success ? chalk.green('✓') : chalk.red('✗');
            const action = actionResult.action;
            console.log(`${status} ${action.type}: ${action.path}`);

            if (!actionResult.success) {
                console.log(chalk.red(`  Error: ${actionResult.error}`));
            }
        });
    }
}
