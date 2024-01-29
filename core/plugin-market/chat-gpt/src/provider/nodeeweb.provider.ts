import axios, { AxiosInstance } from 'axios';
import { Provider } from './provider.abstract';
abstract class NodeewebProvider extends Provider {
  private api: AxiosInstance;
  constructor(apiKey: string, model?: string) {
    super(apiKey, model);
    this.api = axios.create({
      //   baseURL: 'https://chat.nodeeweb.com',
      baseURL: 'http://185.110.190.242:2730',
      headers: {
        'X-Auth-From': this.getAuthProvider(),
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
  }
  abstract getAuthProvider(): string;
  async prompt(question: string, model?: string) {
    const {
      data: { data },
    } = await this.api.post('/gpt', { q: question, model });
    return { answer: data.answer, model: data.model };
  }
}

export class NodeewebComProvider extends NodeewebProvider {
  getAuthProvider() {
    return 'nodeeweb.com';
  }
}
export class NodeewebIrProvider extends NodeewebProvider {
  getAuthProvider() {
    return 'nodeeweb.ir';
  }
}
