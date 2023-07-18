import model from './model.mjs';
import routes from './routes.mjs';

export default {
  name: 'customer',
  model: model,
  modelName: 'Customer',
  routes: routes,
  admin: {
    list: {
      header: [
        { name: 'phoneNumber', type: 'number' },
        { name: 'email', type: 'email' },
        { name: 'activationCode', type: 'number' },
        { name: 'nickname', type: 'string' },
        { name: 'firstName', type: 'string' },
        { name: 'lastName', type: 'string' },
        { name: 'credit', type: 'number' },
        { name: 'createdAt', type: 'date' },
        { name: 'updatedAt', type: 'date' },
        {
          name: 'actions',
          type: 'actions',
          edit: true,
          delete: true,
          pageBuilder: false,
        },
      ],
    },
    create: {
      fields: [
        { name: 'firstName', type: 'string', size: { lg: 12, sm: 12 } },
        { name: 'lastName', type: 'string', size: { lg: 12, sm: 12 } },
        { name: 'nickname', type: 'string', size: { lg: 6, sm: 12 } },
        { name: 'type', type: 'string', size: { lg: 6, sm: 12 } },
        { name: 'internationalCode', type: 'string', size: { lg: 6, sm: 12 } },
        { name: 'phoneNumber', type: 'string', size: { lg: 6, sm: 12 } },
        { name: 'email', type: 'string', size: { lg: 6, sm: 12 } },
        { name: 'password', type: 'string', size: { lg: 6, sm: 12 } },
        { name: 'age', type: 'number', size: { lg: 6, sm: 12 } },
        { name: 'active', type: 'boolean', size: { lg: 6, sm: 12 } },
        { name: 'score', type: 'number', size: { lg: 6, sm: 12 } },
        { name: 'credit', type: 'number' },
        {
          name: 'customerGroup',
          type: 'checkbox',
          entity: 'customerGroup',
          limit: 2000,
          size: { lg: 6, sm: 12 },
        },
      ],
    },
    edit: {
      fields: [
        { name: '_id', type: 'string', disabled: true },
        { name: 'firstName', type: 'string', size: { lg: 12, sm: 12 } },
        { name: 'lastName', type: 'string', size: { lg: 12, sm: 12 } },
        { name: 'nickname', type: 'string', size: { lg: 6, sm: 12 } },
        { name: 'type', type: 'string', size: { lg: 6, sm: 12 } },
        { name: 'internationalCode', type: 'string', size: { lg: 6, sm: 12 } },
        { name: 'phoneNumber', type: 'string', size: { lg: 6, sm: 12 } },
        { name: 'email', type: 'string', size: { lg: 6, sm: 12 } },
        { name: 'password', type: 'string', size: { lg: 6, sm: 12 } },
        { name: 'age', type: 'number', size: { lg: 6, sm: 12 } },
        { name: 'active', type: 'boolean', size: { lg: 6, sm: 12 } },
        { name: 'score', type: 'number', size: { lg: 6, sm: 12 } },
        { name: 'credit', type: 'number' },
        {
          name: 'customerGroup',
          type: 'checkbox',
          entity: 'customerGroup',
          limit: 2000,
          size: { lg: 6, sm: 12 },
        },
      ],
    },
  },
  views: [
    {
      func: (req, res, next) => {},
    },
  ],
  edits: [
    {
      func: (req, res, next) => {},
    },
  ],
};
