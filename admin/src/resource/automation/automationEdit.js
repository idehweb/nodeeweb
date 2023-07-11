import {Edit, useForm, useTranslate} from "react-admin";
import {BASE_URL} from "@/functions/API";
import {dateFormat} from "@/functions";
import {
    CatRefField,
    EditOptions,
    FileChips,
    List,
    ShowDescription,
    showFiles,
    ShowLink,
    ShowOptions,
    ShowPictures,
    SimpleForm,
    SimpleImageField,
    UploaderField
} from "@/components";
import {Val} from "@/Utils";
import React from "react";
import Form from "./automationForm";
import {useEditController,TextInput} from "react-admin";

export const automationEdit = (props) => {
    console.log('props', props);
    const translate = useTranslate();
    const {id} = props;
    const {record, save, isLoading} = useEditController({resource: 'automation', id});

    return (
        <Edit {...props} redirect={false} mutationMode={'pessimistic'}>
            <Form record={record} redirect={false}>
                <TextInput source={"_id"} label={translate("_id")}
                           className={"width100 mb-20"} fullWidth disabled/>
                               <TextInput source={"crontab_expr"} fullWidth label={translate("resources.automation.crontab_expr")}
                 className={"width100 mb-20"}
                 validate={Val.req}/>
                 <TextInput source={"query_pipe"} fullWidth label={translate("resources.automation.query_pipe")}
                 className={"width100 mb-20"}
                 validate={Val.req}/>
                 <TextInput source={"aggregation_pipe"} fullWidth label={translate("resources.automation.aggregation_pipe")}
                 className={"width100 mb-20"}
                 validate={Val.req}/>
                 <TextInput source={"action"} fullWidth label={translate("resources.automation.action")}
                 className={"width100 mb-20"}
                 validate={Val.req}/>
            </Form>
        </Edit>
    );
}

export default automationEdit;
