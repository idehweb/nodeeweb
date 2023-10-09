import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import '@/assets/shards-dashboards.1.1.0.min.css';

import Core from './core';

export default function CreatePage(props) {
  return (
    <DndProvider backend={HTML5Backend}>
      <Core {...props} />
    </DndProvider>
  );
}
