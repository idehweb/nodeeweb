export declare abstract class Provider {
    protected apiKey: string;
    protected model?: string;
    constructor(apiKey: string, model?: string);
    abstract prompt(question: string, model?: string): Promise<{
        answer: string;
        model: string;
    }>;
}
