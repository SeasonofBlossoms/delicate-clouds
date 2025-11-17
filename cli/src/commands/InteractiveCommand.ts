// src/commands/InteractiveCommand.ts
import { Command } from 'commander';
import inquirer from 'inquirer';
import { GeneratorRegistry } from '../core/GeneratorRegistry.js';
import { ComponentGenerator, PageGenerator, StoreGenerator } from '../generators/index.js';
import chalk from 'chalk';

export class InteractiveCommand {
    private generatorRegistry: GeneratorRegistry;

    constructor() {
        this.generatorRegistry = new GeneratorRegistry();
        this.setupGenerators();
    }

    private setupGenerators (): void {
        this.generatorRegistry.registerGenerator('component', ComponentGenerator);
        this.generatorRegistry.registerGenerator('page', PageGenerator);
        this.generatorRegistry.registerGenerator('store', StoreGenerator);
    }

    createCommand (): Command {
        return new Command('interactive')
            .description('Start interactive mode')
            .action(async () => {
                await this.execute();
            });
    }

    async execute (): Promise<void> {
        try {
            console.log(chalk.cyan('🚀 Welcome to Delicate Clouds CLI Interactive Mode!'));
            console.log('');

            while (true) {
                const { action } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'action',
                        message: 'What would you like to do?',
                        choices: [
                            { name: '📦 Generate component', value: 'component' },
                            { name: '📄 Generate page', value: 'page' },
                            { name: '🏪 Generate store', value: 'store' },
                            { name: '📋 List available generators', value: 'list' },
                            { name: '❌ Exit', value: 'exit' }
                        ]
                    }
                ]);

                if (action === 'exit') {
                    console.log(chalk.green('👋 Goodbye!'));
                    break;
                }

                await this.handleAction(action);
                console.log('');
            }
        } catch (error) {
            console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error));
            process.exit(1);
        }
    }

    private async handleAction (action: string): Promise<void> {
        switch (action) {
            case 'component':
            case 'page':
            case 'store':
                await this.generateCode(action);
                break;
            case 'list':
                await this.listGenerators();
                break;
        }
    }

    private async generateCode (generatorName: string): Promise<void> {
        try {
            console.log(chalk.blue(`\n📝 Generating ${generatorName}...`));

            const result = await this.generatorRegistry.runGenerator(generatorName);

            console.log(chalk.green('✅ Generation completed!'));

            // 显示生成结果摘要
            const successfulActions = result.actions.filter(action => action.success);
            const failedActions = result.actions.filter(action => !action.success);

            console.log(`📊 Generated ${successfulActions.length} files`);

            if (failedActions.length > 0) {
                console.log(chalk.yellow(`⚠️  ${failedActions.length} actions failed`));
                failedActions.forEach(action => {
                    console.log(chalk.red(`   - ${action.action.path}: ${action.error}`));
                });
            }

            // 显示生成的文件列表
            successfulActions.forEach(actionResult => {
                const action = actionResult.action;
                console.log(chalk.green(`   ✓ ${action.path}`));
            });

        } catch (error) {
            console.error(chalk.red(`❌ Failed to generate ${generatorName}:`), error instanceof Error ? error.message : String(error));
        }
    }

    private async listGenerators (): Promise<void> {
        const generators = this.generatorRegistry.listGenerators();

        console.log(chalk.blue('\n📋 Available Generators:'));
        console.log('');

        generators.forEach(generator => {
            console.log(`   ${chalk.cyan(generator.name)} - ${generator.description}`);
        });

        console.log('');
    }
}