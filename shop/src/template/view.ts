import { ViewContent } from '@nodeeweb/core/types/view';
import {
  registerAdminView,
  registerTemplate,
  unregisterTemplate,
} from '@nodeeweb/core/src/handlers/view.handler';
import store from '../../store';
import {
  ITemplate,
  StoreTemplate,
  TemplateDocument,
  TemplateModel,
} from '@nodeeweb/core/types/template';
const adminView: ViewContent = {
  list: {
    header: [
      { name: 'title', type: 'string' },
      { name: 'type', type: 'string' },
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
  },

  create: {
    fields: [
      { name: 'title', type: 'string' },
      { name: 'type', type: 'string' },
      { name: 'maxWidth', type: 'string' },
      { name: 'classes', type: 'string' },
      { name: 'padding', type: 'string' },
      { name: 'backgroundColor', type: 'string' },
    ],
  },
  edit: {
    fields: [
      { name: 'title', type: 'string' },
      { name: 'type', type: 'string' },
      { name: 'maxWidth', type: 'string' },
      { name: 'classes', type: 'string' },
      { name: 'padding', type: 'string' },
      { name: 'backgroundColor', type: 'string' },
    ],
  },
};

export default async function registerView() {
  registerAdminView(
    { content: adminView, name: 'template' },
    { from: 'ShopEntity' }
  );

  // init
  const templateModel: TemplateModel = store.db.model('template');
  const templates = await templateModel.find();
  for (const template of templates) {
    updateTemplate(template);
  }
}

export function updateTemplate(
  template: ITemplate,
  {
    action,
    oldTemplate,
  }: {
    action: 'create' | 'update' | 'delete';
    oldTemplate?: TemplateDocument;
  } = { action: 'create' }
) {
  switch (action) {
    case 'create':
      return _register();
    case 'update':
      _unregister(oldTemplate);
      _register(template);
      return;
    case 'delete':
      return _unregister();
  }

  function _register(t = template) {
    const storeTemplate: StoreTemplate = {
      maxWidth: t.maxWidth ? t.maxWidth : '100%',
      backgroundColor: t.backgroundColor ? t.backgroundColor : '',
      classes: t.classes ? t.classes : '',
      padding: t.padding ? t.padding : '',
      showInDesktop: t.showInDesktop ? t.showInDesktop : false,
      showInMobile: t.showInMobile ? t.showInMobile : false,
      elements: t.elements ?? [],
    };
    registerTemplate(
      { type: t.type, title: t.title, template: storeTemplate },
      { from: 'ShopEntity', onStartup: action === 'create' }
    );
  }
  function _unregister(t = template) {
    return unregisterTemplate(
      { type: t.type, title: t.title },
      { from: 'ShopEntity' }
    );
  }
}
