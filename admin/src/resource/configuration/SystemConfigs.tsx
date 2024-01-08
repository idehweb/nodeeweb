import {
  ArrayInput,
  BooleanInput,
  Loading,
  NumberInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  maxValue,
  minValue,
  useNotify,
  useTranslate,
} from 'react-admin';

import { Paper } from '@mui/material';

import useFetch from '@/hooks/useFetch';

import styles from '@/assets/SystemConfigs.module.css';
import API from '@/functions/API';

export interface WebAppConfigProps {
  app_name: string;
  auth: { nodeeweb: { api_url: string } };
  consumer_status: {
    key: string;
    value: string;
  }[];
  currency: string;
  entry_submit_message: string;
  factor: {
    name: string;
    url: string;
  };
  favicons: string[];
  host: string;
  limit: {
    approach_transaction_expiration: number;
    max_need_to_pay_order: number;
    max_need_to_pay_transaction: number;
    max_product_combination_quantity_in_cart: number;
    max_products_in_cart: number;
    request_limit: number;
    request_limit_window_s: number;
    transaction_expiration_s: number;
  };
  manual_post: {
    id: string;
    provider: string;
    title: string;
    description: string;
    active: boolean;
    price?: number;
    priceFormula?: string;
    base_price?: number;
    min_price?: number;
    max_price?: number;
    cities?: {
      id: string;
      name: string;
    }[];
    states?: {
      id: string;
      name: string;
    }[];
    products_min_price: number;
    products_max_price: number;
    products_min_weight: number;
    products_max_weight: number;
  }[];
  sms_message_on: {
    approach_transaction_expiration: string;
    paid_order: string;
    cancel_order: string;
    post_order: string;
    complete_order: string;
  };
  supervisor: {
    url: string;
    token: string;
    whitelist: unknown[];
  };
  shop_active: boolean;
  shop_inactive_message: string;
  payment_redirect: string;
  tax: number;
}

export default function SystemConfigs() {
  const WebAppConfigData = useFetch({ requestQuery: '/config/system' });
  const ConfigData =
    (WebAppConfigData.data as { data: WebAppConfigProps })?.data || null;
  const translate = useTranslate();
  const notify = useNotify();

  const onSubmit = (values) => {
    API.put('/config/website' + values._id, JSON.stringify({ ...values }))
      .then(({ data = {} }) => {
        notify(translate('saved successfully.'), {
          type: 'success',
        });
        if (data.success) {
          values = [];
          // valuess = [];
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  // const typeChoices = [
  //   {
  //     id: 'تهران',
  //     name: 'تهران',
  //   },
  //   {
  //     id: 'شهرستان',
  //     name: 'شهرستان',
  //   },
  // ];

  // const typeChoices3 = [
  //   {
  //     id: 'is',
  //     name: 'هست',
  //   },
  //   {
  //     id: 'isnt',
  //     name: 'نیست',
  //   },
  // ];

  console.log(WebAppConfigData);

  return WebAppConfigData.isLoading ? (
    <Loading />
  ) : WebAppConfigData.error ? (
    <></>
  ) : (
    WebAppConfigData.data && (
      <Paper className={styles.container}>
        <SimpleForm
          defaultValues={ConfigData}
          onSubmit={(values) => onSubmit(values)}>
          <TextInput
            className={styles.input}
            source="app_name"
            label={translate('resources.settings.shop_name')}
            // validate={required()}
          />
          <NumberInput
            source="taxAmount"
            label={translate('resources.settings.taxAmount')}
            validate={[minValue(0), maxValue(1)]}
          />
          <ArrayInput
            source="consumer_status"
            label={translate('resources.settings.consumerStatus')}>
            <SimpleFormIterator>
              <TextInput
                fullWidth
                source="consumer_status.key"
                label={translate('resources.settings.consumer_status.key')}
              />
              <TextInput
                fullWidth
                source={'consumer_status.value'}
                label={translate('resources.settings.consumer_status.value')}
              />
            </SimpleFormIterator>
          </ArrayInput>
          <TextInput
            source="currency"
            label={translate('resources.settings.currency')}
            className={styles.input}
            // validate={required()}
          />
          <TextInput
            source="host"
            className={styles.input}
            label={translate('resources.settings.shop_site_address')}
            // validate={required()}
          />
          <BooleanInput
            source="shop_active"
            className={styles.input}
            label={translate('resources.settings.siteActive')}
            // validate={required()}
          />
          <TextInput
            source="shop_inactive_message"
            className={styles.input}
            label={translate('resources.settings.siteActiveMessage')}
            // validate={required()}
          />
          <TextInput
            source="entry_submit_message"
            className={styles.input}
            label={translate('resources.settings.entry_submit_message')}
            // validate={required()}
          />
          <TextInput
            source="payment_redirect"
            className={styles.input}
            label={translate('resources.settings.payment_redirect')}
            // validate={required()}
          />

          <div id="config-limit-inputs">
            <TextInput
              fullWidth
              source={'limit.approach_transaction_expiration'}
              label={translate(
                'resources.settings.limit.approach_transaction_expiration'
              )}
            />
            <TextInput
              fullWidth
              source={'limit.max_need_to_pay_order'}
              label={translate(
                'resources.settings.limit.max_need_to_pay_order'
              )}
            />
            <TextInput
              fullWidth
              source={'limit.max_need_to_pay_transaction'}
              label={translate(
                'resources.settings.limit.max_need_to_pay_transaction'
              )}
            />

            <NumberInput
              label={translate(
                'resources.settings.limit.max_product_combination_quantity_in_cart'
              )}
              fullWidth
              className={'mb-20'}
              source={'limit.max_product_combination_quantity_in_cart'}
            />

            <NumberInput
              label={translate('resources.settings.limit.max_products_in_cart')}
              fullWidth
              className={'mb-20'}
              source={'limit.max_products_in_cart'}
            />
            <TextInput
              source={'limit.request_limit'}
              label={translate('resources.settings.limit.request_limit')}
            />
            <TextInput
              source={'limit.request_limit_window_s'}
              label={translate(
                'resources.settings.limit.request_limit_window_s'
              )}
            />
            <TextInput
              source={'limit.transaction_expiration_s'}
              label={translate(
                'resources.settings.limit.transaction_expiration_s'
              )}
            />
          </div>

          <div id="config-manualpost-inputs">
            <ArrayInput
              source="manual_post"
              label={translate('resources.settings.manualPost')}>
              <SimpleFormIterator>
                {/* <TextInput
                  fullWidth
                  source="manual_post.id"
                  label={translate('resources.settings.manual_post.id')}
                /> */}
                <TextInput
                  fullWidth
                  source={'manual_post.provider'}
                  label={translate('resources.settings.manual_post.provider')}
                />
                <TextInput
                  fullWidth
                  source={'manual_post.title'}
                  label={translate('resources.settings.manual_post.title')}
                />
                <TextInput
                  fullWidth
                  source={'manual_post.description'}
                  label={translate(
                    'resources.settings.manual_post.description'
                  )}
                />
                <BooleanInput
                  source={'manual_post.active'}
                  label={translate('resources.settings.manual_post.active')}
                />
                <NumberInput
                  source={'manual_post.price'}
                  label={translate('resources.settings.manual_post.price')}
                />
                <NumberInput
                  source={'manual_post.priceFormula'}
                  label={translate(
                    'resources.settings.manual_post.priceFormula'
                  )}
                />
                <NumberInput
                  source={'manual_post.base_price'}
                  label={translate('resources.settings.manual_post.base_price')}
                />
                <NumberInput
                  source={'manual_post.min_price'}
                  label={translate('resources.settings.manual_post.min_price')}
                />
                <NumberInput
                  source={'manual_post.max_price'}
                  label={translate('resources.settings.manual_post.max_price')}
                />
                <ArrayInput
                  source="manual_post.cities"
                  label={translate('resources.settings.manual_post.cities')}>
                  <SimpleFormIterator>
                    <TextInput
                      fullWidth
                      source="manual_post.cities.id"
                      label={translate(
                        'resources.settings.manual_post.citiesProps.id'
                      )}
                    />
                    <TextInput
                      fullWidth
                      source={'manual_post.cities.name'}
                      label={translate(
                        'resources.settings.manual_post.citiesProps.name'
                      )}
                    />
                  </SimpleFormIterator>
                </ArrayInput>
                <ArrayInput
                  source="manual_post.states"
                  label={translate('resources.settings.manual_post.states')}>
                  <SimpleFormIterator>
                    <TextInput
                      fullWidth
                      source="manual_post.states.id"
                      label={translate(
                        'resources.settings.manual_post.statesProps.id'
                      )}
                    />
                    <TextInput
                      fullWidth
                      source={'manual_post.states.name'}
                      label={translate(
                        'resources.settings.manual_post.statesProps.name'
                      )}
                    />
                  </SimpleFormIterator>
                </ArrayInput>
                <NumberInput
                  source={'manual_post.products_min_price'}
                  label={translate(
                    'resources.settings.manual_post.products_min_price'
                  )}
                />
                <NumberInput
                  source={'manual_post.products_max_price'}
                  label={translate(
                    'resources.settings.manual_post.products_max_price'
                  )}
                />
                <NumberInput
                  source={'manual_post.products_min_weight'}
                  label={translate(
                    'resources.settings.manual_post.products_min_weight'
                  )}
                />
                <NumberInput
                  source={'manual_post.products_max_weight'}
                  label={translate(
                    'resources.settings.manual_post.products_max_weight'
                  )}
                />
              </SimpleFormIterator>
            </ArrayInput>
          </div>

          <div id="config-sms-message-on">
            <TextInput
              fullWidth
              source={'sms_message_on.approach_transaction_expiration'}
              label={translate(
                'resources.settings.sms_message_on.approach_transaction_expiration'
              )}
            />
            <TextInput
              fullWidth
              source={'sms_message_on.paid_order'}
              label={translate('resources.settings.sms_message_on.paid_order')}
            />
            <TextInput
              fullWidth
              source={'sms_message_on.cancel_order'}
              label={translate(
                'resources.settings.sms_message_on.cancel_order'
              )}
            />
            <TextInput
              fullWidth
              source={'sms_message_on.post_order'}
              label={translate('resources.settings.sms_message_on.post_order')}
            />
            <TextInput
              fullWidth
              source={'sms_message_on.complete_order'}
              label={translate(
                'resources.settings.sms_message_on.complete_order'
              )}
            />
          </div>
        </SimpleForm>
      </Paper>
    )
  );
}
