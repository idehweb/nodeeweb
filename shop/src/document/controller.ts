import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { controllerRegister } from '@nodeeweb/core/src/handlers/controller.handler';
import { uploadSingle } from '@nodeeweb/core/src/handlers/upload.handler';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };

  // upload
  controllerRegister(
    {
      url: '/fileUpload',
      method: 'post',
      access,
      service: [
        ...uploadSingle({
          type: 'all',
          max_size_mb: 1024,
          reduce: {
            quality: 0.8,
          },
        }),
        (req, res) => res.status(201).json({ data: { media: req.file_path } }),
      ],
    },
    { base_url: '/admin/document', from: 'ShopEntity' }
  );
}
