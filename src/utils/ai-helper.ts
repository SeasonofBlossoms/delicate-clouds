import axios from 'axios';
import { Logger } from './logger';

export class AIHelper {
    private static apiKey: string | undefined;
    static buildCodeGenerationPrompt: any;

    static initialize (apiKey: string): void {
        this.apiKey = apiKey;
    }

    static async analyzeProjectRequirements (
        projectName: string,
        templateType: string,
        baseVariables: Record<string, any>
    ): Promise<Record<string, any>> {
        if (!this.apiKey) {
            throw new Error('AI服务未初始化，请设置API Key');
        }

        const prompt = this.buildAnalysisPrompt(projectName, templateType, baseVariables);

        try {
            // 调用AI API (例如 OpenAI, 国内可以使用百度文心一言等)
            const response = await this.callAIService(prompt);
            return this.parseAIResponse(response);
        } catch (error) {
            Logger.error('调用AI服务失败:', error);
            throw error;
        }
    }

    static async generateAICode (
        description: string,
        context: any
    ): Promise<string> {
        const prompt = this.buildCodeGenerationPrompt(description, context);

        const response = await this.callAIService(prompt);
        return this.extractCodeFromResponse(response);
    }

    private static buildAnalysisPrompt (
        projectName: string,
        templateType: string,
        variables: Record<string, any>
    ): string {
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

    private static async callAIService (prompt: string): Promise<any> {
        // 这里可以实现调用具体的AI服务
        // 例如 OpenAI GPT, 文心一言, 通义千问等

        // 示例实现 (使用OpenAI API)
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content;
    }

    private static parseAIResponse (response: string): Record<string, any> {
        try {
            // 尝试从AI响应中提取JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return {};
        } catch (error) {
            Logger.warn('解析AI响应失败，返回空配置');
            return {};
        }
    }

    private static extractCodeFromResponse (response: string): string {
        // 从AI响应中提取代码块
        const codeMatch = response.match(/```(?:javascript|typescript)?\n([\s\S]*?)\n```/);
        return codeMatch ? codeMatch[1] : response;
    }
}