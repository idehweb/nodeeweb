import {
  Datagrid,
  DeleteButton,
  EditButton,
  ShowButton,
  Filter,
  FunctionField,
  Pagination,
  TextField,
  TextInput,
  SearchInput,
  DateInput ,
  useTranslate,
  SelectInput,
  ReferenceInput,
  ReferenceArrayField,
  SelectArrayInput,
  useListContext
} from "react-admin";

import API, { BASE_URL } from "@/functions/API";
import { dateFormat } from "@/functions";
import {
  CatRefField,
  EditOptions,
  FileChips,
  List,
  ShowDescription,
  showFiles,
  ShowLink,
  ShowOptions,
  ShowPictures,
  SimpleForm,
  SimpleImageField,
  UploaderField
} from "@/components";
import { Button } from "@mui/material";

import React from "react";

import { useGetList, useList } from 'react-admin';



const PostPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />;


const postRowStyle = (record, index) => {
  
  return ({
    backgroundColor: "#ee811d"
  });
};


const PostFilter = (props) => {
  const translate = useTranslate();
  const [status,setStatus] = React.useState(null);
const { data, total, isLoading, error } = useGetList(
  'form',
  { pagination: { page: 1, perPage: 100 } },
);
React.useEffect(()=>{
  API.get("/settings/formStatus").then(( response = {} ) => {
    const {data} = response;
    setStatus(data);
  })
},[])


  return (
    <Filter {...props}>
      {
        data && data.length > 0 && (
          <SelectInput
          label="انتخاب فرم"
          source="form"
          choices={data}
          optionText="title.fa"
          optionValue="_id"
          alwaysOn 
  />
        )
      }
        

        {
          status ? (
            <SelectInput
                label="انتخاب وضعیت"
                source="status"
                choices={status}
                optionText="title"
                optionValue="slug"
                alwaysOn 
        />
          ):(
              <span>Loadding...</span>
          )
        }
      {/* <SearchInput source="title" reference="form.title" placeholder={translate("resources.post.category")} alwaysOn/> */}
      {/* <SelectArrayInput source="entry" choices={foorm} alwaysOn/> */}
      {/* <SearchInput  reference="trackingCode" source="trackingCode" placeholder={'کد رهگیری'}  alwaysOn/> */}
      {/* <DateInput   source={"Search"} reference={"form.title." + translate("lan")} placeholder={'عنوان'}  alwaysOn/> */}
      {/* <ReferenceArrayField tags="form" source="form.title" alwaysOn /> */}
    {/* <ReferenceInput  choices={foorm} alwaysOn>
      <SelectInput/>
    </ReferenceInput> */}

    </Filter>
  );
};


const list = (props) => {
  const translate = useTranslate();
  

  return (

    <>
    <List  {...props} filters={<PostFilter/>} pagination={<PostPagination/>}>
      <Datagrid optimized>
        <TextField source="trackingCode" label={translate("resources.entry.trackingCode")}/>

        <TextField source={"form.title." + translate("lan")} label={translate("resources.form.title")}/>


        <FunctionField label={translate("resources.post.date")}
                       render={record => (
                         <div className='theDate'>
                           <div>
                             {translate("resources.post.createdAt") + ": " + `${dateFormat(record.createdAt)}`}
                           </div>
                           <div>
                             {translate("resources.post.updatedAt") + ": " + `${dateFormat(record.updatedAt)}`}
                           </div>

                           {record.views && <div>
                             {translate("resources.post.viewsCount") + ": " + `${(record.views.length)}`}
                           </div>}
                         </div>
                       )}/>
        <FunctionField label={translate("resources.post.actions")}
                       render={record => (<div>
                         <div>
                           <ShowButton/>
                         </div>
                         <div>
                           <EditButton/>
                         </div>
                         <div>
                           <DeleteButton/>
                         </div>
                       </div>)}/>
      </Datagrid>
    </List>
    </>
  );
};

export default React.memo(list);