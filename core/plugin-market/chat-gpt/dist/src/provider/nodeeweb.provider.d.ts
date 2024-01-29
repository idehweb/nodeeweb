import { Provider } from './provider.abstract';
declare abstract class NodeewebProvider extends Provider {
    private api;
    constructor(apiKey: string, model?: string);
    abstract getAuthProvider(): string;
    prompt(question: string, model?: string): Promise<{
        answer: any;
        model: any;
    }>;
}
export declare class NodeewebComProvider extends NodeewebProvider {
    getAuthProvider(): string;
}
export declare class NodeewebIrProvider extends NodeewebProvider {
    getAuthProvider(): string;
}
export {};
