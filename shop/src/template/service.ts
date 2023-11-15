import { CRUD, MiddleWare, NotFound } from '@nodeeweb/core';
import { updateTemplate } from './view';
import store from '../../store';
import { TemplateDocument, TemplateModel } from '@nodeeweb/core/types/template';
import { Query } from 'mongoose';
import { getEntityEventName } from '@nodeeweb/core/src/handlers/entity.handler';

class Service {
  get templateModel(): TemplateModel {
    return store.db.model('template');
  }
  afterCreate: MiddleWare = (req, res) => {
    const template: TemplateDocument = req.crud;
    updateTemplate(template, { action: 'create' });

    // emit event
    store.event.emit(
      getEntityEventName('template', { post: true, type: CRUD.CREATE }),
      template,
      { type: CRUD.CREATE, model: 'template' },
      req
    );

    return res.status(201).json({ data: template });
  };
  afterUpdate: MiddleWare = async (req, res) => {
    const oldT = await this.templateModel.findById(req.params.id);

    const tq: Query<TemplateDocument, TemplateDocument> = req.crud;
    const newT = await tq.exec();
    if (!newT) throw new NotFound('template not found');

    updateTemplate(newT, { action: 'update', oldTemplate: oldT });

    // emit event
    store.event.emit(
      getEntityEventName('template', { post: true, type: CRUD.UPDATE_ONE }),
      newT,
      { type: CRUD.UPDATE_ONE, model: 'template' },
      req
    );

    return res.status(200).json({ data: newT });
  };
  afterDelete: MiddleWare = async (req, res) => {
    const template = req.crud;
    updateTemplate(template, { action: 'delete' });

    // emit event
    store.event.emit(
      getEntityEventName('template', { post: true, type: CRUD.DELETE_ONE }),
      template,
      { type: CRUD.DELETE_ONE, model: 'template' },
      req
    );

    return res.status(204).send();
  };
}

const templateService = new Service();

export default templateService;
