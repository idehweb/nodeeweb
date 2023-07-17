import { ControllerSchema } from '@nodeeweb/core/types/controller';
import registerController from './controller';
import registerView from './view';

export default function registerAttribute() {
  registerController();
  registerView();
}
