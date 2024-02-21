import {Create, ReferenceInput, RefreshButton, SelectInput, ShowButton, TextInput, useTranslate} from 'react-admin';
import CardActions from '@mui/material/CardActions';
import {List, SimpleForm} from '@/components';

const SmsEditActions = ({basePath, data, resource}) => (
    <CardActions>
        <ShowButton record={data}/>
        <RefreshButton/>
    </CardActions>
);


export const campaignCreate = (props) => {
    const translate = useTranslate();

    return (
        <Create {...props}>
            <SimpleForm>
                <TextInput source={"title." + translate("lan")} label={translate("resources.campaign.title")}
                           className={"width100 mb-20"} fullWidth/>

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
                        {id: "CRM", name: translate("resources.campaign.CRM")},
                        {id: "WEBSITE", name: translate("resources.campaign.WEBSITE")},
                    ]}
                />
                <TextInput source="phoneNumber" label={translate("resources.campaign.phoneNumber")} fullWidth/>
                <TextInput source="limit" label={translate("resources.campaign.limit")} fullWidth/>
                <TextInput source="offset" label={translate("resources.campaign.offset")} fullWidth/>
                <TextInput className={'ltr'} source="link" label={translate("resources.campaign.link")} fullWidth/>

            </SimpleForm>
        </Create>
    );
};


export default campaignCreate;
