import { Expose } from 'class-transformer';
import { OrderStatus } from '../../../schema/order.schema';
import { IsIn, IsString } from 'class-validator';

export class UpdateOrderBody {
  @Expose()
  @IsIn([
    OrderStatus.Paid,
    OrderStatus.Posting,
    OrderStatus.Completed,
    OrderStatus.Canceled,
  ])
  status: OrderStatus;
}

export class OrderIdParam {
  @Expose()
  @IsString()
  order: string;
}
