"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIHelper = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("./logger");
class AIHelper {
    static apiKey;
    static buildCodeGenerationPrompt;
    static initialize(apiKey) {
        this.apiKey = apiKey;
    }
    static async analyzeProjectRequirements(projectName, templateType, baseVariables) {
        if (!this.apiKey) {
            throw new Error('AI服务未初始化，请设置API Key');
        }
        const prompt = this.buildAnalysisPrompt(projectName, templateType, baseVariables);
        try {
            // 调用AI API (例如 OpenAI, 国内可以使用百度文心一言等)
            const response = await this.callAIService(prompt);
            return this.parseAIResponse(response);
        }
        catch (error) {
            logger_1.Logger.error('调用AI服务失败:', error);
            throw error;
        }
    }
    static async generateAICode(description, context) {
        const prompt = this.buildCodeGenerationPrompt(description, context);
        const response = await this.callAIService(prompt);
        return this.extractCodeFromResponse(response);
    }
    static buildAnalysisPrompt(projectName, templateType, variables) {
        return `
作为前端架构专家，请分析以下项目需求并提供技术建议：

项目名称: ${projectName}
模板类型: ${templateType}
基础配置: ${JSON.stringify(variables, null, 2)}

请以JSON格式返回建议，包括：
1. 推荐的技术栈增强
2. 建议的项目结构
3. 推荐的依赖包
4. TensorFlow.js集成方案（如适用）
5. 性能优化建议

请确保响应是纯JSON格式，便于程序解析。
    `;
    }
    static async callAIService(prompt) {
        // 这里可以实现调用具体的AI服务
        // 例如 OpenAI GPT, 文心一言, 通义千问等
        // 示例实现 (使用OpenAI API)
        const response = await axios_1.default.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.choices[0].message.content;
    }
    static parseAIResponse(response) {
        try {
            // 尝试从AI响应中提取JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return {};
        }
        catch (error) {
            logger_1.Logger.warn('解析AI响应失败，返回空配置');
            return {};
        }
    }
    static extractCodeFromResponse(response) {
        // 从AI响应中提取代码块
        const codeMatch = response.match(/```(?:javascript|typescript)?\n([\s\S]*?)\n```/);
        return codeMatch ? codeMatch[1] : response;
    }
}
exports.AIHelper = AIHelper;
//# sourceMappingURL=ai-helper.js.map