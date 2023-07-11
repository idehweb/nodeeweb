import {
    BulkDeleteButton,
    Create,
    Datagrid,
    DeleteButton,
    Edit,
    EditButton,
    Filter,
    FunctionField,
    NumberInput,
    Pagination,
    ReferenceField,
    ReferenceInput,
    ResourceContextProvider,
    SearchInput,
    SelectInput,
    Show,
    ShowButton,
    SimpleShowLayout,
    TextField,
    TextInput,
    useResourceContext, useTranslate
} from 'react-admin';
import React, {Fragment} from 'react';
import {useParams} from 'react-router';
import {CategoryRounded as Icon, LibraryAdd} from '@mui/icons-material';
import {CustomResetViewsButton, List, SimpleForm} from '@/components';
import useStyles from '@/styles';
import {Val} from '@/Utils';
import API, {BASE_URL} from '@/functions/API';
import {Chip} from '@mui/material';

var theID = null;


const Form = ({children, ...rest}) => {
    const cls = useStyles();
    const translate = useTranslate();

    return (
        <SimpleForm {...rest}>
            {children}
            <TextInput
              source={"title."+translate('lan')}
                label={translate('resources.gateway.name')}
                validate={Val.req}
                formClassName={cls.f2}
                fullWidth
            />
          <TextInput
            source={"description."+translate('lan')}
            label={translate('resources.gateway.description')}
            validate={Val.req}
            formClassName={cls.f2}
            fullWidth
          />
            <TextInput
                source="slug"
                label={translate('resources.gateway.slug')}
                validate={Val.req}
                formClassName={cls.f2}
                fullWidth
            />
          <SelectInput
            label={translate("resources.gateway.type")}
            defaultValue={"bank"}
            source="type"
            choices={[
              {id: "bank", name: translate("resources.gateway.bank")},
              {id: "sms", name: translate("resources.gateway.sms")},
              {id: "email", name: translate("resources.gateway.email")}
            ]}
          />
            {/*<NumberInput*/}
                {/*source="order"*/}
                {/*label={translate('resources.gateway.order')}*/}
                {/*fullWidth*/}
            {/*/>*/}
        </SimpleForm>
    );
};




const create = (props) => (
    <Create {...props}>
        <Form/>
    </Create>
);

export default create;
