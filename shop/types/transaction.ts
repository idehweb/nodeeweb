import {
  TransactionDocument,
  TransactionStatus,
} from '../schema/transaction.schema';
import { PaymentVerifyStatus } from './order';

export type HandlePaymentArgs = {
  transaction: TransactionDocument | null;
  successAction?: boolean;
  failedAction?: boolean;
  forceSuccessAction?: boolean;
  forceFailedAction?: boolean;
  extraFields?: any;
  statusWithoutVerify?: PaymentVerifyStatus | TransactionStatus;
  sendSuccessSMS?: boolean;
  statusWithVerify?: PaymentVerifyStatus | TransactionStatus;
};
