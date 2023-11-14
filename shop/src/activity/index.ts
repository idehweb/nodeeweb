import registerController from './controller';
import registerView from './view';

export default function registerActivity() {
  registerController();
  registerView();
}
