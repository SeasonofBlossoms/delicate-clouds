import { Command } from 'commander';
import { GenerateCommand } from '../commands/generate';
import { InitCommand } from '../commands/init';
import { AICommand } from '../commands/ai';
import { TensorFlowCommand } from '../commands/tensorflow';
import { TemplateCommand } from '../commands/template';
import { Logger } from '../utils/logger';

export class CommandManager {
    private commands: any[] = [];

    constructor() {
        this.initializeCommands();
    }

    private initializeCommands (): void {
        this.commands = [
            new GenerateCommand(),
            new InitCommand(),
            new AICommand(),
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