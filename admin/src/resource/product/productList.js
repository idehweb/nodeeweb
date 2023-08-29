import {
  AutocompleteInput,
  ChipField,
  CreateButton,
  Datagrid,
  downloadCSV,
  EditButton,
  ExportButton,
  Filter,
  FunctionField,
  ListContextProvider,
  Pagination,
  ReferenceInput,
  SearchInput,
  TopToolbar,
  TextField,
  useTranslate,
} from 'react-admin';
import { ImportButton } from 'react-admin-import-csv';

import jsonExport from 'jsonexport/dist';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

import { Button, Chip, Divider, Tab, Tabs } from '@mui/material';

import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useListContext } from 'react-admin';
import { makeStyles } from '@mui/styles';

import {
  CatRefField,
  EditOptions,
  FileChips,
  List,
  ShowDescription,
  ShowLink,
  ShowOptions,
  ShowPictures,
  SimpleForm,
  SimpleImageField,
  UploaderField,
} from '@/components';
import { dateFormat } from '@/functions';
import API, { BASE_URL } from '@/functions/API';
import ProductRewriteButton from '@/components/ProductRewriteButton';

const PostPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />
);

const postRowStyle = (record, index) => {
  // const classes = useStyles();
  // console.log('useStyles',classes.productItem);
  return {
    backgroundColor: record.type === 'variable' ? '#9f9f9f' : '#fbe4ff',
  };
};

const PostFilter = (props) => {
  const translate = useTranslate();

  return (
    <Filter {...props}>
      {/*<TextInput label="Search" source="search" alwaysOn/>*/}
      <SearchInput
        source="Search"
        placeholder={translate('resources.product.search')}
        alwaysOn
      />
      {/*<ReferenceField label="Category" source="user_id" reference="category">*/}
      {/*<SearchInput source="category" placeholder={translate('resources.product.category')} alwaysOn/>*/}
      {/*</ReferenceField>*/}
      <ReferenceInput
        perPage={1000}
        label={translate('resources.product.category')}
        source="category"
        reference="category"
        alwaysOn>
        <AutocompleteInput optionText={'name.' + translate('lan')} />
      </ReferenceInput>
      {/*<SearchInput source="firstCategory" placeholder={'نام'} alwaysOn/>*/}
      {/*<SearchInput source="lastName" placeholder={'نام خانوادگی'} alwaysOn/>*/}
      {/*<SelectInput source="firstCategory" label={'دسته بندی اول'}  emptyValue={null} choices={typeChoices4}/>*/}
      {/*<SelectInput source="secondCategory" label={'دسته بندی دوم'}  emptyValue={null} choices={typeChoices3}/>*/}
      {/*<SelectInput source="thirdCategory" label={'دسته بندی سوم'}  emptyValue={null} choices={typeChoices3}/>*/}
    </Filter>
  );
};
const exporter = (posts) => {
  // console.clear();
  let allpros = [];
  let cats = [];
  console.log('postspostsposts', posts);
  const postsForExport = posts.map((post, i) => {
    cats = [];
    const { backlinks, author, ...postForExport } = post; // omit backlinks and author
    postForExport._id = post._id; // add a field
    // postForExport.maxResults  = 10000;
    if (post.productCategory) {
      post.productCategory.map((cat, ci) => {
        cats.push(cat.slug);
      });
    }

    if (post.title) postForExport.title = post.title.fa; // add a field
    postForExport.type = post.type; // add a field
    // postForExport.combinations = post.combinations; // add a field
    if (post.type == 'variable') {
      // postForExport.price=[];
      // postForExport.salePrice=[];
      // postForExport.in_stock=[];
      // postForExport.quantity=[];
      // allpros.pop();
      post.combinations.map((com, i) => {
        allpros.push({
          _id: post._id,
          slug: postForExport.slug,
          title: postForExport.title,
          description: post && post.description && post.description.fa,
          category: cats,
          price: com.price,
          salePrice: com.salePrice,
          in_stock: com.in_stock,
          quantity: com.quantity,
          type: post.type,
          options: com.options ? Object.values(com.options).toString() : '',
          combination_id: i + 1,
        });
      });
    } else {
      allpros.push({
        _id: post._id,
        slug: post.slug,
        title: postForExport.title,
        description: post && post.description && post.description.fa,
        category: cats,
        price: post.price,
        salePrice: post.salePrice,
        in_stock: post.in_stock,
        quantity: post.quantity,
        type: post.type,
      });
    }
  });
  jsonExport(
    allpros,
    {
      headers: [
        '_id',
        'slug',
        'title',
        'description',
        'category',
        'type',
        'price',
        'salePrice',
        'in_stock',
        'quantity',
      ], // order fields in the export
    },
    (err, csv) => {
      const BOM = '\uFEFF';
      downloadCSV(`${BOM} ${csv}`, 'products'); // download as 'posts.csv` file
    }
  );
};

const ListActions = (props) => {
  let { basePath, data, resource } = props;
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
      const postsForExport = csvRows.map((row) => {
        console.log('row', row);

        row._id = row[' _id'];
        if (row._id)
          array.push({
            _id: row._id,
          });
        // else
        // delete row.photos;
        delete row[' _id'];
        delete row['id'];
        delete row.firstCategory_name_ru;
        delete row.secondCategory_name_ru;
        delete row.thirdCategory_name_ru;
        row.title = {
          en: row.title_en,
          fa: row.title_fa,
          ru: row.title_ru,
          uz: row.title_uz,
        };
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
      console.log('ForImport', postsForExport);
      // API.post('/product/importproductsfromcsv', JSON.stringify(postsForExport))
      //     .then(({data = {}}) => {
      // const refresh = useRefresh();
      // refresh();
      // alert('it is ok');
      // window.location.reload();
      // if (data.success) {
      //     values = [];
      //     valuess = [];
      // }
      // })
      // .catch((err) => {
      //     console.log('error', err);
      // });
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
      {/*<FilterButton/>*/}
      <CreateButton />
      <ExportButton maxResults={3000} />
      {/*<CreateButton basePath={basePath} />*/}
      <ImportButton {...props} {...config} />
      <ProductRewriteButton record={data} />
      {/* Add your custom actions */}

      {/*<Button*/}
      {/*onClick={() => {*/}
      {/*alert('Your custom action');*/}
      {/*}}*/}
      {/*label="Show calendar"*/}
      {/*>*/}
      {/*<IconEvent/>*/}
      {/*</Button>*/}
    </TopToolbar>
  );
};

const TabbedDatagrid = (props) => {
  const listContext = useListContext();
  const { ids, filterValues, setFilters, displayedFilters } = listContext;
  const classes = useDatagridStyles();
  const translate = useTranslate();

  const [cart, setCart] = useState([]);
  const [checkout, setCheckout] = useState([]);
  const [processing, setProcessing] = useState([]);

  const totals = 0;

  useEffect(() => {
    if (ids && ids !== filterValues.status) {
      switch (filterValues.status) {
        case 'published':
          console.log('ids', ids);
          setCart(ids);
          break;
        case 'draft':
          setCheckout(ids);
          break;
        case 'processing':
          setProcessing(ids);
          break;
        default:
          setCart('published');
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
    filterValues.status === 'published'
      ? cart
      : filterValues.status === 'draft'
      ? checkout
      : cart;
  // console.log('filterValues.status',filterValues.status);
  if (!filterValues.status) {
    filterValues.status = 'published';
  }
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
          <Datagrid
            optimized
            // rowStyle={postRowStyle}
          >
            <SimpleImageField label={translate('resources.product.image')} />
            <FunctionField
              label={translate('resources.product.categories')}
              render={(record) => {
                return (
                  <>
                    <ShowLink
                      source={'title.' + translate('lan')}
                      label={translate('resources.product.title')}
                      sortable={false}
                    />
                    <br />
                    <TextField source={'slug'} />
                  </>
                );
              }}
            />
            {/*<CustomTextInput source="description.fa" label="description" sortable={false}/>*/}

            <FunctionField
              label={translate('resources.product.categories')}
              render={(record) => {
                return (
                  <div className={'categories'}>
                    {record.productCategory &&
                      record.productCategory.map((item, it) => (
                        <div>
                          <ChipField
                            source={'productCategory[' + it + '].slug'}
                            label={item.slug}
                            sortable={false}
                          />
                        </div>
                      ))}
                  </div>
                );
              }}
            />

            {/*<NumberField source="price" label="قیمت" sortable={false}/>*/}
            {/*<TextInput source="title.fa" label="Title" value="title.fa"/>*/}
            {/*<NumberField source="salePrice" label="قیمت تخفیف خورده" sortable={false}/>*/}
            {/*<BooleanField source="in_stock" label="موجودی"/>*/}
            {/*<NumberField source="quantity" label="مقدار" sortable={false}/>*/}
            {/*<FunctionField label="نوع"*/}
            {/*render={record => `${record.combinations && record.combinations.length ? 'مادر' : 'ساده'}`}/>*/}
            {/*<FileChips source="photos" sortable={false}/>*/}
            <FunctionField
              label={translate('resources.product.prices')}
              render={(record) => {
                let tt = translate('resources.product.outOfStock'),
                  thecl = 'erro';

                if (record.type == 'variable') {
                  if (record.combinations) {
                    record.combinations.map((comb, key) => {
                      if (comb.in_stock == true) {
                        tt = translate('resources.product.stock');
                        thecl = 'succ';
                      }
                    });
                    return (
                      <div className={'stockandprice ' + thecl}>
                        <div className="theDate hoverparent">
                          <Chip className={thecl} label={tt} />
                          <div className="theDate thehover">
                            {record.combinations.map((comb, key) => {
                              return (
                                <div
                                  className={'cobm flex-d cobm' + key}
                                  key={key}>
                                  <div className={'flex-1'}>
                                    {comb.options && (
                                      <div className={''}>
                                        {Object.keys(comb.options).map(
                                          (item, index) => {
                                            return (
                                              <div key={index}>
                                                {item +
                                                  ' : ' +
                                                  comb.options[item] +
                                                  '\n'}
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className={'flex-1'}>
                                    {comb.price && (
                                      <div className={'FDFD'}>
                                        <span>
                                          {translate('resources.product.price')}
                                        </span>
                                        <span>
                                          {comb.price
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ','
                                            )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className={'flex-1'}>
                                    {comb.salePrice && (
                                      <div className={'vfdsf'}>
                                        <span>
                                          {translate(
                                            'resources.product.salePrice'
                                          )}
                                        </span>
                                        <span>
                                          {comb.salePrice
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ','
                                            )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className={'flex-1'}>
                                    {comb.in_stock && (
                                      <div className={''}>
                                        <span>
                                          {comb.in_stock == true
                                            ? translate(
                                                'resources.product.inStock'
                                              )
                                            : translate(
                                                'resources.product.outOfStock'
                                              )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className={'flex-1'}>
                                    {comb.quantity && (
                                      <div className={''}>
                                        <span>{comb.quantity}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  }
                } else {
                  if (record.in_stock == true) {
                    tt = translate('resources.product.inStock');
                    thecl = 'succ';
                  }
                  return (
                    <div className={'cobm flex-d cobm'}>
                      <div>
                        {record.price && (
                          <div className={'flex-1'}>
                            <span>{translate('resources.product.price')}:</span>
                            <span>
                              {record.price &&
                                record.price
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </span>
                          </div>
                        )}
                        {record.salePrice && (
                          <div className={'flex-1'}>
                            <span>
                              {translate('resources.product.salePrice')}:
                            </span>
                            <span>
                              {record.salePrice &&
                                record.salePrice
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className={'flex-1'}>
                          <span>{translate('resources.product.stock')}:</span>
                          <Chip className={thecl} label={tt}></Chip>
                          <span></span>
                        </div>
                        <div className={'flex-1'}>
                          <span>{translate('resources.product.count')}:</span>
                          <span>{record.quantity}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
              }}
            />

            <FunctionField
              label={translate('resources.product.date')}
              render={(record) => (
                <div className="theDate">
                  <div>
                    {translate('resources.product.createdAt') +
                      ': ' +
                      `${dateFormat(record.createdAt)}`}
                  </div>
                  <div>
                    {translate('resources.product.updatedAt') +
                      ': ' +
                      `${dateFormat(record.updatedAt)}`}
                  </div>

                  {record.views && (
                    <div>
                      {translate('resources.product.viewsCount') +
                        ': ' +
                        `${record.views.length}`}
                    </div>
                  )}
                </div>
              )}
            />

            <FunctionField
              label={translate('resources.product.edit')}
              render={(record) => (
                <>
                  <div>
                    <EditButton
                      label={translate('resources.product.edit')}
                      key={'00'}
                    />
                  </div>
                  {/*<EditButton label={"resources.product.content"} key={'11'}/>,*/}
                  {/*<ShowButton label={"resources.product.analytics"} key={'22'}/>,*/}
                  <div>
                    <Button
                      color="primary"
                      size="small"
                      key={'33'}
                      onClick={() => {
                        // console.log('data', record._id);
                        API.post('/product/copy/' + record._id, null)
                          .then(({ data = {} }) => {
                            // console.log('data', data._id);
                            props.history.push('/product/' + data._id);
                            // ale/rt('done');
                          })
                          .catch((err) => {
                            console.log('error', err);
                          });
                      }}>
                      <ContentCopyIcon />
                      <span className={'ml-2 mr-2'}>
                        {translate('resources.product.copy')}
                      </span>
                    </Button>
                  </div>
                  <div>
                    <a
                      href={
                        '/#/action?filter=%7B%22product"%3A"' +
                        record._id +
                        '"%7D&order=ASC&page=1&perPage=10&sort=id/'
                      }
                      target={'_blank'}
                      color="primary"
                      size="small"
                      onClick={() => {}}
                      rel="noreferrer">
                      <PendingActionsIcon />
                      <span className={'ml-2 mr-2'}>
                        {translate('resources.product.activities')}
                      </span>
                    </a>
                  </div>
                </>
              )}
            />
          </Datagrid>
        </ListContextProvider>
      </div>
    </Fragment>
  );
};

const useDatagridStyles = makeStyles({
  total: { fontWeight: 'bold' },
});

const tabs = [
  { id: 'published', name: 'منتشر شده' },
  { id: 'processing', name: 'در دست بررسی' },
  { id: 'draft', name: 'پیش نویس' },
];

const list = (props) => {
  // console.clear();
  // console.log('props', props);
  const translate = useTranslate();

  return (
    <List
      {...props}
      filters={<PostFilter />}
      pagination={<PostPagination />}
      actions={<ListActions />}
      exporter={exporter}>
      <TabbedDatagrid />
    </List>
  );
};

export default list;
