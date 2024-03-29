export interface PluginContent {
    slug: string;
    type: string;
    name: string;
    stack: ((...args: any) => Promise<boolean | any>)[];
}
export declare enum PaymentVerifyStatus {
    Paid = 1,
    CheckBefore = 2,
    Failed = -1
}
export declare enum ShopPluginType {
    BANK_GATEWAY = "bank-gateway",
    POST_GATEWAY = "post-gateway"
}
export type BankGatewayCreateArgs = {
    amount: number;
    userPhone: string;
    callback_url: string;
    description: string;
    currency: string;
};
export type BankGatewayCreateOut = {
    isOk: false;
    message: string;
} | {
    isOk: true;
    authority: string;
    payment_link: string;
    expiredAt: Date;
    payment_message?: string;
    payment_method?: string;
    payment_headers?: {
        [key: string]: string;
    };
    payment_body?: any;
};
export type BankGatewayVerifyArgs = {
    authority: string;
    amount: number;
    status: string;
} & {
    [key: string]: any;
};
export type BankGatewayVerify = (args: BankGatewayVerifyArgs) => Promise<{
    status: PaymentVerifyStatus;
    message?: string;
}>;
export type BankGatewayUnverified = () => Promise<Partial<BankGatewayVerifyArgs>[]>;
export interface BankGatewayPluginContent extends PluginContent {
    stack: [
        (args: BankGatewayCreateArgs) => Promise<BankGatewayCreateOut>,
        BankGatewayVerify,
        BankGatewayUnverified
    ];
}
