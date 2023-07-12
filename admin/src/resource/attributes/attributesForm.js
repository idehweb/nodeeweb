import {
  ArrayInput,
  BooleanInput,
  Edit,
  SaveButton,
  DeleteButton,
  Toolbar,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  useTranslate,
  FormDataConsumer,
} from 'react-admin';
import { Divider } from '@mui/material';

import { AttrType, List, SimpleForm, UploaderField } from '@/components';
import useStyles from '@/styles';
import { Val } from '@/Utils';
import { ColorPicker } from '@/components';

const defaultValues = {
  values: [
    {
      name: {
        fa: '',
      },
      slug: '',
      color: '',
    },
  ],
};
const CustomToolbar = (props) => (
  <Toolbar {...props} className={'dfghjk'}>
    <SaveButton alwaysEnable />
    <DeleteButton mutationMode="pessimistic" />
  </Toolbar>
);
const Form = ({ children, ...props }) => {
  const cls = useStyles();
  const translate = useTranslate();

  return (
    <SimpleForm
      {...props}
      toolbar={<CustomToolbar />}
      defaultValues={defaultValues}>
      <TextInput
        source="name.fa"
        label={translate('resources.attributes.name')}
      />
      <TextInput source="slug" label={translate('resources.attributes.slug')} />
      <BooleanInput
        source="useInFilter"
        label={translate('resources.attributes.useInFilter')}
      />

      <SelectInput
        label={translate('resources.attributes.type')}
        fullWidth
        className={'mb-20'}
        source="type"
        choices={AttrType()}
      />
      <TextInput
        fullWidth
        source={'metatitle.' + translate('lan')}
        label={translate('resources.attributes.metatitle')}
      />
      <TextInput
        multiline
        fullWidth
        source={'metadescription.' + translate('lan')}
        label={translate('resources.attributes.metadescription')}
      />

      <Divider />

      <ArrayInput
        source="values"
        label={translate('resources.attributes.values')}>
        <SimpleFormIterator {...props}>
          <FormDataConsumer>
            {(p) => {
              // console.clear();
              // console.log('scopedFormData',p);

              const { getSource, scopedFormData, formData } = p;
              // console.log('formData',formData);
              let color = '#fff';
              if (scopedFormData && scopedFormData.color) {
                color = scopedFormData.color;
              }
              return [
                <TextInput
                  key={0}
                  source={getSource('name.fa')}
                  label={translate('resources.attributes.name')}
                  multiline
                  fullWidth
                />,
                <TextInput
                  key={1}
                  source={getSource('slug')}
                  label={translate('resources.attributes.slug')}
                  className={'ltr'}
                  multiline
                  fullWidth
                />,
                <div key={2} className={'posrel'}>
                  {formData['type'] === 'color' && (
                    <ColorPicker
                      className={'input-color'}
                      color={color}
                      source={getSource('color')}
                      onChangeComplete={(e) => {
                        console.log('scopedFormData', p, e);
                        scopedFormData.color = e;
                        // formData.values[0].color=e;
                      }}
                      placement="bottom"
                    />
                  )}
                </div>,
              ];
            }}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  );
};
//alwaysEnable

export default Form;
