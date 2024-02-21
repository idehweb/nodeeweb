import {

    Datagrid,
    DateField,
    DeleteButton,
    EditButton,
    TextField,
    FunctionField,
  useTranslate
} from 'react-admin';

import {List, SimpleForm,ShowLink} from '@/components';

export const campaignList = (props) => {
  const translate = useTranslate();
  return(

    <List {...props}>
      <Datagrid>
          <FunctionField label={translate("resources.campaign.title")}
                         render={record => {
                             return <>
                                 <TextField source={"title."+translate('lan')} label={translate('resources.campaign.title')}/>
                                 <br/>
                                 <TextField source={"slug"} />
                             </>;
                         }}/>
          <FunctionField label={translate("resources.campaign.type")}
                         render={record => {
                             return <>
                                 <TextField source={"source"} label={translate('resources.campaign.source')}/>
                                 <br/>
                                 <TextField source={"customerGroup"} label={translate('resources.campaign.customerGroup')}/>
                                 <br/>
                                 <TextField source={"phoneNumber"} label={translate('resources.campaign.phoneNumber')}/>
                             </>;
                         }}/>
          <TextField source="status" label={translate('resources.campaign.status')}/>
        <TextField source="participantsCount" label={translate('resources.campaign.participantCount')}/>
        <TextField source="viewsCount" label={translate('resources.campaign.viewsCount')}/>
        <DateField source="createdAt" showTime label={translate('resources.campaign.createdAt')}/>
        <DateField source="updatedAt" showTime label={translate('resources.campaign.updatedAt')}/>
        <EditButton/>
        <DeleteButton />
      </Datagrid>
    </List>
  );
}

export default campaignList;
