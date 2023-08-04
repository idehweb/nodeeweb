import { ViewContent } from '@nodeeweb/core/types/view';
import { registerAdminView } from '@nodeeweb/core/src/handlers/view.handler';
const adminView: ViewContent = {
  list: {
    header: [
      { name: 'url', type: 'string' },
      { name: 'createdAt', type: 'string' },
      { name: 'updatedAt', type: 'string' },
      { name: 'actions', type: 'actions', edit: true },
    ],
  },
  create: {
    fields: [
      { name: 'url', type: 'string' },
      { name: 'type', type: 'string' },
    ],
  },
};

export default function registerView() {
  registerAdminView(
    { content: adminView, name: 'files' },
    { from: 'ShopEntity' }
  );
}
