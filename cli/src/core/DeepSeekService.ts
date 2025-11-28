import axios from 'axios';
import OpenAI from "openai";
export class DeepSeekService {
    private DEEPSEEK_API_KEY: string;
    private DEEPSEEK_API_URL: string;
    constructor() {
        this.DEEPSEEK_API_KEY = 'sk-5bb769fe5e4a4354bb64c4c18faf048f';
        this.DEEPSEEK_API_URL = 'https://api.deepseek.com'
    }
    async generateResponse (prompt: string): Promise<string> {
        try {
            /* const response = await axios.post(this.OPENAI_API_URL, {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: 'Hello, how are you?' }],
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
                },
                timeout: 20000, // 设置超时时间
            });
            console.log('response', response);
            return response.data.choices[0].message.content; */
            const openai = new OpenAI({
                baseURL: this.DEEPSEEK_API_URL,
                apiKey: this.DEEPSEEK_API_KEY,
            });
            const response: any = await openai.chat.completions.create({
                messages: [{ role: "system", content: prompt }],
                model: "deepseek-chat",
            });
            console.log(response.choices[0].message.content);
            return response.choices[0].message.content

        } catch (error: any) {
            throw new Error(`Failed to generate response: ${error}`);
        }


    }
}


