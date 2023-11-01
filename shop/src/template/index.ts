import registerController from './controller';
import registerView from './view';

export default async function registerTemplate() {
  registerController();
  await registerView();
}
