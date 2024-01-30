export abstract class Provider {
  constructor(protected apiKey: string, protected model?: string) {}
  abstract prompt(
    question: string,
    model?: string
  ): Promise<{ answer: string; model: string }>;
}
