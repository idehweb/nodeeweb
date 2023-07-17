import { ViewContent } from '@nodeeweb/core/types/view';
import { registerAdminView } from '@nodeeweb/core/src/handlers/view.handler';
const adminView: ViewContent = {
  list: {
    header: [
      { name: 'title', type: 'string' },
      { name: 'updatedAt', type: 'date' },
      {
        name: 'actions',
        type: 'actions',
        edit: true,
        delete: true,
        pageBuilder: true,
      },
    ],
  },
  create: {
    fields: [{ name: 'title', type: 'string' }],
  },
  edit: {
    fields: [{ name: 'title', type: 'string' }],
  },
};

export default function registerView() {
  registerAdminView(
    { content: adminView, name: 'form' },
    { from: 'ShopEntity' }
  );
}
