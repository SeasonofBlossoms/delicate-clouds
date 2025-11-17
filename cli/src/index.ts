#!/usr/bin/env node

import { Command } from 'commander';
import { GenerateCommand } from './commands/GenerateCommand.js';
import { InteractiveCommand } from './commands/InteractiveCommand.js';
import chalk from 'chalk';

const program = new Command();

program
    .name('dc-cli')
    .description('Delicate Clouds CLI - AI-enhanced code generator')
    .version('1.0.0', '-v, --version', 'Output the current version')
    .helpOption('-h, --help', 'Display help for command');

// 添加生成命令
const generateCommand = new GenerateCommand();
program.addCommand(generateCommand.createCommand());

// 添加交互命令
const interactiveCommand = new InteractiveCommand();
program.addCommand(interactiveCommand.createCommand());

// 默认命令显示帮助
program.action(() => {
    program.outputHelp();
});

// 错误处理
program.showHelpAfterError('(add --help for additional information)');
program.showSuggestionAfterError();

// 解析命令行参数
program.parseAsync(process.argv).catch((error) => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
});