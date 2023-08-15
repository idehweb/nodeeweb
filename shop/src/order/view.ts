import { ViewContent } from '@nodeeweb/core/types/view';
import { registerAdminView } from '@nodeeweb/core/src/handlers/view.handler';
const adminView: ViewContent = {
  list: {
    header: [
      { name: 'orderNumber', type: 'number' },
      {
        name: 'customer_data',
        type: 'object',
        keys: ['firstName', 'lastName', 'phone'],
      },
      { name: 'sum', type: 'price' },
      { name: 'amount', type: 'price' },
      { name: 'status', type: 'number' },
      { name: 'paymentStatus', type: 'number' },
      { name: 'createdAt', type: 'date' },
      { name: 'updatedAt', type: 'date' },
      { name: 'actions', type: 'actions', edit: true },
    ],
  },
  create: {
    fields: [{ name: 'title', type: 'string' }],
  },
};

export default function registerView() {
  registerAdminView(
    { content: adminView, name: 'order' },
    { from: 'ShopEntity' }
  );
}
