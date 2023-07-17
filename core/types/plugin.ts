export enum PluginType {
  SMS = 'sms',
}
export enum SMSPluginType {
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
export interface PluginContent {
  name: string;
  stack: ((...args: any) => Promise<boolean | any>)[];
}
export interface SMSPluginContent extends PluginContent {
  stack: [(args: SMSPluginArgs) => Promise<boolean | string>];
}

export type Plugin = () => { type: PluginType; content: PluginContent };
