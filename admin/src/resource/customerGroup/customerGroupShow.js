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
  useResourceContext,
  useTranslate,
} from 'react-admin';
import React, { Fragment } from 'react';
import { useParams } from 'react-router';
import { CategoryRounded as Icon, LibraryAdd } from '@mui/icons-material';

import { Chip } from '@mui/material';

import { CustomResetViewsButton, List, SimpleForm } from '@/components';
import useStyles from '@/styles';
import { Val } from '@/Utils';
import API, { BASE_URL } from '@/functions/API';

var theID = null;
const ResourceName = () => {
  const { resource } = useResourceContext();
  return <>{resource}</>;
};
const PostFilter = (props) => {
  const translate = useTranslate();

  return (
    <Filter {...props}>
      {/*<TextInput label="Search" source="search" alwaysOn/>*/}
      <SearchInput
        source="Search"
        placeholder={translate('resources.category.name')}
        alwaysOn
      />
      {/*<SearchInput source="firstCategory" placeholder={'نام'} alwaysOn/>*/}
      {/*<SearchInput source="lastName" placeholder={'نام خانوادگی'} alwaysOn/>*/}
      {/*<SelectInput source="firstCategory" label={'دسته بندی اول'}  emptyValue={null} choices={typeChoices4}/>*/}
      {/*<SelectInput source="secondCategory" label={'دسته بندی دوم'}  emptyValue={null} choices={typeChoices3}/>*/}
      {/*<SelectInput source="thirdCategory" label={'دسته بندی سوم'}  emptyValue={null} choices={typeChoices3}/>*/}
    </Filter>
  );
};
const PostPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100, 200, 500]} {...props} />
);

const list = (props) => {
  const translate = useTranslate();

  return (
    <List {...props} filters={<PostFilter />} pagination={<PostPagination />}>
      <Datagrid>
        <TextField
          source={'name.' + translate('lan')}
          label={translate('resources.category.name')}
        />
        <TextField source="slug" label={translate('resources.category.slug')} />
        <ReferenceField
          label={translate('resources.category.parent')}
          source="parent"
          reference="category">
          <TextField source={'name.' + translate('lan')} />
        </ReferenceField>
        <TextField
          source="order"
          label={translate('resources.category.order')}
        />

        <EditButton />
        <ShowButton />
        {/*<DeleteButton/>*/}
      </Datagrid>
    </List>
  );
};

const Form = ({ children, ...rest }) => {
  const cls = useStyles();
  const translate = useTranslate();

  return (
    <SimpleForm {...rest}>
      {children}
      <TextInput
        source={'name.' + translate('lan')}
        label={translate('resources.category.name')}
        validate={Val.req}
        formClassName={cls.f2}
        fullWidth
      />
      <TextInput
        source="slug"
        label={translate('resources.category.slug')}
        validate={Val.req}
        formClassName={cls.f2}
        fullWidth
      />
      <ReferenceInput
        label={translate('resources.category.parent')}
        source="parent"
        reference="productCategory"
        perPage={1000}
        formClassName={cls.f2}>
        <SelectInput optionText={'name.' + translate('lan')} optionValue="id" />
      </ReferenceInput>
    </SimpleForm>
  );
};

function save(record) {
  console.log('save', record, theID);

  // if (record.plusx) {
  let type = null,
    number = 0;
  if (record.plusx) {
    type = 'plusx';
    number = record.plusx;
  }
  if (record.minusx) {
    type = 'minusx';
    number = record.minusx;
  }
  if (record.plusxp) {
    type = 'plusxp';
    number = record.plusxp;
  }
  if (record.minusxp) {
    type = 'minusxp';
    number = record.minusxp;
  }
  if (theID)
    API.put(
      '/product/modifyPriceByCat/' + theID,
      JSON.stringify({ type: type, number: number })
    )
      .then(({ data = {} }) => {
        // const refresh = useRefresh();
        // refresh();
        alert('it is ok');
        window.location.reload();
        // if (data.success) {
        //     values = [];
        //     valuess = [];
        // }
      })
      .catch((err) => {
        console.log('error', err);
      });
  // }

  // return 0;
}

const ChangesForm = ({ children, ...rest }) => {
  const cls = useStyles();
  const translate = useTranslate();

  return (
    <SimpleForm {...rest} onSubmit={save}>
      {children}
      <NumberInput
        min={0}
        source="plusx"
        label={translate('category.addxpercent')}
      />
      <NumberInput
        min={0}
        source="minusx"
        label={translate('category.minusxpercent')}
      />
      <NumberInput
        min={0}
        source="plusxp"
        label={translate('category.addxprice')}
      />
      <NumberInput
        min={0}
        source="minusxp"
        label={translate('category.minusxprice')}
      />
    </SimpleForm>
  );
};

const edit = (props) => (
  <Edit {...props}>
    <Form />
  </Edit>
);

const create = (props) => (
  <Create {...props}>
    <Form />
  </Create>
);
const PostBulkActionButtons = (props) => (
  <Fragment>
    {/*<ResetViewsButton label="Reset Views" {...props} />*/}
    {/* default bulk delete action */}
    <CustomResetViewsButton {...props} />
  </Fragment>
);

export const customerGroupShow = (props) => {
  // console.log('props', props);
  // const [state, setState] = React.useState([]);
  theID = props['id'];
  return [
    <Create {...props}>
      <ChangesForm />
    </Create>,
    <ResourceContextProvider value={'product'}>
      <List
        basePath={'/product/bycat/' + props['id']}
        filter={{ id: props['id'], kind: 'bycat' }}
        bulkActionButtons={<PostBulkActionButtons the_id={props['id']} />}
        pagination={<PostPagination />}>
        <Datagrid>
          <TextField source="title.fa" label="نام" />
          <TextField source="type" label="نوع" />
          <FunctionField
            label="قیمت و موجودی"
            render={(record) => {
              let tt = 'نا موجود',
                thecl = 'erro';
              if (record.type == 'variable') {
                if (record.combinations) {
                  record.combinations.map((comb, key) => {
                    if (comb.in_stock == true) {
                      tt = 'موجود';
                      thecl = 'succ';
                    }
                  });
                  return (
                    <div className="stockandprice">
                      <div className="theDate hoverparent">
                        <Chip className={thecl} label={tt}></Chip>
                        <div className="theDate thehover">
                          {record.combinations.map((comb, key) => {
                            return (
                              <div className={'cobm flex-d cobm' + key}>
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
                                      <span>قیمت:</span>
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
                                      <span>قیمت تخفیف خورده:</span>
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
                                  {/*{comb.in_stock &&*/}
                                  {/*<div className={''}>*/}
                                  {/*<span>{(comb.in_stock == true ? 'موجود' : 'نا موجود')}</span>*/}
                                  {/*</div>}*/}
                                </div>
                                <div className={'flex-1'}>
                                  {/*{comb.quantity &&*/}
                                  {/*<div className={''}>*/}
                                  {/*<span>{comb.quantity}</span>*/}
                                  {/*</div>}*/}
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
                  tt = 'موجود';
                  thecl = 'succ';
                }
                return (
                  <div className={'cobm flex-d cobm'}>
                    <div className={'flex-1'}>
                      <span>قیمت:</span>
                      <span>
                        {record.price &&
                          record.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </span>
                    </div>
                    <div className={'flex-1'}>
                      <span>با تخفیف:</span>
                      <span>
                        {record.salePrice &&
                          record.salePrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </span>
                    </div>
                    <div className={'flex-1'}>
                      <span>انبار:</span>
                      <span>
                        <Chip className={thecl} label={tt}></Chip>
                      </span>
                    </div>
                    <div className={'flex-1'}>
                      <span>تعداد:</span>
                      <span>{record.quantity}</span>
                    </div>
                  </div>
                );
              }
            }}
          />
        </Datagrid>
      </List>
    </ResourceContextProvider>,
  ];
};
export default customerGroupShow;
