import Core  from "./core";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const CreatePage = (props) => {
  // const translate = useTranslate();
  return (
    <DndProvider backend={HTML5Backend}>
      <Core {...props}/>
    </DndProvider>

  );
};
export const PageServer = [
  {}
];
export default CreatePage;
