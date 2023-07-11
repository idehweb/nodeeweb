import {
    DeleteButton,
    SaveButton,
    SelectInput,
    showNotification,
    TextInput,
    Toolbar,
    useForm,
    useNotify,
    useRedirect,
    useTranslate
} from "react-admin";
import API from "@/functions/API";
import {dateFormat} from "@/functions";
import {
    CatRefField,
    Combinations,
    EditOptions,
    FileChips,
    FormTabs,
    List,
    PageBuilder,
    ProductType,
    ShowDescription,
    showFiles,
    ShowLink,
    ShowOptions,
    ShowPictures,
    SimpleForm,
    SimpleImageField,
    UploaderField,
} from "@/components";
import {Val} from "@/Utils";
import React from "react";
import {RichTextInput} from "ra-input-rich-text";

// import { RichTextInput } from 'ra-input-rich-text';
// import {ImportButton} from "react-admin-import-csv";
let combs = [];
let _The_ID = null;

let valuess = {"photos": [], "files": [], thumbnail: "", combinations: []};

function setPhotos(values) {

    // let {values} = useFormState();
    console.log("setPhotos", values);
    valuess["photos"] = values;
    // setV(!v);
    // this.forceUpdate();
}

function returnToHome(values) {
    // console.log('returnToHome', values);
    valuess["firstCategory"] = values["firstCategory"];
    valuess["secondCategory"] = values["secondCategory"];
    valuess["thirdCategory"] = values["thirdCategory"];
}

function onCreateCombinations(options) {
    // console.log('onCreateCombinations', options);
    let combCount = 1;
    let combinationsTemp = [];
    let combinations = [];
    let counter = 0;
    options.forEach((opt, key) => {
        let optemp = {};
        let theVals = [];
        opt.values.forEach((val, key2) => {
            theVals.push({[opt.name]: val.name});

        });
        combinationsTemp.push(theVals);

    });
    // console.log('combinationsTemp', combinationsTemp);
    let ttt = cartesian(combinationsTemp);
    // console.log('ttt', ttt);

    ttt.forEach((tt, key) => {
        let obj = {};
        tt.forEach((ther, key) => {
            // obj[key]=ther;
            Object.assign(obj, ther);
        });
        combinations.push({
            id: key,
            options: obj,
            in_stock: false,
            price: null,
            salePrice: null,
            quantity: 0
        });

    });
    // (id, path, rowRecord) => form.change('combinations', combinations)
    // console.log('combinations', combinations);
    combs = combinations;
    return combinations;

}

function cartesian(args) {
    let r = [], max = args.length - 1;

    function helper(arr, i) {
        for (let j = 0, l = args[i].length; j < l; j++) {
            let a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i === max)
                r.push(a);
            else
                helper(a, i + 1);
        }
    }

    helper([], 0);
    return r;
}

function returnCatsValues() {
    // console.log('returnCatsValues', values);
    return ({
        firstCategory: valuess["firstCategory"],
        secondCategory: valuess["secondCategory"],
        thirdCategory: valuess["thirdCategory"]
    });
}

function thel(values) {
    return new Promise(resolve => {
        console.log("change photos field", values);

        valuess["photos"] = values;
        resolve(values);
    }, reject => {
        reject(null);
    });

    // console.log(values);

}

function theP(values) {
    console.log("change thumbnail field", values);
    valuess["thumbnail"] = values;
    // console.log(values);

}

function thelF(values) {
    // console.log('change files field', values);

    valuess["files"].push({
        url: values
    });
    // console.log(values);

}


function CombUpdater(datas) {
    console.log("datas", datas);
    valuess["combinations"] = datas;
}

function OptsUpdater(datas) {
    console.log("datas", datas);
    valuess["options"] = datas;
}


const CustomToolbar = props => (
    <Toolbar {...props} className={"dfghjk"}>
        <SaveButton alwaysEnable/>
        <DeleteButton mutationMode="pessimistic"/>
    </Toolbar>
);

const Form = ({children, ...props}) => {
    // console.log("vprops", props);
    const {record} = props;
    console.log("props", props)

    // if (!record) return null;

    const translate = useTranslate();
    const notify = useNotify();
    if (record && record._id) {
        console.log("_id set")
        _The_ID = record._id;
    }
    // const {reset} = useFormContext();
    const redirect = useRedirect();
    const transform = (data, {previousData}) => {
        console.log("transform={transform}", data, {previousData})

        return ({
            ...data,
            // firstCategory: "61d58e37d931414fd78c7fb7"
        });
    }
    // console.log("record", record);
    // valuess['photos'] = props.record.photos || [];
    // if(valuess['options']!=record.options){
    //   record.options=valuess['options'];
    // }
    // console.log('productForm...',record);
    const totals = 0;


    return (
        <SimpleForm {...props}
                    // toolbar={<CustomToolbar record={props.record}/>}
                    // onSubmit={v => save(v)}
        >
            {/*<TabbedDatagrid/>*/}
            <TextInput source={"title."+translate("lan")} fullWidth label={translate("resources.post.title")}
                       className={"width100 mb-20"}
                       validate={Val.req}/>

            <div className={"mb-20"}></div>

            <TextInput source="slug" fullWidth label={translate("resources.post.slug")}
                       className={"width100 mb-20 ltr"}/>


            {/*<SelectInput*/}
                {/*label={translate("resources.post.kind")}*/}
                {/*defaultValue={"post"}*/}
                {/*source="kind"*/}
                {/*choices={[*/}
                    {/*{id: "post", name: translate("resources.post.post")},*/}
                    {/*{id: "page", name: translate("resources.post.page")}*/}
                {/*]}*/}
            {/*/>*/}
            <SelectInput
                label={translate("resources.post.status")}
                defaultValue={"processing"}
                source="status"
                choices={[
                    {id: "published", name: translate("resources.post.published")},
                    {id: "processing", name: translate("resources.post.processing")},
                    {id: "deleted", name: translate("resources.post.deleted")}
                ]}
            />
            {/*<ReferenceArrayInput label="انتخاب عنوان" source={getSource('title')}*/}
            {/*reference="attributes" filter={{f: true}}>*/}

            {/*<AutocompleteInput optionText="name.fa"*/}
            {/*optionValue="name.fa"/></ReferenceArrayInput>,*/}

            {/*<PageBuilder source="elements" record={record}/>*/}
            {children}
        </SimpleForm>);
};


export default Form;
