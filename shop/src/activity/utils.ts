import { CRUD } from '@nodeeweb/core';
import { ActivityType, ActivityUser } from '../../schema/activity.schema';
import { UserDocument } from '@nodeeweb/core/types/user';

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

export function convertUser(user: UserDocument): ActivityUser {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    at: new Date(),
  };
}
