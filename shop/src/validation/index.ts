import { registerValidationPipe } from '@nodeeweb/core/src/handlers/validate.handler';
import ShopValidationPipe from './ShopValidationPipe';

export default function registerValidation() {
  registerValidationPipe({
    from: 'ShopValidation',
    validation: new ShopValidationPipe(),
  });
}
