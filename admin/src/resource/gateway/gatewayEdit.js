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
const ResourceName = () => {
    const {resource} = useResourceContext();
    return <>{resource}</>;
}
const PostFilter = (props) => {
    const translate = useTranslate();

    return (
        <Filter {...props}>
            {/*<TextInput label="Search" source="search" alwaysOn/>*/}
            <SearchInput source="Search" placeholder={translate('resources.gateway.name')} alwaysOn/>
            {/*<SearchInput source="firstCategory" placeholder={'نام'} alwaysOn/>*/}
            {/*<SearchInput source="lastName" placeholder={'نام خانوادگی'} alwaysOn/>*/}
            {/*<SelectInput source="firstCategory" label={'دسته بندی اول'}  emptyValue={null} choices={typeChoices4}/>*/}
            {/*<SelectInput source="secondCategory" label={'دسته بندی دوم'}  emptyValue={null} choices={typeChoices3}/>*/}
            {/*<SelectInput source="thirdCategory" label={'دسته بندی سوم'}  emptyValue={null} choices={typeChoices3}/>*/}

        </Filter>
    );
}
const PostPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 200, 500]} {...props} />;

const list = (props) => {
    const translate = useTranslate();

    return (
        <List {...props} filters={<PostFilter/>} pagination={<PostPagination/>}>
            <Datagrid>
                <TextField source={"name."+translate('lan')} label={translate('resources.gateway.name')}/>
                <TextField source="slug" label={translate('resources.gateway.slug')}/>
                <ReferenceField
                    label={translate('resources.gateway.parent')}
                    source="parent"
                    reference="category">
                    <TextField source={"name."+translate('lan')}/>
                </ReferenceField>
                <TextField source="order" label={translate('resources.gateway.order')}/>

                <EditButton/>
                <ShowButton/>
                {/*<DeleteButton/>*/}
            </Datagrid>
        </List>
    );
}

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
          <TextInput
            className={"width100 mb-20 ltr"}
                source="request"
                label={translate('resources.gateway.request')}
                validate={Val.req}
                formClassName={cls.f2}
                fullWidth
            />
          <TextInput
            className={"width100 mb-20 ltr"}
                source="verify"
                label={translate('resources.gateway.verify')}
                validate={Val.req}
                formClassName={cls.f2}
                fullWidth
            />

        </SimpleForm>
    );
};

function save(record) {
    console.log('save', record, theID);

    // if (record.plusx) {
    let type = null, number = 0;
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
        API.put('/product/modifyPriceByCat/' + theID, JSON.stringify({type: type, number: number}))
            .then(({data = {}}) => {
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

const ChangesForm = ({children, ...rest}) => {
    const cls = useStyles();
    const translate = useTranslate();

    return (
        <SimpleForm {...rest} onSubmit={save}>
            {children}
            <NumberInput
                min={0}
                source="plusx"
                label={translate("gateway.addxpercent")}
            />
            <NumberInput
                min={0}
                source="minusx"
                label={translate("gateway.minusxpercent")}
            />
            <NumberInput
                min={0}
                source="plusxp"
                label={translate("gateway.addxprice")}
            />
            <NumberInput
                min={0}
                source="minusxp"
                label={translate("gateway.minusxprice")}
            />

        </SimpleForm>
    );
};

const edit = (props) => (
    <Edit {...props}>
        <Form/>
    </Edit>
);

const create = (props) => (
    <Create {...props}>
        <Form/>
    </Create>
);
const PostBulkActionButtons = props => (
    <Fragment>
        {/*<ResetViewsButton label="Reset Views" {...props} />*/}
        {/* default bulk delete action */}
        <CustomResetViewsButton {...props} />
    </Fragment>
);

export const categoryShow = (props) => {
    // console.log('props', props);
    // const [state, setState] = React.useState([]);
    theID = props['id'];
    return (
        [<Create {...props}>
            <ChangesForm/>
        </Create>,
            <ResourceContextProvider value={'product'}>
                <List basePath={'/product/bycat/' + props['id']} filter={{id: props['id'], kind: 'bycat'}}
                      bulkActionButtons={<PostBulkActionButtons the_id={props['id']}/>}
                      pagination={<PostPagination/>}>
                    <Datagrid>
                        <TextField source="title.fa" label="نام"/>
                        <TextField source="type" label="نوع"/>
                        <FunctionField label="قیمت و موجودی"
                                       render={record => {
                                           let tt = 'نا موجود', thecl = 'erro';
                                           if (record.type == 'variable') {

                                               if (record.combinations) {
                                                   record.combinations.map((comb, key) => {
                                                       if (comb.in_stock == true) {
                                                           tt = 'موجود';
                                                           thecl = 'succ';
                                                       }
                                                   });
                                                   return (
                                                       <div className='stockandprice'>

                                                           <div className='theDate hoverparent'>
                                                               <Chip className={thecl} label={tt}></Chip>
                                                               <div className='theDate thehover'>
                                                                   {record.combinations.map((comb, key) => {
                                                                       return (
                                                                           <div className={'cobm flex-d cobm' + key}>
                                                                               <div className={'flex-1'}>
                                                                                   {comb.options && <div
                                                                                       className={''}>{Object.keys(comb.options).map((item, index) => {
                                                                                       return <div
                                                                                           key={index}>{(item) + " : " + comb.options[item] + "\n"}</div>;

                                                                                   })}</div>}
                                                                               </div>
                                                                               <div className={'flex-1'}>

                                                                                   {comb.price &&
                                                                                   <div className={'FDFD'}>
                                                                                       <span>قیمت:</span><span>{comb.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                                                   </div>}
                                                                               </div>
                                                                               <div className={'flex-1'}>

                                                                                   {comb.salePrice &&
                                                                                   <div className={'vfdsf'}>
                                                                                       <span>قیمت تخفیف خورده:</span><span>{comb.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                                                   </div>}
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
                                                                           </div>);
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
                                               return (<div className={'cobm flex-d cobm'}>
                                                   <div className={'flex-1'}>
                                                       <span>قیمت:</span><span>{record.price && record.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                   </div>
                                                   <div className={'flex-1'}>
                                                       <span>با تخفیف:</span><span>{record.salePrice && record.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                   </div>
                                                   <div className={'flex-1'}>
                                                       <span>انبار:</span><span><Chip className={thecl}
                                                                                      label={tt}></Chip></span>
                                                   </div>
                                                   <div className={'flex-1'}>
                                                       <span>تعداد:</span><span>{record.quantity}</span>
                                                   </div>
                                               </div>)

                                           }

                                       }}/>


                    </Datagrid>
                </List>
            </ResourceContextProvider>]
    );
}
export default edit;
