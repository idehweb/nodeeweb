import { ViewContent } from '@nodeeweb/core/types/view';
import { registerAdminView } from '@nodeeweb/core/src/handlers/view.handler';
const adminView: ViewContent = {
  list: {
    header: [
      { name: 'thumbnail', type: 'image' },
      { name: 'title', type: 'multiLang' },
      { name: 'active', type: 'boolean' },
      { name: 'createdAt', type: 'date' },
      { name: 'updatedAt', type: 'date' },
      { name: 'actions', type: 'actions', edit: true, delete: true },
    ],
  },
  create: {
    fields: [
      {
        name: 'title',
        type: 'object',
        kind: 'multiLang',
        size: { lg: 12, sm: 12 },
      },
      { name: 'slug', type: 'string', size: { lg: 6, sm: 12 } },
      {
        name: 'description',
        type: 'object',
        kind: 'multiLang',
        size: { lg: 12, sm: 12 },
      },
      { name: 'data', type: 'object' },
      { name: 'request', type: 'string' },
      { name: 'verify', type: 'string' },
      { name: 'active', type: 'boolean', size: { lg: 12, sm: 12 } },
    ],
  },
  edit: {
    fields: [
      {
        name: 'title',
        type: 'object',
        kind: 'multiLang',
        size: { lg: 12, sm: 12 },
      },
      { name: 'slug', type: 'string', size: { lg: 6, sm: 12 } },
      {
        name: 'description',
        type: 'object',
        kind: 'multiLang',
        size: { lg: 12, sm: 12 },
      },
      { name: 'data', type: 'object' },
      { name: 'request', type: 'string' },
      { name: 'verify', type: 'string' },
      { name: 'active', type: 'boolean', size: { lg: 12, sm: 12 } },
    ],
  },
};

export default function registerView() {
  registerAdminView(
    { content: adminView, name: 'gateway' },
    { from: 'ShopEntity' }
  );
}
