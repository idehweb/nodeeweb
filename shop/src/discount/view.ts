import { ViewContent } from '@nodeeweb/core/types/view';
import { registerAdminView } from '@nodeeweb/core/src/handlers/view.handler';
const adminView: ViewContent = {
  list: {
    header: [
      { name: 'name', type: 'multiLang' },
      { name: 'slug', type: 'string' },
      { name: 'price', type: 'number' },
      { name: 'percent', type: 'number' },
      { name: 'count', type: 'number' },
      { name: 'createdAt', type: 'date' },
      { name: 'updatedAt', type: 'date' },
      { name: 'actions', type: 'actions', edit: true, delete: true },
    ],
  },
  create: {
    fields: [
      { name: 'name', type: 'string' },
      { name: 'slug', type: 'string' },
      { name: 'count', type: 'string' },
      { name: 'price', type: 'string' },
      { name: 'createdAt', type: 'date' },
      { name: 'updatedAt', type: 'date' },
    ],
  },
  edit: {
    fields: [
      { name: 'name', type: 'string' },
      { name: 'slug', type: 'string' },
      { name: 'count', type: 'string' },
      { name: 'price', type: 'string' },
      { name: 'createdAt', type: 'date' },
      { name: 'updatedAt', type: 'date' },
    ],
  },
};

export default function registerView() {
  registerAdminView(
    { content: adminView, name: 'discount' },
    { from: 'ShopEntity' }
  );
}
