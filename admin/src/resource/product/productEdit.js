import { Edit, RefreshButton, ShowButton,useEditController } from "react-admin";
import CardActions from "@mui/material/CardActions";
import Form from "./productForm";
import {
    TextInput,useTranslate
} from "react-admin";
import TelegramPushPostButton from "@/components/TelegramPushPostButton";

const PostEditActions = ({ basePath, data, resource }) => (
  <CardActions>
    <ShowButton record={data}/>
    <RefreshButton/>
    <TelegramPushPostButton record={data}/>

  </CardActions>
);
const edit = (props) => {
    console.clear()
    const transform = (data, { previousData }) => {
        console.log("transform={transform}",data, { previousData })

        return({
            ...data,
            // firstCategory: "61d58e37d931414fd78c7fb7"
        });
    }
    const translate=useTranslate();
    const { id } = props;
    const { record, save, isLoading } = useEditController({ resource: 'product', id });
console.log("propsprops",props)
    // transform={transform}
    return(
    <Edit actions={<PostEditActions/>}  {...props} redirect={false}
          mutationMode={'pessimistic'}

    >
      <Form record={record} redirect={false}>
          <TextInput source={"_id"} label={translate("_id")}
                     className={"width100 mb-20"} fullWidth disabled/>

      </Form>
    </Edit>
  );
}


export default edit;
