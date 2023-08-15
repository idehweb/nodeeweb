import { ViewContent } from '@nodeeweb/core/types/view';
import { registerAdminView } from '@nodeeweb/core/src/handlers/view.handler';
const adminView: ViewContent = {
  list: {
    header: [
      { name: 'trackingCode', type: 'string' },
      { name: 'form', type: 'reference', reference: 'Form' },
      { name: 'updatedAt', type: 'date' },
      { name: 'actions', type: 'actions', edit: true, delete: true },
    ],
  },
  create: {
    fields: [{ name: 'title', type: 'string' }],
  },
  edit: {
    fields: [
      { name: 'statusCode', type: 'string' },
      { name: 'amount', type: 'string' },
      { name: 'Authority', type: 'string' },
      { name: 'createdAt', type: 'date' },
      { name: 'updatedAt', type: 'date' },
    ],
  },
};

export default function registerView() {
  registerAdminView(
    { content: adminView, name: 'entry' },
    { from: 'ShopEntity' }
  );
}
