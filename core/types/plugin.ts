export enum CorePluginType {
  SMS = 'sms',
}
export enum SMSPluginType {
  Automatic = 'automatic',
  Manual = 'manual',
}
export type SMSPluginArgs = {
  to: string;
  pattern?: {
    id: string;
    values: string[];
  };
  text?: string;
  type: SMSPluginType;
  subType?: string;
};
export type SMSPluginResponse = Promise<{
  from: string;
  at: Date;
  status: SmsSendStatus;
  message?: string;
}>;

export type SMSPluginSendBulkArgs = {
  pattern?: {
    id: string;
    values: string[];
  };
  type: SMSPluginType;
  subType?: string;
  content: { to: string; text: string }[];
};

export interface PluginContent {
  name: string;
  stack: ((...args: any) => Promise<boolean | any>)[];
}
export interface SMSPluginContent extends PluginContent {
  stack: [
    (args: SMSPluginArgs) => SMSPluginResponse,
    (args: SMSPluginSendBulkArgs) => SMSPluginResponse
  ];
}

export type PluginOut = {
  type: CorePluginType | string;
  content: PluginContent;
};

export type Plugin = () => PluginOut;

export enum SmsSendStatus {
  Send_Processing = 'send_processing',
  Send_Failed = 'send_failed',
  Send_Before = 'send_before',
  Send_Success = 'send_success',
}
