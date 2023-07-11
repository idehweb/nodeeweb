import { SimpleShowLayout,Show,TextField } from "react-admin";
import CardActions from "@mui/material/CardActions";
import Form from "./productForm";

import TelegramPushPostButton from "@/components/TelegramPushPostButton";


const show = (props) => {
  return(
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="title.fa"/>
        <TextField source="views"/>
        <TextField source="views"/>


      </SimpleShowLayout>
    </Show>
  );
}


export default show;
