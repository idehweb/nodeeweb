import { Req } from '@nodeeweb/core';

export function transformBody(req: Req, body = req.body) {
  //   transform status, add user if not set
  if (body.status && Array.isArray(body.status)) {
    body.status = body.status.map((status) =>
      status.user ? status : { ...status, user: req.user._id }
    );
  }

  return body;
}
