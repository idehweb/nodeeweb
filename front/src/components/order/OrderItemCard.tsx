import { dateFormat } from '@/functions/utils';
import { Link } from 'react-router-dom';

/**
 * Renders a card component for displaying order information.
 * @param {Object} props - The component props.
 * @param {Object} props.OrderData - The order data object.
 * @param {Function} props.translator - The translation function.
 * @returns {JSX.Element} The rendered card component.
 */

export default function OrderItemCard({ OrderData, translator }) {
  if (!OrderData) return null;
  return (
    <div className={'the-order mb-3'}>
      <div className={'the-order-purple p-4'}>
        <div className={'the-order-title'}>
          <div className={'the-order-number'}>
            {translator('Order #') + OrderData._id}
          </div>
          <div className={'the-order-status '}>
            <Link className={'gfdsdf'} to={'/order-details/' + OrderData._id}>
              {translator('view items')}
            </Link>
          </div>
        </div>
        <div className={'the-order-body'}>
          <div className={'the-order-body-line'}>
            {translator('Order Date')}:
            {dateFormat(OrderData.createdAt).toLocaleString()}
          </div>
          <div className={'the-order-body-line'}>
            {translator('Order Status')}:
            <span className={'gfdsdf'}>{translator(OrderData.status)}</span>
          </div>
          {OrderData.totalPrice && (
            <div className={'the-order-body-line'}>
              {translator('Total Price')}:{' '}
              {OrderData.totalPrice.toLocaleString()}{' '}
              {translator(OrderData.currency)}
            </div>
          )}

          {OrderData.post && (
            <div className={'the-order-body-line'}>
              {translator('Delivery Time')}: {OrderData.post.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
