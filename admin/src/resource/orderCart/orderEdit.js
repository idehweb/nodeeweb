import {
  ArrayField,
  BooleanField,
  Create,
  Datagrid,
  DateField,
  Edit,
  EditButton,
  Filter,
  FunctionField,
  ListContextProvider,
  NumberField,
  NumberInput,
  Pagination,
  ReferenceField,
  SearchInput,
  SelectField,
  SelectInput,
  Show,
  ShowButton,
  SimpleList,
  SimpleShowLayout,
  TextField,
  TextInput,
  TopToolbar,
  useListContext,
} from 'react-admin';
import { Box, Chip, Divider, Tab, Tabs } from '@mui/material';
import Button from '@mui/material/Button';
import { useMediaQuery } from '@mui/material';
import { HelpRounded, Receipt } from '@mui/icons-material';

import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { makeStyles } from '@mui/styles';

import {
  List,
  PrintOrder,
  PrintPack,
  SimpleForm,
  OrderPaymentStatus,
  OrderStatus,
} from '@/components';
import { dateFormat } from '@/functions';
import API, { BASE_URL } from '@/functions/API';


const ListActions = () => (
  <Box width="100%">
    <TopToolbar>
      {/*<PostFilterButton />*/}
      {/*<ExportButton />*/}
    </TopToolbar>
    {/*<PostFilterForm />*/}
  </Box>
);
const PostPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />
);
const StatusField = ({ record }) => {
  console.log('record', record);
  return <Chip className={record.color} label={record.name}></Chip>;
};

export const orderList = (props) => {
  return (
    <List
      {...props}
      filters={
        <Filter {...props}>
          <SearchInput
            source="search"
            placeholder={'شماره سفارش یا موبایل'}
            alwaysOn
          />
          <TextInput
            source="firstName"
            label={'نام مشتری'}
            placeholder={'نام'}
          />
          <TextInput
            source="lastName"
            label={'نام خانوادگی'}
            placeholder={'نام خانوادگی'}
          />
          <SelectInput
            source="status"
            label={'وضعیت سفارش'}
            emptyValue={null}
            choices={OrderStatus()}
            alwaysOn
          />
          <SelectInput
            source="paymentStatus"
            label={'وضعیت پرداخت'}
            emptyValue={null}
            choices={OrderPaymentStatus()}
            alwaysOn
          />
          {/*<BooleanInput source="is_published" alwaysOn />*/}
        </Filter>
      }
      pagination={<PostPagination />}>
      <Datagrid optimized>
        {/*<TextField source="id"/>*/}
        <ReferenceField label="مشتری" source="customer" reference="customer">
          <TextField source="phoneNumber" />
          {/*<TextField source="firstName" />*/}
          {/*<TextField source="lastName" />*/}
        </ReferenceField>
        <TextField source="customer_data.firstName" label={'نام'} />
        <TextField source="customer_data.lastName" label={'نام خانوادگی'} />
        <TextField source="orderNumber" label={'شماره سفارش'} />
        <NumberField source="sum" label={'مجموع سفارش'} />
        <NumberField source="amount" label={'پرداختی'} />
        {/*<ReferenceManyField label="customer" reference="customer" target="countryCode">*/}
        {/*<SingleFieldList>*/}
        {/*<ChipField source="countryCode" />*/}
        {/*</SingleFieldList>*/}
        {/*</ReferenceManyField>*/}

        {/*<TextField label="ip" source="customer_data.ip" />*/}
        {/*<TextField label="کشور" source="customer_data.country" />*/}
        <SelectField
          source="status"
          choices={OrderStatus()}
          label="وضعیت سفارش"
          optionText={<StatusField />}
        />
        <SelectField
          source="paymentStatus"
          choices={OrderPaymentStatus()}
          label="وضعیت پرداخت"
          optionText={<StatusField />}
        />

        {/*<TextField source="status" label={'وضعیت سفارش'}/>*/}
        <FunctionField
          label="منتشر شده در"
          render={(record) => `${dateFormat(record.createdAt)}`}
        />
        <FunctionField
          label="بروزرسانی شده در"
          render={(record) => `${dateFormat(record.updatedAt)}`}
        />

        {/*<BooleanField source="active" />*/}
        <EditButton />
        {/*<ShowButton/>*/}
      </Datagrid>
    </List>
  );
};

export const orderEdit = (props) => {
  const [state, setState] = React.useState('start');
  return [
    <Show {...props}>
      {/*<div id={'theprintdiv'}>*/}

      <SimpleShowLayout>
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

        {state == 'start' && [
          <TextField source="orderNumber" label={'شماره سفارش'} />,
          <FunctionField
            label="نام"
            render={(record) =>
              `${
                record.customer &&
                (record.customer.firstName || record.customer_data.firstName)
              }`
            }
          />,

          <FunctionField
            label="نام خانوادگی"
            render={(record) =>
              `${
                record.customer &&
                (record.customer.lastName || record.customer_data.firstName)
              }`
            }
          />,
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
                    <a target={'_blank'} href={'/#/product/' + link + '/show'} rel="noreferrer">
                      {record.title.fa}
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
          </ArrayField>,
        ]}
        {state == 'print' && <PrintOrder />}
        {state == 'printpack' && <PrintPack />}
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
              `${
                record.customer &&
                (record.customer.phoneNumber ||
                  record.customer_data.phoneNumber)
              }`
            }
          />,
          <FunctionField
            label="پرداختی کل"
            render={(record) =>
              record.amount.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')
            }
          />,
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
          <TextField source="paymentStatus" label={'وضعیت پرداخت'} fullWidth />,
        ]}
        <TextInput disabled source="id" />
        {/*<ReferenceField*/}
        {/*label="customerWebsite"*/}
        {/*source="customer"*/}
        {/*reference="customer">*/}
        {/*<TextField source="phoneNumber"/>*/}
        {/*<TextField source="firstName"/>*/}
        {/*<TextField source="lastName"/>*/}
        {/*</ReferenceField>*/}
        {/*<TextField source="customer"/>*/}
        {/*<TextField source="Authority"/>*/}
        {/*<TextField source="amount"/>*/}
        {/*<TextField source="orderNumber"/>*/}
        {/*<TextField source="paymentStatus"/>*/}

        <SelectInput
          label="وضعیت پرداخت"
          fullWidth
          className={'mb-20'}
          source="paymentStatus"
          choices={OrderPaymentStatus()}
        />
        <SelectInput
          label="وضعیت سفارش"
          fullWidth
          className={'mb-20'}
          source="status"
          choices={OrderStatus()}
        />
        {/*<TextField source="status"/>*/}
        {/*<TextField source="sum"/>*/}
        {/*<TextField source="customer_data.country"/>*/}
        {/*<TextField source="customer_data.ip"/>*/}
        {/*<DateField source="updatedAt"/>*/}
      </SimpleForm>
    </Edit>,
  ];
};

function save(values) {
  API.post('/order/', JSON.stringify({ ...values }))
    .then(({ data = {} }) => {
      // alert('it is ok');

      if (data.success) {
        // values = [];
        // data.url = [];
        var theUrl = document.getElementById('theUrl');
        theUrl.value = data.url;
      }
    })
    .catch((err) => {
      console.log('error', err);
    });
}

const Form = ({ children, ...props }) => {
  return (
    <SimpleForm {...props} onSubmit={save} className={'d-flex'}>
      <NumberInput
        source="amount"
        label="پرداختی"
        className={'width100 mb-20 ltr'}
      />
      <input id={'theUrl'}></input>
      {children}
    </SimpleForm>
  );
};

const create = (props) => (
  <Create {...props}>
    <Form></Form>
  </Create>
);
//
// export const orderCreate = props => (
//   <Create {...props}>
//     <SimpleForm>
//       <TextInput source="name"/>
//       <TextInput source="from"/>
//       <TextInput source="passengers"/>
//       <TextInput source="luggage"/>
//       <TextInput multiline source="description"/>
//     </SimpleForm>
//   </Create>
// )

const PostShowActions = ({ basePath, data, resource }) => (
  <TopToolbar>
    <EditButton record={data} />
    {/* Add your custom actions */}
  </TopToolbar>
);

export const orderShow = (props) => {
  const [state, setState] = React.useState('start');

  return (
    <Show actions={<PostShowActions />} {...props}>
      {/*<div id={'theprintdiv'}>*/}

      <SimpleShowLayout>
        <Button
          color="primary"
          icon={<HelpRounded />}
          onClick={() => {
            setState('print');
          }}>
          پرینت فاکتور
        </Button>
        ,
        <Button
          color="primary"
          icon={<HelpRounded />}
          onClick={() => {
            setState('printpack');
          }}>
          پرینت رسید حمل و نقل
        </Button>
        ,
        {state == 'start' && [
          <TextField source="customer.firstName" label={'نام'} />,
          <TextField source="customer_data.firstName" label={'نام'} />,
          <TextField source="customer.lastName" label={'نام خانوادگی'} />,
          <TextField source="customer_data.lastName" label={'نام خانوادگی'} />,
          <TextField
            source="customer_data.internationalCode"
            label={'کد ملی'}
          />,
          <TextField
            source="customer.phoneNumber"
            label={'شماره تماس مشتری'}
          />,
          <TextField
            source="customer_data.phoneNumber"
            label={'شماره تماس مشتری'}
          />,

          <TextField source="orderNumber" />,
          <TextField source="amount" label={'مجموع'} />,
          <ArrayField source="card" label={'محتوای سبد خرید'}>
            <Datagrid optimized>
              <TextField source="title.fa" label={'عنوان محصول'} />
              <TextField source="price" label={'قیمت'} />
              <TextField source="salePrice" label={'قیمت با تخفیف'} />
            </Datagrid>
          </ArrayField>,
          <TextField source="billingAddress.Title" label={'عنوان آدرس'} />,
          <TextField
            source="billingAddress.PhoneNumber"
            label={'شماره تماس ارسال'}
          />,
          <TextField source="billingAddress.State" label={'استان'} />,
          <TextField source="billingAddress.City" label={'شهر'} />,
          <TextField source="billingAddress.StreetAddress" label={'آدرس'} />,
          <TextField source="billingAddress.PostalCode" label={'کد پستی'} />,
          <TextField source="billingAddress.map" label={'نقشه'} />,
          <TextField
            source="customer_data.phoneNumber"
            label={'شماره موبایل مشتری'}
          />,
          <TextField
            source="deliveryDay.description"
            label={'توضیحات ارسال'}
          />,
          <TextField source="deliveryDay.title" label={'نحوه ارسال'} />,
          <TextField source="paymentStatus" label={'وضعیت پرداخت'} />,
        ]}
        {state == 'print' && <PrintOrder />}
        {state == 'printpack' && <PrintPack />}
      </SimpleShowLayout>
    </Show>
  );
};

const TabbedDatagrid = (props) => {
  const listContext = useListContext();
  const { ids, filterValues, setFilters, displayedFilters } = listContext;
  const classes = useDatagridStyles();

  const [cart, setCart] = useState([]);
  const [checkout, setCheckout] = useState([]);

  const totals = 0;

  useEffect(() => {
    if (ids && ids !== filterValues.status) {
      switch (filterValues.status) {
        case 'cart':
          setCart(ids);
          break;
        case 'checkout':
          setCheckout(ids);
          break;
      }
    }
  }, [ids, filterValues.status]);

  const handleChange = useCallback(
    (event, value) => {
      setFilters &&
        setFilters({ ...filterValues, status: value }, displayedFilters);
    },
    [displayedFilters, filterValues, setFilters]
  );

  const selectedIds =
    filterValues.status === 'cart'
      ? cart
      : filterValues.status === 'checkout'
      ? checkout
      : cart;

  return (
    <Fragment>
      <Tabs
        variant="fullWidth"
        centered
        value={filterValues.status}
        indicatorColor="primary"
        onChange={handleChange}>
        {tabs.map((choice) => (
          <Tab
            key={choice.id}
            label={
              totals[choice.name]
                ? `${choice.name} (${totals[choice.name]})`
                : choice.name
            }
            value={choice.id}
          />
        ))}
      </Tabs>
      <Divider />

      <div>
        {/*{filterValues.status === 'cart' && (*/}
        <ListContextProvider value={{ ...listContext, ids: cart }}>
          <Responsive
            small={
              <SimpleList
                className={'mobile-view-order'}
                primaryText={(record) => {
                  if (record && record.amount)
                    return (
                      record.amount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' تومان'
                    );
                  else return '';
                }}
                secondaryText={(record) => {
                  if (record && record.updatedAt)
                    return dateFormat(record.updatedAt);
                  else return '';
                }}
                tertiaryText={(record) => {
                  if (record && record.orderNumber)
                    return `#${record.orderNumber}`;
                  else return '';
                }}
              />
            }
            medium={
              <Datagrid {...props} optimized rowClick="edit">
                {/*<TextField source="id"/>*/}
                <TextField source="orderNumber" label={'شماره سفارش'} />

                <FunctionField
                  label="اطلاعات مشتری"
                  render={(record) => (
                    <div className="theDate">
                      {record.customer && (
                        <div>
                          {record.customer.firstName && (
                            <div>{record.customer.firstName}</div>
                          )}
                          {!record.customer.firstName &&
                            record.customer_data.firstName && (
                              <div>{record.customer_data.firstName}</div>
                            )}

                          {record.customer.lastName && (
                            <div>{record.customer.lastName}</div>
                          )}
                          {!record.customer.lastName &&
                            record.customer_data.lastName && (
                              <div>{record.customer_data.lastName}</div>
                            )}
                          {record.customer.phoneNumber && (
                            <a href={'/#/customer/' + record.customer._id}>
                              {record.customer.phoneNumber}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                />
                <NumberField source="sum" label={'مجموع سفارش'} />
                <NumberField source="amount" label={'پرداختی'} />
                {/*<ReferenceManyField label="customer" reference="customer" target="countryCode">*/}
                {/*<SingleFieldList>*/}
                {/*<ChipField source="countryCode" />*/}
                {/*</SingleFieldList>*/}
                {/*</ReferenceManyField>*/}

                {/*<TextField label="ip" source="customer_data.ip" />*/}
                {/*<TextField label="کشور" source="customer_data.country" />*/}
                <SelectField
                  source="status"
                  choices={OrderStatus()}
                  label="وضعیت سفارش"
                  optionText={<StatusField />}
                />
                <SelectField
                  source="paymentStatus"
                  choices={OrderPaymentStatus()}
                  label="وضعیت پرداخت"
                  optionText={<StatusField />}
                />

                {/*<TextField source="status" label={'وضعیت سفارش'}/>*/}
                <FunctionField
                  label="منتشر شده در"
                  render={(record) => `${dateFormat(record.createdAt)}`}
                />
                <FunctionField
                  label="بروزرسانی شده در"
                  render={(record) => `${dateFormat(record.updatedAt)}`}
                />

                {/*<BooleanField source="active" />*/}
                <EditButton />
              </Datagrid>
            }
          />
        </ListContextProvider>
        {/*)}*/}
      </div>
    </Fragment>
  );
};

const useDatagridStyles = makeStyles({
  total: { fontWeight: 'bold' },
});

const tabs = [
  { id: 'cart', name: 'سبد خرید' },
  { id: 'checkout', name: 'در حال ثبت سفارش' },
];
const orderFilters = [
  <SearchInput source="q" alwaysOn />,

  <TextInput source="total_gte" />,
  {
    /*<NullableBooleanInput source="returned" />,*/
  },
];

const orderList2 = (props) => (
  <List
    {...props}
    filters={
      <Filter {...props}>
        <SearchInput
          source="search"
          placeholder={'شماره سفارش یا موبایل'}
          alwaysOn
        />
        <TextInput source="firstName" label={'نام مشتری'} placeholder={'نام'} />
        <TextInput
          source="lastName"
          label={'نام خانوادگی'}
          placeholder={'نام خانوادگی'}
        />
        <SelectInput
          source="status"
          label={'وضعیت سفارش'}
          emptyValue={null}
          choices={OrderStatus()}
          alwaysOn
        />
        {/*<SelectInput source="paymentStatus" label={'وضعیت پرداخت'}  emptyValue={null}*/}
        {/*choices={typeChoices3} alwaysOn/>*/}
        {/*<BooleanInput source="is_published" alwaysOn />*/}
      </Filter>
    }
    pagination={<PostPagination />}>
    <TabbedDatagrid />
  </List>
);
export default orderEdit;
// export default {
//     list: orderList2,
//     edit: orderEdit,
//     // create: create,
//     icon: Receipt,
//     // createIcon: AddShoppingCartOutlined,
//
// };
