import {
  FunctionField,
  Show,
  SimpleShowLayout,
  TextField,
  useTranslate
} from "react-admin";
import { dateFormat } from "@/functions";
import { JsonDiffer, List, SimpleForm, UploaderField } from "@/components";
import { Val } from "@/Utils";


export const actionShow = (props) => {
  const translate = useTranslate();

  return(
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="title" label={translate("resources.action.title")}/>
        <TextField source="customer.phoneNumber" label={translate("resources.action.phoneNumber")}/>
        <TextField source="customer.firstName" label={translate("resources.action.firstName")}/>
        <TextField source="customer.lastName" label={translate("resources.action.lastName")}/>
        <TextField source="user.nickname" label={translate("resources.action.nickname")}/>
        <TextField source="user.username" label={translate("resources.action.username")}/>
        <TextField source="product" label={translate("resources.action.product")}/>
        <FunctionField label={translate("resources.action.difference")}
                       render={record => {
                         return <JsonDiffer object1={record.data} object2={record.history}/>;

                       }}/>

      </SimpleShowLayout>
    </Show>
  );
}
export default actionShow;
