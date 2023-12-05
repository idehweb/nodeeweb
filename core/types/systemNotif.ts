export abstract class SystemNotif {
  abstract id: string;
  abstract type: string;
  abstract register(store: any): void | Promise<void>;
  abstract unregister(store: any): void | Promise<void>;
}
