import registerController from './controller';
import registerView from './view';

export default function registerFile() {
  registerController();
  registerView();
}
