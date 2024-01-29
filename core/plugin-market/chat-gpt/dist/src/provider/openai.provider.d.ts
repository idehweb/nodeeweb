import { Provider } from './provider.abstract';
export declare class OpenAIProvider extends Provider {
    private api;
    constructor(apiKey: string, model?: string);
    prompt(question: string, model?: string): Promise<{
        answer: string;
        model: string;
    }>;
}
