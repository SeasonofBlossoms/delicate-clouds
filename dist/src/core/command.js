"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const generate_1 = require("../commands/generate");
const init_1 = require("../commands/init");
const ai_1 = require("../commands/ai");
const tensorflow_1 = require("../commands/tensorflow");
const template_1 = require("../commands/template");
const logger_1 = require("../utils/logger");
class CommandManager {
    commands = [];
    constructor() {
        this.initializeCommands();
    }
    initializeCommands() {
        this.commands = [
            new generate_1.GenerateCommand(),
            new init_1.InitCommand(),
            new ai_1.AICommand(),
            new tensorflow_1.TensorFlowCommand(),
            new template_1.TemplateCommand()
        ];
    }
    registerCommands(program) {
        this.commands.forEach(command => {
            try {
                command.register(program);
            }
            catch (error) {
                logger_1.Logger.error(`注册命令失败: ${command.constructor.name}`, error);
            }
        });
    }
}
exports.CommandManager = CommandManager;
//# sourceMappingURL=command.js.map