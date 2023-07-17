import { ViewContent } from '@nodeeweb/core/types/view';
import { registerAdminView } from '@nodeeweb/core/src/handlers/view.handler';
const adminView: ViewContent = {
  list: {
    header: [
      { name: 'thumbnail', type: 'image' },
      { name: 'title', type: 'multiLang' },
      { name: 'postCategory', type: 'string' },
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
      { name: 'slug', type: 'string', size: { lg: 6, sm: 12 } },
      {
        name: 'excerpt',
        type: 'object',
        kind: 'multiLang',
        size: { lg: 12, sm: 12 },
      },
      {
        name: 'description',
        type: 'object',
        kind: 'multiLang',
        size: { lg: 12, sm: 12 },
      },
      {
        name: 'type',
        type: 'select',
        options: [
          { label: 'normal', value: 'normal', name: 'normal' },
          { label: 'variable', value: 'variable', name: 'variable' },
        ],
      },
      { name: 'photo', type: 'images', size: { lg: 12, sm: 12 } },
      {
        name: 'status',
        type: 'select',
        options: [
          { label: 'published', value: 'published', name: 'published' },
          { label: 'processing', value: 'processing', name: 'processing' },
          { label: 'draft', value: 'draft', name: 'draft' },
        ],
        size: { lg: 12, sm: 12 },
      },
      { name: 'maxWidth', type: 'string' },
      { name: 'kind', type: 'string' },
    ],
  },
  edit: {
    fields: [
      { name: '_id', type: 'string', disabled: true },
      {
        name: 'title',
        type: 'object',
        kind: 'multiLang',
        size: { lg: 12, sm: 12 },
      },
      { name: 'slug', type: 'string', size: { lg: 6, sm: 12 } },
      { name: 'views', type: 'object' },
      {
        name: 'excerpt',
        type: 'object',
        kind: 'multiLang',
        size: { lg: 12, sm: 12 },
      },
      {
        name: 'description',
        type: 'object',
        kind: 'multiLang',
        size: { lg: 12, sm: 12 },
      },
      {
        name: 'type',
        type: 'select',
        options: [
          { label: 'normal', value: 'normal', name: 'normal' },
          { label: 'variable', value: 'variable', name: 'variable' },
        ],
      },
      { name: 'photo', type: 'images', size: { lg: 12, sm: 12 } },
      {
        name: 'status',
        type: 'select',
        options: [
          { label: 'published', value: 'published', name: 'published' },
          { label: 'processing', value: 'processing', name: 'processing' },
          { label: 'draft', value: 'draft', name: 'draft' },
        ],
        size: { lg: 12, sm: 12 },
      },
      { name: 'maxWidth', type: 'string' },

      { name: 'kind', type: 'string' },
    ],
  },
};

export default function registerView() {
  registerAdminView(
    { content: adminView, name: 'post' },
    { from: 'ShopEntity' }
  );
}
