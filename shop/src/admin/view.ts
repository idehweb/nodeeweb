import { ViewContent, registerAdminView } from '@nodeeweb/core';

const adminView: ViewContent = {
  list: {
    header: [
      { name: 'email', type: 'string' },
      { name: 'username', type: 'string' },
      { name: 'nickname', type: 'string' },
      { name: 'active', type: 'boolean' },
      { name: 'createdAt', type: 'date' },
      { name: 'updatedAt', type: 'date' },
      { name: 'actions', type: 'actions', edit: true, delete: true },
    ],
  },

  create: {
    fields: [
      { name: 'email', type: 'string' },
      { name: 'username', type: 'string' },
      { name: 'nickname', type: 'string' },
      { name: 'password', type: 'string' },
      { name: 'type', type: 'string' },
    ],
  },
  edit: {
    fields: [
      { name: 'email', type: 'string' },
      { name: 'username', type: 'string' },
      { name: 'nickname', type: 'string' },
      { name: 'password', type: 'string' },
      { name: 'type', type: 'string' },
    ],
  },
};

export default function registerView() {
  registerAdminView(
    { content: adminView, name: 'admin' },
    { from: 'ShopEntity' }
  );
}
