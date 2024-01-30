import { Provider } from './provider.abstract';
import OpenAI from 'openai';

export class OpenAIProvider extends Provider {
  private api: OpenAI;
  constructor(apiKey: string, model?: string) {
    super(apiKey, model);
    this.api = new OpenAI({
      apiKey,
    });
  }

  async prompt(
    question: string,
    model?: string
  ): Promise<{ answer: string; model: string }> {
    if (model === 'gpt4') model = 'gpt-4';
    if (model === 'gpt3') model = 'gpt-3.5-turbo';
    const response = await this.api.chat.completions.create({
      model: model ?? 'gpt-4',
      messages: [
        {
          role: 'user',
          content: question,
        },
      ],
    });

    return {
      answer: response.choices[0].message.content,
      model: response.model,
    };
  }
}
