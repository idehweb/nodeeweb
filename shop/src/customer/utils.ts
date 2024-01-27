import { Req } from '@nodeeweb/core';
import { plainToInstance } from 'class-transformer';
import { UpdateCustomerByOwn } from '../../dto/in/user/customer';

export function transformBody(req: Req, body = req.body) {
  //   transform status, add user if not set
  if (body.status && Array.isArray(body.status)) {
    body.status = body.status.map((status) =>
      status.user ? status : { ...status, user: req.user._id }
    );
  }

  return body;
}

export function customerTransformBody(req: Req, body = req.body) {
  const newBody = plainToInstance(UpdateCustomerByOwn, body, {
    enableCircularCheck: true,
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });
  return newBody;
}
