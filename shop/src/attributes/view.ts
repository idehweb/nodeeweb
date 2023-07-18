import { ViewContent } from '@nodeeweb/core/types/view';
import { registerAdminView } from '@nodeeweb/core/src/handlers/view.handler';
const adminView: ViewContent = {
  list: {
    header: [
      { name: 'name', type: 'multiLang' },
      { name: 'slug', type: 'string' },
      { name: 'type', type: 'string' },
      { name: 'actions', type: 'actions', edit: true, delete: true },
    ],
  },
  create: {
    fields: [
      {
        name: 'name',
        type: 'object',
        kind: 'multiLang',
        size: { lg: 12, sm: 12 },
      },
      { name: 'slug', type: 'string' },
      { name: 'order', type: 'number' },
      { name: 'kind', type: 'string' },
      {
        name: 'values',
        type: 'array',
        child: [
          { name: 'name', type: 'object', kind: 'multiLang' },
          { name: 'slug', type: 'string' },
          { name: 'color', type: 'color' },
        ],
        size: { lg: 12, sm: 12 },
      },
      { name: 'image', type: 'image' },
    ],
  },
  edit: {
    fields: [
      { name: '_id', type: 'string', disabled: true },
      {
        name: 'name',
        type: 'object',
        kind: 'multiLang',
        size: { lg: 12, sm: 12 },
      },
      { name: 'slug', type: 'string' },
      { name: 'order', type: 'number' },
      { name: 'kind', type: 'string' },
      {
        name: 'values',
        type: 'array',
        child: [
          { name: 'name', type: 'object', kind: 'multiLang' },
          { name: 'slug', type: 'string' },
          { name: 'color', type: 'color' },
        ],
        size: { lg: 12, sm: 12 },
      },
      { name: 'image', type: 'image' },
    ],
  },
};

export default function registerView() {
  registerAdminView(
    { content: adminView, name: 'attribute' },
    { from: 'ShopEntity' }
  );
}
