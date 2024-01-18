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

  return (
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
    </Filter>
  );
};

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

  return WebAppConfigData.isLoading ? (
    []
  ) : WebAppConfigData.error ? (
    <></>
  ) : (
    WebAppConfigData.data && (
      <List
        exporter={exporter}
        {...props}
        filters={<PostFilter />}
        pagination={<PostPagination />}
        aside={
          <PostFilterSidebar
            childs={WebAppConfigData.data.data.consumer_status}
          />
        }
        actions={<ListActions />}>
        <Datagrid>
          <TextField
            source="phone"
            label={translate('resources.customers.phone')}
          />
          <TextField
            source="activationCode"
            label={translate('resources.customers.activationCode')}
          />
          <TextField
            source="firstName"
            label={translate('resources.customers.firstName')}
          />
          <TextField
            source="lastName"
            label={translate('resources.customers.lastName')}
          />
          <EmailField
            source="email"
            label={translate('resources.customers.email')}
          />
          <TextField
            source="internationalCode"
            label={translate('resources.customers.internationalCode')}
          />
          <TextField
            source="source"
            label={translate('resources.customers.source')}
          />
          <ReferenceArrayField
            label={translate('resources.customers.customerGroup')}
            reference="customerGroup"
            source="customerGroup">
            <SingleFieldList>
              <ChipField source="slug" />
            </SingleFieldList>
          </ReferenceArrayField>
          {/*<FunctionField label={translate("resources.customer.customerGroup")}*/}
          {/*render={record => {*/}

          {/*return (*/}
          {/*<div className={"categories"}>*/}
          {/*{record.customerGroup && record.customerGroup.map((item, it) => <div>*/}
          {/*<ChipField source={"customerGroup[" + it + "].slug"} label={item.slug}*/}
          {/*sortable={false}/>*/}
          {/*</div>)}*/}

          {/*</div>*/}
          {/*);*/}
          {/*}}/>*/}
          <FunctionField
            label={translate('resources.customers.date')}
            render={(record) => {
              return (
                <div className="theDate">
                  <div>
                    {translate('resources.customers.createdAt') +
                      ': ' +
                      `${dateFormat(record.createdAt)}`}
                  </div>
                  <div>
                    {translate('resources.customers.updatedAt') +
                      ': ' +
                      `${dateFormat(record.updatedAt)}`}
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

          <BooleanField
            source="active"
            label={translate('resources.customers.active')}
          />
          <FunctionField
            label={translate('resources.product.edit')}
            render={(record) => (
              <>
                <EditButton />
                <ShowButton />
              </>
            )}
          />
        </Datagrid>
      </List>
    )
  );
};

export default customerList;
