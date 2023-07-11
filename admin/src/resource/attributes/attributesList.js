import {
    ArrayInput,
    BooleanInput,
    ChipField,
    Create,
    Datagrid,
    DeleteButton,
    Edit,
    EditButton,
    FormDataConsumer,
    ReferenceField,
    ReferenceInput,
    SelectInput,
    SimpleFormIterator,
    SingleFieldList,
    TextField,
    TextInput,
    useTranslate
} from 'react-admin';
import {CategoryRounded as Icon,ControlPointDuplicate} from '@mui/icons-material';
import {Divider} from '@mui/material';
import {List, SimpleForm, UploaderField} from '@/components';

import useStyles from '@/styles';
import {Val} from '@/Utils';

const list = (props) => {
    const translate = useTranslate();

    return (
        <List {...props}>
            <Datagrid>
                <TextField source="name.fa" label={translate('resources.attributes.name')}/>
                <TextField source="slug" label={translate('resources.attributes.slug')}/>
                <TextField source="useInFilter" label={translate('resources.attributes.useInFilter')}/>

                <EditButton/>
                <DeleteButton/>
            </Datagrid>
        </List>
    );

};



export default list;
