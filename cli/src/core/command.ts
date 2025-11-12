import { Command } from 'commander';
import { GenerateCommand } from '../commands/generate.js';
import { InitCommand } from '../commands/init.js';
import { TensorFlowCommand } from '../commands/tensorflow.js';
import { TemplateCommand } from '../commands/template.js';
import { Logger } from '../utils/logger.js';

export class CommandManager {
    private commands: any[] = [];

    constructor() {
        this.initializeCommands();
    }

    private initializeCommands (): void {
        this.commands = [
            new GenerateCommand(),
            new InitCommand(),
            new TensorFlowCommand(),
            new TemplateCommand()
        ];
    }

    registerCommands (program: Command): void {
        this.commands.forEach(command => {
            try {
                command.register(program);
            } catch (error) {
                Logger.error(`注册命令失败: ${command.constructor.name}`, error);
            }
        });
    }
}