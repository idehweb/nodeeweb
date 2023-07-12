import {
  BooleanField,
  ChipField,
  Datagrid,
  downloadCSV,
  EditButton,
  EmailField,
  ExportButton,
  Filter,
  FunctionField,
  NumberField,
  Pagination,
  ReferenceArrayField,
  ShowButton,
  SingleFieldList,
  TextField,
  TextInput,
  TopToolbar,
  useTranslate,
} from 'react-admin';

import { ImportButton } from 'react-admin-import-csv';

import jsonExport from 'jsonexport/dist';

import { dateFormat } from '@/functions';
import { List, SimpleForm } from '@/components';
import API, { BASE_URL } from '@/functions/API';


const PostFilter = (props) => {
  const translate = useTranslate();

  return [
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
        label={translate('resources.customers.phoneNumber')}
        source="phoneNumber"
        alwaysOn
      />
    </Filter>,
  ];
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
      ], // order fields in the export
    },
    (err, csv) => {
      const BOM = '\uFEFF';
      downloadCSV(`${BOM} ${csv}`, 'customers'); // download as 'posts.csv` file
    }
  );
};

const ListActions = (props) => {
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
          if (!row.phoneNumber) row.phoneNumber = row.phoneNumber2;

          if (row.phoneNumber && row.phoneNumber.toString().length < 12) {
            if (row.phoneNumber.toString().length === 10) {
              row.phoneNumber = '98' + row.phoneNumber.toString();
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
          const refresh = useRefresh();
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
export const customerList = (props) => {
  const translate = useTranslate();
  return (
    <List
      exporter={exporter}
      {...props}
      filters={<PostFilter />}
      pagination={<PostPagination />}
      actions={<ListActions />}>
      <Datagrid>
        <NumberField
          source="phoneNumber"
          label={translate('resources.customers.phoneNumber')}
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
  );
};

export default customerList;
