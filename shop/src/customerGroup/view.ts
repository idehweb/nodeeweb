import { ViewContent } from '@nodeeweb/core/types/view';
import { registerAdminView } from '@nodeeweb/core/src/handlers/view.handler';
const adminView: ViewContent = {
  list: {
    header: [
      { name: 'name', type: 'multiLang' },
      { name: 'slug', type: 'string' },
      { name: 'order', type: 'number' },
      { name: 'parent', type: 'string' },
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
        name: 'parent',
        type: 'select',
        entity: 'CustomerGroup',
        optionName: 'slug',
        optionValue: '_id',
        defaultValue: null,
        limit: 2000,
        size: { lg: 6, sm: 12 },
      },
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
        name: 'parent',
        type: 'select',
        entity: 'CustomerGroup',
        optionName: 'slug',
        optionValue: '_id',
        defaultValue: null,
        limit: 2000,
        size: { lg: 6, sm: 12 },
      },
    ],
  },
};

export default function registerView() {
  registerAdminView(
    { content: adminView, name: 'category' },
    { from: 'ShopEntity' }
  );
}
