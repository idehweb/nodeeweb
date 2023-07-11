import {
  BooleanField,
  Datagrid,
  DeleteButton,
  EditButton,
  useTranslate
} from "react-admin";
import { CatRefField, DeliverySchedule, FileChips, List, showFiles, SimpleForm } from "@/components";
import { Val } from "@/Utils";


function returnToHome(values) {
  console.log("returnToHome", values);

}

const list = (props) => {
  const translate=useTranslate();
  return(
    <List {...props}>
      <Datagrid optimized>
        <BooleanField source="siteActive" label={translate("resources.settings.siteStatus")}/>
        <EditButton/>
        <DeleteButton/>
      </Datagrid>
    </List>
  );
}

export default list;
