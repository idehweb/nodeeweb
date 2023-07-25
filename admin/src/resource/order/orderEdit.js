import {
  ArrayField,
  Datagrid,
  Edit,
  FunctionField,
  SelectInput,
  Show,
  SimpleShowLayout,
  TextField,
  TextInput,
  useTranslate,
} from 'react-admin';
import { Box, Chip } from '@mui/material';

import Button from '@mui/material/Button';
import { HelpRounded } from '@mui/icons-material';

import CardActions from '@mui/material/CardActions';

import React from 'react';

import { useEditController } from 'react-admin';

import {
  List,
  OrderPaymentStatus,
  OrderStatus,
  PrintOrder,
  PrintPack,
  SimpleForm,
  Transactions,
} from '@/components';
import { dateFormat } from '@/functions';
import { BASE_URL } from '@/functions/API';
import TransactionCreate from '@/components/TransactionCreate';


export const orderEdit = (props) => {
  console.log('props', props);
  const translate = useTranslate();
  const { id } = props;
  const [state, setState] = React.useState('start');

  const { record, save, isLoading } = useEditController({
    resource: 'order',
    id,
  });
  const PostEditActions = ({ basePath, data, resource }) => (
    <CardActions>
      <TransactionCreate record={record} />
      <Button
        color="primary"
        icon={<HelpRounded />}
        onClick={() => {
          setState('print');
        }}>
        پرینت فاکتور
      </Button>
      <Button
        color="primary"
        icon={<HelpRounded />}
        onClick={() => {
          setState('printpack');
        }}>
        پرینت رسید حمل و نقل
      </Button>
    </CardActions>
  );
  return [
    <Show actions={<PostEditActions />} {...props}>
      {/*<div id={'theprintdiv'}>*/}

      <SimpleShowLayout>
        {state == 'start' && [
          <Box>
            <TextField source="orderNumber" label={'شماره سفارش'} />
            ,
            <FunctionField
              label="نام"
              render={(record) =>
                `${record.customer_data && record.customer_data.firstName}`
              }
            />
            ,
            <FunctionField
              label="نام خانوادگی"
              render={(record) =>
                `${record.customer_data && record.customer_data.firstName}`
              }
            />
            ,
            <ArrayField source="card" label={'محتوای سبد خرید'}>
              <Datagrid optimized>
                <FunctionField
                  label="عنوان محصول"
                  render={(record) => {
                    let link = record._id;
                    var c = record._id.split('DDD');
                    if (c[0]) {
                      link = c[0];
                    }
                    return (
                      <a
                        target={'_blank'}
                        href={'/#/product/' + link + '/show'} rel="noreferrer">
                        {record.title &&
                          (record.title.fa ? record.title.fa : record.title)}
                      </a>
                    );
                  }}
                />

                <FunctionField
                  label="قیمت"
                  render={(record) =>
                    `${
                      record.price
                        ? record.price
                            .toString()
                            .replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')
                        : ''
                    }`
                  }
                />
                <FunctionField
                  label="قیمت با تخفیف"
                  render={(record) =>
                    `${
                      record.salePrice
                        ? record.salePrice
                            .toString()
                            .replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')
                        : ''
                    }`
                  }
                />
              </Datagrid>
            </ArrayField>
          </Box>,
        ]}
        {state == 'print' && <PrintOrder record={record} />}
        {state == 'printpack' && <PrintPack record={record} />}
      </SimpleShowLayout>
    </Show>,
    <Edit {...props}>
      <SimpleForm>
        {state == 'start' && [
          ,
          <TextInput
            source="customer_data.internationalCode"
            label={'کد ملی'}
          />,
          <FunctionField
            label="شماره تماس مشتری"
            render={(record) =>
              `${record.customer_data && record.customer_data.phoneNumber}`
            }
          />,

          // <FunctionField label="پرداختی کل"
          //                render={record => record.amount.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}/>
          // ,
          <TextField
            source="billingAddress.Title"
            label={'عنوان آدرس'}
            fullWidth
          />,
          <TextInput
            source="billingAddress.PhoneNumber"
            label={'شماره تماس ارسال'}
            fullWidth
          />,
          <TextInput source="billingAddress.State" label={'استان'} fullWidth />,
          <TextInput source="billingAddress.City" label={'شهر'} fullWidth />,
          <TextInput
            source="billingAddress.StreetAddress"
            label={'آدرس'}
            fullWidth
          />,
          <TextInput
            source="billingAddress.PostalCode"
            label={'کد پستی'}
            fullWidth
          />,
          <TextInput
            source="customer_data.phoneNumber"
            label={'شماره موبایل مشتری'}
            fullWidth
          />,
          <TextInput
            source="deliveryDay.description"
            label={'توضیحات ارسال'}
            fullWidth
          />,
          <TextInput
            source="deliveryDay.title"
            label={'نحوه ارسال'}
            fullWidth
          />,
          <FunctionField
            label={translate('resources.order.paymentStatus')}
            render={(record) => {
              return (
                <Chip
                  source="paymentStatus"
                  className={record.paymentStatus}
                  label={translate(
                    'pos.OrderPaymentStatus.' + record.paymentStatus
                  )}
                />
              );
            }}
          />,
        ]}
        {/*<TextInput disabled source="id"/>*/}
        <SelectInput
          label={translate('resources.order.paymentStatus')}
          fullWidth
          className={'mb-20'}
          source="paymentStatus"
          optionValue="id"
          optionText="name"
          choices={OrderPaymentStatus()}
          translateChoice={true}
        />
        <SelectInput
          label={translate('resources.order.status')}
          fullWidth
          className={'mb-20'}
          source="status"
          choices={OrderStatus()}
        />
        <TextInput
          fullWidth
          // record={scopedFormData}

          source={'amount'}
          className={'ltr'}
          label={translate('resources.order.amount')}
          format={(v) => {
            if (!v) return '';

            return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }}
          parse={(v) => {
            if (!v) return '';

            return v.toString().replace(/,/g, '');
          }}
        />
        {/*<TextField source="status"/>*/}
        {/*<TextField source="sum"/>*/}
        {/*<TextField source="customer_data.country"/>*/}
        {/*<TextField source="customer_data.ip"/>*/}
        {/*<DateField source="updatedAt"/>*/}
      </SimpleForm>
      <FunctionField
        label={translate('resources.customers.transactions')}
        render={(record) => <Transactions record={record} />}
      />
    </Edit>,
  ];
};

export default orderEdit;
