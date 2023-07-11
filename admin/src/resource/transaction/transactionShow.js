import {
  BooleanField,
  Datagrid,
  Filter,
  FunctionField,
  NumberField,
  SearchInput,
  SimpleShowLayout,
  TextField,
  SelectField,
  Show,
  useTranslate
} from "react-admin";

import { dateFormat } from "@/functions";
import { List, StatusField,PaymentStatus } from "@/components";
import { MonetizationOn } from "@mui/icons-material";



export const transactionShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      {/*<ReferenceField label="customer" source="customer" reference="customer">*/}
      {/*<TextField source="countryCode" />*/}
      {/*</ReferenceField>*/}
      <TextField source="Authority"/>
      <TextField source="amount"/>
      {/*<TextField source="from"/>*/}
      {/*<TextField source="passengers"/>*/}
      {/*<TextField source="luggage"/>*/}
      {/*<RichTextField source="description"/>*/}
    </SimpleShowLayout>
  </Show>
);

export default transactionShow;
