export interface PluginContent {
    slug: string;
    type: string;
    name: string;
    stack: ((...args: any) => Promise<boolean | any>)[];
}
export declare enum Provider {
    NodeewebCom = "nodeeweb-com",
    NodeewebIr = "nodeeweb-ir",
    OpenAI = "openai"
}
export declare enum PluginType {
    CHAT_GPT = "chat-gpt"
}
export type ChatGptPromptArgs = {
    q: string;
    model?: string;
};
export type ChatGptPromptOut = {
    isOk: false;
    message: string;
} | {
    isOk: true;
    message: string;
};
export interface ChatGptPluginContent extends PluginContent {
    stack: [(args: ChatGptPromptArgs) => Promise<ChatGptPromptOut>];
}
