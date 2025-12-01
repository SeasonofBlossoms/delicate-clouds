import OpenAI from "openai";
export class DeepSeekService {
    private DEEPSEEK_API_KEY: string;
    private DEEPSEEK_API_URL: string;
    private SYSTEM_PROMPT: string;
    private client: OpenAI;
    constructor() {
        this.DEEPSEEK_API_KEY = 'sk-5bb769fe5e4a4354bb64c4c18faf048f';
        this.DEEPSEEK_API_URL = 'https://api.deepseek.com'
        this.SYSTEM_PROMPT = `你是一位资深前端开发工程师，专门生成Vue3 + ElementPlus代码。
严格遵循以下规则：
1. 只返回纯净的Vue单文件组件代码
2. 不要任何解释、说明、注释或描述
3. 代码格式必须完整，包含template、script、style三部分
4. 使用Composition API和<script setup>
5. 代码必须可直接运行
6. 如果包含示例数据，请使用有意义的测试数据
7. 不要返回代码块标记(如\`\`\`vue)
8. 代码风格要符合企业级标准
9. 不要添加任何css/less/scss代码
10. 如果用户有特殊要求，必须严格遵守
例如用户要求使用特定组件、布局或功能，必须在代码中体现
`;
        this.client = new OpenAI({
            baseURL: this.DEEPSEEK_API_URL,
            apiKey: this.DEEPSEEK_API_KEY,
        });
    }
    async generateResponse (prompt: string): Promise<string> {
        try {

            const response: any = await this.client.chat.completions.create({
                messages: [{ role: "system", content: this.SYSTEM_PROMPT }, { role: "user", content: prompt }],
                model: "deepseek-chat",
            });
            console.log('response', response.choices[0].message.content);
            return response.choices[0].message.content

        } catch (error: any) {
            throw new Error(`Failed to generate response: ${error}`);
        }


    }
}


