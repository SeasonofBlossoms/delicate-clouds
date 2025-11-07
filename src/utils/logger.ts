import chalk from 'chalk';

export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3
}

export class Logger {
    private static level: LogLevel = LogLevel.INFO;

    static setLevel (level: LogLevel): void {
        this.level = level;
    }

    static debug (message: string, ...args: any[]): void {
        if (this.level >= LogLevel.DEBUG) {
            console.log(chalk.gray(`[DEBUG] ${message}`), ...args);
        }
    }

    static info (message: string, ...args: any[]): void {
        if (this.level >= LogLevel.INFO) {
            console.log(chalk.blue(`[INFO] ${message}`), ...args);
        }
    }

    static success (message: string, ...args: any[]): void {
        if (this.level >= LogLevel.INFO) {
            console.log(chalk.green(`[SUCCESS] ${message}`), ...args);
        }
    }

    static warn (message: string, ...args: any[]): void {
        if (this.level >= LogLevel.WARN) {
            console.log(chalk.yellow(`[WARN] ${message}`), ...args);
        }
    }

    static error (message: string, ...args: any[]): void {
        if (this.level >= LogLevel.ERROR) {
            console.log(chalk.red(`[ERROR] ${message}`), ...args);
        }
    }

    static progress (message: string): void {
        if (this.level >= LogLevel.INFO) {
            process.stdout.write(chalk.cyan(`➤ ${message}... `));
        }
    }

    static progressEnd (success: boolean = true): void {
        if (this.level >= LogLevel.INFO) {
            console.log(success ? chalk.green('✓') : chalk.red('✗'));
        }
    }
}