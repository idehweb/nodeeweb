// @ts-nocheck
import {
  BooleanField,
  ChipField,
  Datagrid,
  downloadCSV,
  EditButton,
  EmailField,
  ExportButton,
  Filter,
  FilterList,
  FilterListItem,
  FunctionField,
  Pagination,
  ReferenceArrayField,
  SelectInput,
  ShowButton,
  SingleFieldList,
  TextField,
  TextInput,
  TopToolbar,
  useRefresh,
  useTranslate,
} from 'react-admin';

import { ImportButton } from 'react-admin-import-csv';
import MailIcon from '@mui/icons-material/MailOutline';

import jsonExport from 'jsonexport/dist';
import { Card, CardContent } from '@mui/material';

import { dateFormat } from '@/functions';
import { List } from '@/components';
import API from '@/functions/API';
import useFetch from '@/hooks/useFetch';

const PostFilter = (props) => {
  const translate = useTranslate();
  const WebAppConfigData = useFetch({ requestQuery: '/config/system' });

  const consumerStatusChoices = WebAppConfigData.data
    ? WebAppConfigData.data.data.consumer_status
    : [];

  return WebAppConfigData.isLoading ? (
    []
  ) : WebAppConfigData.error ? (
    <></>
  ) : (
    WebAppConfigData.data && (
      <Filter {...props}>
        <TextInput
          label={translate('resources.customers.firstName')}
          source="firstName"
          alwaysOn
        />
        <TextInput
          label={translate('resources.customers.lastName')}
          source="lastName"
          alwaysOn
        />
        <TextInput
          label={translate('resources.customers.phone')}
          source="phone"
          alwaysOn
        />
        <SelectInput
          label={translate('resources.settings.consumerStatus')}
          source="status.status"
          alwaysOn
          choices={consumerStatusChoices.map((obj) => {
            return {
              id: obj.key,
              name: obj.value,
              value: obj.key,
            };
          })}
        />
      </Filter>
    )
  );
};
import { useMediaQuery } from '@mui/material';

const PostPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />
);
const exporter = (customers) => {
  let allpros = [];
  const customerForExport = customers.map((customer) => {
    const { backlinks, author, ...customerForExport } = customer; // omit backlinks and author
    if (customer) {
      allpros.push({
        _id: customer._id,
        firstName: customer.firstName && customer.firstName,
        lastName: customer.lastName && customer.lastName,
        activationCode: customer.activationCode && customer.activationCode,
        email: customer.email && customer.email,
        internationalCode:
          customer.internationalCode && customer.internationalCode,
        source: customer.source && customer.source,
        credit: customer.credit && customer.credit,
        orderCount: customer.orderCount && customer.orderCount,
        active: customer.active && customer.active,
        createdAt: customer.createdAt && customer.createdAt,
      });
    }
    return customerForExport;
  });
  jsonExport(
    allpros,
    {
      headers: [
        '_id',
        'firstName',
        'lastName',
        'activationCode',
        'email',
        'internationalCode',
        'source',
        'credit',
        'orderCount',
        'active',
        'createdAt',
        'phone',
      ], // order fields in the export
    },
    (err, csv) => {
      const BOM = '\uFEFF';
      downloadCSV(`${BOM} ${csv}`, 'customers'); // download as 'posts.csv` file
    }
  );
};

const ListActions = (props) => {
  const refresh = useRefresh();
  // All configuration options are optional
  const config = {
    // Enable logging
    logging: true,
    // Disable "import new" button
    // disableImportNew: false,
    // Disable "import overwrite" button
    // disableImportOverwrite: false,
    // // A function to translate the CSV rows on import
    // preCommitCallback?: (action: "create" | "overwrite", values: any[]) => Promise<any[]>;
    // // A function to handle row errors after import
    // postCommitCallback?: (error: any) => void;
    // Transform rows before anything is sent to dataprovider
    transformRows: (csvRows) => {
      console.log('csvRows', csvRows);
      // let update = [], create = [];
      let array = [];
      let postsForExport = [];
      if (csvRows)
        postsForExport = csvRows.map((row) => {
          // console.log("row", row);

          row._id = row[' _id'];
          if (row._id)
            array.push({
              _id: row._id,
            });
          // if (!row.phone) row.phone = row.phoneNumber2; there is no such data as phoneNumber2 ?

          if (row.phone && row.phone.toString().length < 12) {
            if (row.phone.toString().length === 10) {
              row.phone = '98' + row.phone.toString();
            }
          }
          // else
          // delete row.photos;
          delete row[' _id'];
          delete row['id'];
          // row.title = {
          //   en: row.title_en,
          //   fa: row.title_fa,
          //   ru: row.title_ru,
          //   uz: row.title_uz
          // };
          delete row.title_en;
          delete row.title_ru;
          delete row.title_uz;
          delete row.createdAt;
          delete row.updatedAt;
          // if (row._id) {
          //     update.push(row);
          // } else {
          //     create.push(row);
          // }
          // if()

          return row;
        });
      // console.log("ForImport", postsForExport);
      API.post('/customer/import', JSON.stringify(postsForExport))
        .then(({ data = {} }) => {
          refresh();
          alert('it is ok');
          // window.location.reload();
          // if (data.success) {
          //   values = [];
          //   valuess = [];
          // }
        })
        .catch((err) => {
          console.log('error', err);
        });
    },
    validateRow: async (row) => {
      console.log('row', row);
      if (row.id) {
        // throw new Error("AAAA");
      }
    },
    postCommitCallback: (reportItems) => {
      console.log('reportItems', { reportItems });
    },
    // Async function to Validate a row, reject the promise if it's not valid
    parseConfig: {
      dynamicTyping: true,
      // complete: function(results, file) {
      //     console.log("Parsing complete:", results, file);
      // },
      // preview:1
    },
  };
  return (
    <TopToolbar>
      <ExportButton maxResults={10000000} />
      <ImportButton {...props} {...config} />
    </TopToolbar>
  );
};

const PostFilterSidebar = ({ childs }) => {
  return (
    <Card sx={{ order: -1, mt: 9, ml: 1, minWidth: 200 }}>
      <CardContent sx={{ p: 1 }}>
        <FilterList
          sx={{
            '& > div > div': {
              mr: 0,
              ml: 1,
              display: 'flex',
              alignItems: 'center',
            },
          }}
          label="status"
          icon={<MailIcon />}>
          {childs?.reverse().map((i, idx) => (
            <FilterListItem
              key={idx}
              label={i.key}
              value={{ status: i.value }}
            />
          ))}
        </FilterList>
      </CardContent>
    </Card>
  );
};
export const customerList = (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const WebAppConfigData = useFetch({ requestQuery: '/config/system' });

  console.log('web app config is ', WebAppConfigData);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const translate = useTranslate();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('768'), {
    noSsr: true,
  });
  return (
    <List
      exporter={exporter}
      {...props}
      filters={<PostFilter />}
      pagination={<PostPagination />}
      // aside={
      //   <PostFilterSidebar
      //     childs={WebAppConfigData.data.data.consumer_status}
      //   />
      // }
      actions={<ListActions />}>
      {isSmall ? (
        <Datagrid
          optimized
          bulkActionButtons={false}
          // rowStyle={postRowStyle}
        >
          <FunctionField
            label="resources.customers.customerData"
            render={(record) => {
              return (
                <>
                  <div className="ph">
                    <div className={'wh'}>
                      <span>{translate('resources.customers.phone')}: </span>
                      <TextField
                        source="phone"
                        label="resources.customers.phone"
                      />
                    </div>
                    <div className={'wh'}>
                      <span>
                        {translate('resources.customers.companyTelNumber')}:{' '}
                      </span>
                      <TextField
                        source="companyTelNumber"
                        label="resources.customers.companyTelNumber"
                      />
                    </div>
                    <div className={'wh'}>
                      <span>{translate('resources.customers.email')}: </span>
                      <EmailField
                        source="email"
                        label="resources.customers.email"
                      />
                    </div>
                    <div className={'wh'}>
                      <span>
                        {translate('resources.customers.activationCode')}:{' '}
                      </span>
                      <TextField
                        source="activationCode"
                        label="resources.customers.activationCode"
                      />
                    </div>
                  </div>
                  <div className="ph">
                    <div className={'wh'}>
                      <span>
                        {translate('resources.customers.firstName')}:{' '}
                      </span>
                      <TextField
                        source="firstName"
                        label="resources.customers.firstName"
                      />
                    </div>
                    <div className={'wh'}>
                      <span>{translate('resources.customers.lastName')}: </span>
                      <TextField
                        source="lastName"
                        label="resources.customers.lastName"
                      />
                    </div>
                    <div className={'wh'}>
                      <span>
                        {translate('resources.customers.companyName')}:{' '}
                      </span>
                      <TextField
                        source="companyName"
                        label="resources.customers.companyName"
                      />
                    </div>
                  </div>
                  <div className="theDate">
                    <div>
                      {translate('resources.customers.createdAt')}:
                      <span dir="ltr"> {dateFormat(record.createdAt)}</span>
                    </div>
                    <div>
                      {translate('resources.customers.updatedAt')}:
                      <span dir="ltr"> {dateFormat(record.updatedAt)}</span>
                    </div>

                    {Boolean(record.orderCount) && (
                      <div>
                        {translate('resources.customers.orderCount') +
                          ': ' +
                          `${record.orderCount}`}
                      </div>
                    )}
                  </div>
                  <>
                    <EditButton />
                    <ShowButton />
                  </>
                </>
              );
            }}
          />
        </Datagrid>
      ) : (
        <Datagrid>
          <FunctionField
            label="resources.customers.contactData"
            render={(record) => {
              return (
                <div className="ph">
                  <div className={'wh'}>
                    <span>{translate('resources.customers.phone')}: </span>
                    <TextField
                      source="phone"
                      label="resources.customers.phone"
                    />
                  </div>
                  <div className={'wh'}>
                    <span>
                      {translate('resources.customers.companyTelNumber')}:{' '}
                    </span>
                    <TextField
                      source="companyTelNumber"
                      label="resources.customers.companyTelNumber"
                    />
                  </div>
                  <div className={'wh'}>
                    <span>{translate('resources.customers.email')}: </span>
                    <EmailField
                      source="email"
                      label="resources.customers.email"
                    />
                  </div>
                  <div className={'wh'}>
                    <span>
                      {translate('resources.customers.activationCode')}:{' '}
                    </span>
                    <TextField
                      source="activationCode"
                      label="resources.customers.activationCode"
                    />
                  </div>
                </div>
              );
            }}
          />

          <FunctionField
            label="resources.customers.customerData"
            render={(record) => {
              return (
                <div className="ph">
                  <div className={'wh'}>
                    <span>{translate('resources.customers.firstName')}: </span>
                    <TextField
                      source="firstName"
                      label="resources.customers.firstName"
                    />
                  </div>
                  <div className={'wh'}>
                    <span>{translate('resources.customers.lastName')}: </span>
                    <TextField
                      source="lastName"
                      label="resources.customers.lastName"
                    />
                  </div>
                  <div className={'wh'}>
                    <span>
                      {translate('resources.customers.companyName')}:{' '}
                    </span>
                    <TextField
                      source="companyName"
                      label="resources.customers.companyName"
                    />
                  </div>
                </div>
              );
            }}
          />

          <TextField source="source" label="resources.customers.source" />
          <ReferenceArrayField
            label="resources.customers.customerGroup"
            reference="customerGroup"
            source="customerGroup">
            <SingleFieldList>
              <ChipField source="slug" />
            </SingleFieldList>
          </ReferenceArrayField>

          <FunctionField
            label="resources.customers.status"
            render={(record) => {
              // const arr = record.status || [];
              // const len = arr.length || 0;
              // const item = arr[len - 1] || {};

              return (
                <div className="theDate">
                  {record.status &&
                    record.status.map((elem, i) => (
                      <div key={Math.floor(Math.random() * i)}>
                        {elem.status}
                      </div>
                    ))}

                  {/* {item.status && returnStatus(item.status)} */}
                </div>
              );
            }}
          />
          <FunctionField
            label="resources.customers.date"
            render={(record) => {
              return (
                <div className="theDate">
                  <div>
                    {translate('resources.customers.createdAt')}:
                    <span dir="ltr"> {dateFormat(record.createdAt)}</span>
                  </div>
                  <div>
                    {translate('resources.customers.updatedAt')}:
                    <span dir="ltr"> {dateFormat(record.updatedAt)}</span>
                  </div>

                  {Boolean(record.orderCount) && (
                    <div>
                      {translate('resources.customers.orderCount') +
                        ': ' +
                        `${record.orderCount}`}
                    </div>
                  )}
                </div>
              );
            }}
          />

          <BooleanField source="active" label="resources.customers.active" />
          <FunctionField
            label="resources.product.edit"
            render={(record) => (
              <>
                <EditButton />
                <ShowButton />
              </>
            )}
          />
        </Datagrid>
      )}
    </List>
  );
};

export default customerList;
