import { ViewContent } from '@nodeeweb/core/types/view';
import { registerAdminView } from '@nodeeweb/core/src/handlers/view.handler';
const adminView: ViewContent = {
  list: {
    header: [
      { name: 'message', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'phone', type: 'number' },
      { name: 'from', type: 'string' },
      { name: 'createdAt', type: 'string' },
      { name: 'customer', type: 'string' },
      { name: 'actions', type: 'actions', edit: true },
    ],
  },
  create: {
    fields: [
      { name: 'name', type: 'object' },
      { name: 'slug', type: 'string' },
      { name: 'image', type: 'string' },
      { name: 'order', type: 'number' },
      { name: 'kind', type: 'string' },
      { name: 'link', type: 'string' },
      { name: 'icon', type: 'string' },
      { name: 'data', type: 'object' },
    ],
  },
};

export default function registerView() {
  registerAdminView(
    { content: adminView, name: 'notification' },
    { from: 'ShopEntity' }
  );
}
