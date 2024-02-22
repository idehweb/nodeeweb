import { IConfig, Logger } from '../type';
export declare class NotifLogger implements Logger {
    private resolve;
    constructor(resolve: IConfig['resolve']);
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
}
