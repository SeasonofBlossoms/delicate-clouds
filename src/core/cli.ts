#!/usr/bin/env node

import { Command } from 'commander';
import { GenerateCommand } from '../commands/generate';
import { Logger } from '../utils/logger';

class FECLI {
    private program: Command;

    constructor() {
        this.program = new Command();
        this.setupCLI();
    }

    private setupCLI (): void {
        this.program
            .name('fe-cli')
            .description('现代化前端CLI工具，支持AI和TensorFlow.js')
            .version('1.0.0');

        // 注册命令
        const generateCommand = new GenerateCommand();
        generateCommand.register(this.program);

        // 添加默认帮助显示
        this.program.addHelpText('after', `
示例:
  $ fe-cli generate my-app
  $ fe-cli generate my-app --template react-ts
  $ fe-cli --version
    `);
    }

    async run (): Promise<void> {
        try {
            console.log('🔧 FECLI.run() 方法开始执行');
            console.log('📋 命令行参数:', process.argv);

            // 如果没有提供命令，显示帮助
            if (process.argv.length <= 2) {
                console.log('ℹ️  没有提供命令，显示帮助信息');
                this.program.outputHelp();
                return;
            }

            console.log('🚀 开始解析命令...');
            await this.program.parseAsync(process.argv);
            console.log('✅ 命令解析完成');

        } catch (error) {
            Logger.error('命令执行失败:', error);
            process.exit(1);
        }
    }
}

// 创建实例并运行
console.log('🎯 开始创建 FECLI 实例...');
const cli = new FECLI();
console.log('✅ FECLI 实例创建成功');

console.log('🚀 开始执行 run() 方法...');
cli.run().then(() => {
    console.log('🏁 CLI 执行完成');
}).catch(error => {
    console.error('❌ CLI 执行失败:', error);
    process.exit(1);
});