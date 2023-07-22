export declare enum PluginType {
  SMS = 'sms',
  BANK_GATEWAY = 'bank-gateway',
}
export declare enum SMSPluginType {
  OTP = 'otp',
  Reg = 'regular',
}
export type SMSPluginArgs = {
  to: string;
  pattern?: {
    id: string;
    values: string[];
  };
  text?: string;
  type: SMSPluginType;
};
export type BankGatewayCreateArgs = {
  amount: number;
  userPhone: string;
  callback_url: string;
  description: string;
  currency: string;
};
export type BankGatewayCreateOut = {
  authority: string;
  payment_link: string;
  expiredAt: Date;
};

export interface PluginContent {
  name: string;
  stack: ((...args: any) => Promise<boolean | any>)[];
}
export interface SMSPluginContent extends PluginContent {
  stack: [(args: SMSPluginArgs) => Promise<boolean | string>];
}
export interface BankGatewayPluginContent extends PluginContent {
  stack: [(args: BankGatewayCreateArgs) => Promise<BankGatewayCreateOut>];
}

export type Plugin = () => {
  type: PluginType;
  content: PluginContent;
};
