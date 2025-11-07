"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
const chalk_1 = __importDefault(require("chalk"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class Logger {
    static level = LogLevel.INFO;
    static setLevel(level) {
        this.level = level;
    }
    static debug(message, ...args) {
        if (this.level >= LogLevel.DEBUG) {
            console.log(chalk_1.default.gray(`[DEBUG] ${message}`), ...args);
        }
    }
    static info(message, ...args) {
        if (this.level >= LogLevel.INFO) {
            console.log(chalk_1.default.blue(`[INFO] ${message}`), ...args);
        }
    }
    static success(message, ...args) {
        if (this.level >= LogLevel.INFO) {
            console.log(chalk_1.default.green(`[SUCCESS] ${message}`), ...args);
        }
    }
    static warn(message, ...args) {
        if (this.level >= LogLevel.WARN) {
            console.log(chalk_1.default.yellow(`[WARN] ${message}`), ...args);
        }
    }
    static error(message, ...args) {
        if (this.level >= LogLevel.ERROR) {
            console.log(chalk_1.default.red(`[ERROR] ${message}`), ...args);
        }
    }
    static progress(message) {
        if (this.level >= LogLevel.INFO) {
            process.stdout.write(chalk_1.default.cyan(`➤ ${message}... `));
        }
    }
    static progressEnd(success = true) {
        if (this.level >= LogLevel.INFO) {
            console.log(success ? chalk_1.default.green('✓') : chalk_1.default.red('✗'));
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map