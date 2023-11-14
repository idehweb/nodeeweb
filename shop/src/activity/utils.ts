import { CRUD } from '@nodeeweb/core';
import { ActivityType } from '../../schema/activity.schema';

export function crudType2ActivityType(status: CRUD) {
  switch (status) {
    case CRUD.CREATE:
      return ActivityType.Create;
    case CRUD.DELETE_ONE:
      return ActivityType.Delete;
    case CRUD.UPDATE_ONE:
      return ActivityType.Update;

    default:
      throw new Error(`invalid crud status: ${status}`);
  }
}
