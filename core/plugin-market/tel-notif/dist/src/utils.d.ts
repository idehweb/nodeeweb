export declare function call<A extends Array<any>, R>(fn: (...args: A) => R | Promise<R>, ...args: A): Promise<R>;
