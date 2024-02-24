import {
    ArrayInput,
    BooleanInput,
    Create,
    NumberInput,
    ReferenceArrayInput,
    RadioButtonGroupInput,
    CheckboxGroupInput,
    SelectArrayInput,
    SelectInput,
    SimpleFormIterator,
    TextInput,
    useLocaleState,
    useNotify,
    useRedirect,
    useTranslate,
} from 'react-admin';
import useFetch from '@/hooks/useFetch';

import { dateFormat } from '@/functions';
import {useEffect, useState} from 'react';
import {Box, CircularProgress} from '@material-ui/core';
import { List, ReactAdminJalaliDateInput, SimpleForm } from '@/components';
import API from '@/functions/API';
export const customerCreate = (props) => {
    const translate = useTranslate();
    let {children = undefined, record, Resource_Name} = props;
    const [childs, setChilds] = useState([]);
    const [isCompanyNameUnique, setIsCompanyNameUnique] = useState(false);
    const [isCompanyTelNumberUnique, setIsCompanyTelNumberUnique] =
        useState(false);
    const [loading, setLoading] = useState(false);
    const [theData, setTheData] = useState(false);

    const locale = useLocaleState();

    useEffect(() => {
    }, [locale]);

    console.log('locale', locale);

    const alertMessage = () => {
        return locale[0] === 'fa'
            ? 'مقدار یکتا باید باشد.'
            : 'Value must be unique!';
    };

    const successMessage = () => {
        return locale[0] === 'fa' ? 'مقدار یکتا است.' : 'Value is unique!';
    };

    useEffect(() => {
        // getData();
    }, []);

    // const getData = () => {
    //     API.get('/settings/customerStatus')
    //         .then(({data = {}}) => {
    //             setChilds(data);
    //             setTheData(true);
    //         })
    //         .catch((e) => {
    //             setTheData(true);
    //         })
    //         .finally(() => setLoading(false));
    // };

    const checkCompanyName = (value) => {
        //send a request to check if the value is unique
        API.get(`/customer/0/100/?companyName=${value}`)
            .then(({data = {}}) => {
                console.log(data);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => setLoading(false));

        // setIsCompanyNameUnique(true);
    };
    const checkCompanyTelNumber = (value) => {
        //send a request to check if the value is unique
        // setIsCompanyTelNumberUnique(true);
        API.get(`/customer/0/100/?_order=ASC&_sort=id&companyTelNumber=${value}`)
            .then(({data = {}}) => {
                console.log(data);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => setLoading(false));
    };
    const notify = useNotify();
    const redirect = useRedirect();
    const onError = (error, d) => {
        console.log('error ', error, d)
        return;

        notify(`Could not create post: ${error.message}`);
    };
    const onSuccess = (d, g, f) => {
        let {data} = g;
        console.log('data ', data, g, f)
        return;
        if (data?.success == false) {
            notify(`Could not create customer: ${data.message} ${data.err}`);

            return;

        }
        notify(`Changes saved`, data);

        redirect(`/customer/${data.id}`);
    };

    function save(values) {


        API.post(`/customer`, JSON.stringify({...values}))
            .then(({data = {}}) => {
                console.log('data', data)
                if (data && data._id) redirect(`/customer/${data._id}`);

                if (!data.success && data.customers && data.customers[0]) {
                    let {customers} = data;
                    notify(translate('customer exist!'));
                    redirect(`/customer/${customers[0]._id}`);
                    return;
                }

                if (!data.success && (!data.customers || data.data.err == "customer_exist") && !data._id) {
                    notify(`${data.message}`);
                    return;
                }
                if (data && data.err == "customer_exist") {
                    let {customers} = data;
                    notify(translate('customer exist!'));
                    redirect(`/customer/${customers[0]._id}`);
                }
                if (data && data.success) redirect(`/customer/${data._id}`);
            })
            .catch((err) => {
                console.log('error', err);
                notify(`${err.message}`);

            });

    }
    const WebAppConfigData = useFetch({ requestQuery: '/config/system' });

    const consumerStatusChoices = WebAppConfigData.data
        ? WebAppConfigData.data.data.consumer_status
        : [];

    const EditCostumerStatus = () => {
        return (
            <ArrayInput source="status" label={'resources.settings.consumerStatus'}>
                <SimpleFormIterator>
                    <SelectInput
                        disable={WebAppConfigData.isLoading}
                        source="status"
                        choices={consumerStatusChoices.map((obj) => {
                            return {
                                id: obj.key,
                                name: obj.value,
                                value: obj.key,
                            };
                        })}
                        label="Status Type"
                    />
                    <TextInput
                        label={translate('resources.settings.description')}
                        source="description"
                        disable={WebAppConfigData.isLoading}
                    />
                </SimpleFormIterator>
            </ArrayInput>
        );
    };
    return (
    <Create {...props}>
        <SimpleForm onSubmit={(v) => save(v)}>
            <div className={'box'}>
                <label>{translate('resources.customers.personalData')}</label>
                <NumberInput
                    fullWidth
                    className={'ltr'}
                    source="phone"
                    // validate={required()}
                    // helperText={translate('required')}
                    label={translate('resources.customers.phone')}
                />
                <TextInput
                    fullWidth
                    source="firstName"
                    label={translate('resources.customers.firstName')}
                />
                <TextInput
                    fullWidth
                    source="lastName"
                    label={translate('resources.customers.lastName')}
                />
            </div>

            <div className={'box'}>
                <label>{translate('resources.customers.companyData')}</label>
                <NumberInput
                    onChange={(e) => {
                        // checkCompanyTelNumber(e.target.value);
                    }}
                    className={'ltr'}
                    fullWidth
                    source="companyTelNumber"
                    type="text"
                    label={translate('resources.customers.companyTelNumber')}
                />
                {loading ? (
                    <CircularProgress size={25}/>
                ) : (
                    theData && (
                        <>
                            <div>
                                {isCompanyTelNumberUnique ? (
                                    <p>{successMessage()}</p>
                                ) : (
                                    <p>{alertMessage()}</p>
                                )}
                            </div>
                        </>
                    )
                )}
                <TextInput
                    onChange={(e) => {
                        checkCompanyName(e.target.value);
                    }}
                    fullWidth
                    source="companyName"
                    type="text"
                    label={translate('resources.customers.companyName')}
                />
                {loading ? (
                    <CircularProgress size={25}/>
                ) : (
                    theData && (
                        <>
                            <div>
                                {isCompanyNameUnique ? (
                                    <p>{successMessage()}</p>
                                ) : (
                                    <p>{alertMessage()}</p>
                                )}
                            </div>
                        </>
                    )
                )}

            </div>


            <div className={'box'}>
                <label>{translate('resources.customers.extraData')}</label>

                <TextInput
                    fullWidth
                    source="internationalCode"
                    label={translate('resources.customers.internationalCode')}
                />
                <TextInput
                    fullWidth
                    source="email"
                    type="email"
                    label={translate('resources.customers.email')}
                />

                <TextInput
                    fullWidth
                    source="countryCode"
                    label={translate('resources.customers.countryCode')}
                />
                <TextInput
                    fullWidth
                    source="activationCode"
                    label={translate('resources.customers.activationCode')}
                />
                <TextInput
                    defaultValue="{}"
                    multiline
                    fullWidth
                    source="data"
                    label={translate('resources.customers.data')}
                />
                <ReactAdminJalaliDateInput
                    fullWidth
                    source="birthdate"
                    label={translate('resources.customers.birthdate')}
                />
                <SelectInput
                    fullWidth
                    label={translate('resources.customers.sex')}
                    defaultValue=""
                    source="sex"
                    choices={[
                        {id: '', name: ''},
                        {id: 'male', name: translate('resources.customers.male')},
                        {id: 'female', name: translate('resources.customers.female')},
                    ]}
                />
            </div>
            <div className={'box'}>
                <label>{translate('resources.customers.grouping')}</label>

                <SelectInput
                    label={translate('resources.customers.source')}
                    defaultValue="CRM"
                    fullWidth
                    source="source"
                    choices={[
                        {id: 'WEBSITE', name: translate('resources.customers.WEBSITE')},
                        {id: 'CRM', name: translate('resources.customers.CRM')},
                    ]}
                />

                <ReferenceArrayInput source="customerGroup" reference="customerGroup">
                    <SelectArrayInput
                        fullWidth
                        label={translate('resources.customers.customerGroup')}
                        optionText="name.fa"
                    />
                </ReferenceArrayInput>

            </div>

            <div className={'box'}>

                <Box>
                    <EditCostumerStatus />


                </Box>
            </div>
            <BooleanInput
                fullWidth
                source="active"
                defaultValue={true}
                label={translate('resources.customers.active')}
            />
        </SimpleForm>

    </Create>
  );
};

export default customerCreate;
