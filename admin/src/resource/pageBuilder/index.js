import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Core from './core';

const CreatePage = (props) => {
  // const translate = useTranslate();
  return (
    <DndProvider backend={HTML5Backend}>
      <Core {...props} />
    </DndProvider>
  );
};
export const PageServer = [{}];
export default CreatePage;
