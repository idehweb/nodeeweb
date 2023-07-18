import { ViewContent } from '@nodeeweb/core/types/view';
import { registerAdminView } from '@nodeeweb/core/src/handlers/view.handler';
const adminView: ViewContent = {
  list: {
    header: [
      { name: 'title', type: 'multiLang' },
      { name: 'slug', type: 'string' },
      { name: 'path', type: 'string' },
      { name: 'status', type: 'string' },
      { name: 'createdAt', type: 'date' },
      { name: 'updatedAt', type: 'date' },
      {
        name: 'actions',
        type: 'actions',
        edit: true,
        delete: true,
        pageBuilder: true,
      },
    ],
    url: '/admin/page/create-page',
    pageBuilder: true,
  },

  create: {
    fields: [
      {
        name: 'title',
        type: 'object',
        kind: 'multiLang',
        size: { lg: 12, sm: 12 },
      },
      { name: 'slug', type: 'string', size: { lg: 12, sm: 12 } },
      { name: 'excerpt', type: 'object', size: { lg: 12, sm: 12 } },
      { name: 'description', type: 'object', size: { lg: 12, sm: 12 } },
      { name: 'views', type: 'object' },
      { name: 'kind', type: 'string' },
      { name: 'path', type: 'string' },
      { name: 'classes', type: 'string' },
      { name: 'backgroundColor', type: 'string' },
      { name: 'maxWidth', type: 'string' },
      { name: 'padding', type: 'string' },
      {
        name: 'status',
        type: 'select',
        options: [
          { label: 'published', value: 'published', name: 'published' },
          { label: 'processing', value: 'processing', name: 'processing' },
          { label: 'draft', value: 'draft', name: 'draft' },
        ],
      },
    ],
  },
  edit: {
    fields: [
      { name: '_id', type: 'string', disabled: true, size: { lg: 12, sm: 12 } },
      {
        name: 'title',
        type: 'object',
        kind: 'multiLang',
        size: { lg: 12, sm: 12 },
      },
      { name: 'slug', type: 'string' },
      { name: 'description', type: 'object', size: { lg: 12, sm: 12 } },
      { name: 'excerpt', type: 'object', size: { lg: 12, sm: 12 } },
      { name: 'active', type: 'boolean' },
      { name: 'views', type: 'array' },
      { name: 'kind', type: 'string' },
      { name: 'classes', type: 'string' },
      { name: 'path', type: 'string' },
      {
        name: 'status',
        type: 'select',
        options: [
          { label: 'published', value: 'published', name: 'published' },
          { label: 'processing', value: 'processing', name: 'processing' },
          { label: 'draft', value: 'draft', name: 'draft' },
        ],
      },
      { name: 'maxWidth', type: 'string' },
      { name: 'backgroundColor', type: 'string' },
      { name: 'padding', type: 'string' },
      { name: 'createdAt', type: 'date' },
      { name: 'updatedAt', type: 'date' },
    ],
  },
};

export default function registerView() {
  registerAdminView(
    { content: adminView, name: 'page' },
    { from: 'ShopEntity' }
  );
}
