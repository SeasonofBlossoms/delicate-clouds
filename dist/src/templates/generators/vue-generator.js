"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueGenerator = void 0;
const base_generator_1 = require("./base-generator");
const npm_1 = require("../../utils/npm");
const logger_1 = require("../../utils/logger");
class VueGenerator extends base_generator_1.BaseGenerator {
    type = 'vue';
    async generateProjectSpecific(targetPath) {
        // 安装Vue依赖
        const dependencies = [
            'vue'
        ];
        const devDependencies = [
            '@vitejs/plugin-vue',
            'vite',
            'typescript',
            // ... 其他依赖
        ];
        logger_1.Logger.info('安装Vue依赖...');
        await npm_1.NpmUtil.installDependencies(targetPath, dependencies, false);
        await npm_1.NpmUtil.installDependencies(targetPath, devDependencies, true);
    }
}
exports.VueGenerator = VueGenerator;
//# sourceMappingURL=vue-generator.js.map