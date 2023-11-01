import { Document, Model, Types } from 'mongoose';

export interface StoreTemplate {
  elements: any[];
  maxWidth: string;
  backgroundColor: string;
  classes: string;
  showInDesktop: boolean;
  showInMobile: boolean;
  padding: string;
}

export interface ITemplate {
  title?: string;
  type: string;
  maxWidth?: string;
  data?: any[];
  elements?: any[];
  classes?: string;
  padding?: string;
  backgroundColor?: string;
  showInDesktop?: boolean;
  showInMobile?: boolean;
}

export type TemplateModel = Model<ITemplate>;

export type TemplateDocument = Document<Types.ObjectId, {}, ITemplate> &
  ITemplate;
