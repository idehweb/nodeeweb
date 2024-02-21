import {

    Create,
    Datagrid,
    DateField,
    DeleteButton,
    Edit,
    EditButton,
    ReferenceField,
    ReferenceInput,
    RefreshButton,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
  useTranslate
} from 'react-admin';
import CardActions from '@mui/material/CardActions';
import {Textsms as Icon,Send} from '@mui/icons-material';
import Button from '@mui/material/Button';
import axios from 'axios';
import {List, SimpleForm} from '@/components';
import SendCampaignButton from "@/components/SendCampaignButton";

const PostEditActions = ({ basePath, data, resource }) => (
    <CardActions>
        <ShowButton record={data}/>
        <SendCampaignButton record={data}/>

    </CardActions>
);
const SmsEditActions = ({basePath, data, resource}) => (
    <CardActions>
        <ShowButton record={data}/>
        <RefreshButton/>
    </CardActions>
);




export const campaignEdit = (props) => {
  const translate = useTranslate();

  return(
    <Edit actions={<PostEditActions/>} {...props}>
      <SimpleForm>
          <TextInput source={"title." + translate("lan")} label={translate("resources.campaign.title")}
                     className={"width100 mb-20"}  fullWidth/>

          <TextInput

              source="slug" label={translate("resources.campaign.slug")} className={"width100 mb-20 ltr"}
              fullWidth/>
          <TextInput multiline source="message" label={translate("resources.campaign.message")} fullWidth/>
          <div className={'ltr'}>
              {translate("resources.messages.help")}
          </div>

          <ReferenceInput
              fullWidth
              source="customerGroup" reference="customerGroup">
              <SelectInput
                  fullWidth

                  label={translate("resources.campaign.customerGroup")} optionText="name.fa"/>
          </ReferenceInput>

          <SelectInput
              label={translate("resources.campaign.source")}
              fullWidth

              source="source"
              choices={[
                  { id: "CRM", name: translate("resources.campaign.CRM") },
                  { id: "WEBSITE", name: translate("resources.campaign.WEBSITE") },
              ]}
          />
          <TextInput source="phoneNumber" label={translate("resources.campaign.phoneNumber")} fullWidth/>
          <TextInput source="limit" label={translate("resources.campaign.limit")} fullWidth/>
          <TextInput source="offset" label={translate("resources.campaign.offset")} fullWidth/>
          <TextInput className={'ltr'} source="link" label={translate("resources.campaign.link")} fullWidth/>

      </SimpleForm>
    </Edit>
  );
};


export default campaignEdit;
