import {
  ArrayInput,
  BooleanInput,
  ImageField,
  ImageInput,
  Loading,
  NumberInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  maxValue,
  minValue,
  required,
  useTranslate,
  SaveButton,
  Toolbar,
} from 'react-admin';

import { Paper } from '@mui/material';

import { Box } from '@mui/material';

import { useEffect, useState } from 'react';

import { ColorPicker } from '@/components';

import useFetch from '@/hooks/useFetch';

import styles from '@/assets/SystemConfigs.module.css';
import useSubmit from '@/hooks/useSubmit';

import useUploadImage from '@/hooks/useUploadImage';

import { WebAppConfigProps } from './types';

export default function SystemConfigs(props) {
  const WebAppConfigData = useFetch({
    requestQuery: '/config/system',
  });
  const translate = useTranslate();
  const { isLoading, sendRequest, data } = useSubmit();
  const SingleImageUploader = useUploadImage();

  const [colorsObj, setColorsObj] = useState({
    background: '#fff',
    footerBackground: '#fff',
    primary: '#2D3488',
    secondary: '#fff',
    text: '#000',
  });
  const { background, footerBackground, primary, secondary, text } = colorsObj;

  // console.log(SingleImageUploader);

  useEffect(() => {
    WebAppConfigData.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  //customize <SaveButton/> in simpleForm
  const CustomToolbar = (props) => (
    <Toolbar {...props} className={'dfghjk'}>
      <SaveButton alwaysEnable disabled={isLoading} />
    </Toolbar>
  );

  //append colors to values object before sending data
  const appendColors = (val) => {
    val.color.primary =
      colorsObj.primary !== '#2D3488'
        ? colorsObj.primary
        : (WebAppConfigData.data as { data: WebAppConfigProps })?.data.color
            .primary;

    val.color.secondary =
      colorsObj.secondary !== '#fff'
        ? colorsObj.secondary
        : (WebAppConfigData.data as { data: WebAppConfigProps })?.data.color
            .secondary;

    val.color.background =
      colorsObj.background !== '#fff'
        ? colorsObj.background
        : (WebAppConfigData.data as { data: WebAppConfigProps })?.data.color
            .background;

    val.color.footerBackground =
      colorsObj.footerBackground !== '#fff'
        ? colorsObj.footerBackground
        : (WebAppConfigData.data as { data: WebAppConfigProps })?.data.color
            .footerBackground;

    val.color.text =
      colorsObj.text !== '#000'
        ? colorsObj.text
        : (WebAppConfigData.data as { data: WebAppConfigProps })?.data.color
            .text;
  };

  // console.log('image data is : ', SingleImageUploader.fileData);e

  return WebAppConfigData.isLoading || isLoading ? (
    <Loading />
  ) : WebAppConfigData.error ? (
    <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
      مشکل در دریافت اطلاعات از سرور
    </p>
  ) : (
    WebAppConfigData.data && (
      <Paper className={styles.container}>
        <SimpleForm
          {...props}
          toolbar={<CustomToolbar />}
          defaultValues={
            (WebAppConfigData.data as { data: WebAppConfigProps })?.data || null
          }
          onSubmit={(values) => {
            appendColors(values);

            sendRequest(
              '/config/system',
              {
                ...values,
                favicon_id: SingleImageUploader.fileData?._id,
              },
              'put'
            );
          }}>
          <div id="config-favicon" style={{ padding: '1rem' }}>
            <p
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {translate('resources.settings.favicon.title')}
            </p>

            <ImageInput
              className={'the-label2 show-image-uploader'}
              source={'favicon_id'}
              label={translate('resources.settings.uploadLogo')}
              accept=".ico"
              // disabled={loading}
              options={{
                onDrop: (file) => {
                  const result = SingleImageUploader.uploadImage(file[0]);
                  console.log('resutl is ', result);
                },
              }}>
              <ImageField source="src" title="title" />
            </ImageInput>
          </div>
          <div>
            {(
              WebAppConfigData.data as { data: WebAppConfigProps }
            )?.data.favicons.map((item: any) => (
              <div key={item._id} className={styles.faviconContainer}>
                <img
                  src={
                    `${process.env.REACT_APP_API_BASE_URL_DEV}/` +
                      item.source || ''
                  }
                  alt="favicon"
                  className={styles.favicon}
                />
              </div>
            ))}
          </div>
          <Box>
            <div className={'row'}>
              <div className={'col-md-2'}>
                <label className={'the-label2'}>
                  {translate('resources.settings.primaryColor')}
                </label>
                <ColorPicker
                  className={'input-color'}
                  source={'color.primary'}
                  color={
                    (WebAppConfigData.data as { data: WebAppConfigProps })?.data
                      .color.primary || primary
                  }
                  onChangeComplete={(e) =>
                    setColorsObj({ ...colorsObj, primary: e })
                  }
                  placement="right"
                />
              </div>
              <div className={'col-md-2'}>
                <label className={'the-label2'}>
                  {translate('resources.settings.secondaryColor')}
                </label>
                <ColorPicker
                  className={'input-color'}
                  source={'color.secondary'}
                  color={
                    (WebAppConfigData.data as { data: WebAppConfigProps })?.data
                      .color.secondary || secondary
                  }
                  onChangeComplete={(e) =>
                    setColorsObj({ ...colorsObj, secondary: e })
                  }
                  placement="right"
                />
              </div>
              <div className={'col-md-2'}>
                <label className={'the-label2'}>
                  {translate('resources.settings.textColor')}
                </label>
                <ColorPicker
                  className={'input-color'}
                  source={'color.text'}
                  color={
                    (WebAppConfigData.data as { data: WebAppConfigProps })?.data
                      .color.text || text
                  }
                  onChangeComplete={(e) =>
                    setColorsObj({ ...colorsObj, text: e })
                  }
                  placement="right"
                />
              </div>
              <div className={'col-md-2'}>
                <label className={'the-label2'}>
                  {translate('resources.settings.bgColor')}
                </label>
                <ColorPicker
                  className={'input-color'}
                  source={'color.background'}
                  color={
                    (WebAppConfigData.data as { data: WebAppConfigProps })?.data
                      .color.background || background
                  }
                  onChangeComplete={(e) =>
                    setColorsObj({ ...colorsObj, background: e })
                  }
                  placement="right"
                />
              </div>
              <div className={'col-md-2'}>
                <label className={'the-label2'}>
                  {translate('resources.settings.footerBgColor')}
                </label>
                <ColorPicker
                  className={'input-color'}
                  source={'color.footerBackground'}
                  color={
                    (WebAppConfigData.data as { data: WebAppConfigProps })?.data
                      .color.footerBackground || footerBackground
                  }
                  onChangeComplete={(e) =>
                    setColorsObj({
                      ...colorsObj,
                      footerBackground: e,
                    })
                  }
                  placement="right"
                />
              </div>
              <div className={'col-md-2'}></div>
            </div>
          </Box>
          <div>
            <p
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {translate('resources.settings.metaTags')}
            </p>
          </div>
          <TextInput
            multiline
            fullWidth
            minRows={3}
            source={'meta_title'}
            label={translate('resources.settings.meta_title')}
          />
          <TextInput
            fullWidth
            multiline
            minRows={3}
            source={'meta_description'}
            label={translate('resources.settings.meta_description')}
          />
          <div id="config-head-inputs" style={{ padding: '1rem' }}>
            <p
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {translate('resources.settings.head.title')}
            </p>
          </div>
          <TextInput
            multiline
            minRows={8}
            fullWidth
            source={'head_first'}
            label={translate('resources.settings.head.head_first')}
          />
          <TextInput
            multiline
            minRows={8}
            fullWidth
            source={'head_last'}
            label={translate('resources.settings.head.head_last')}
          />

          <div id="config-body-inputs" style={{ padding: '1rem' }}>
            <p
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {translate('resources.settings.body.title')}
            </p>
            {/* <TextInput
              multiline
              minRows={8}
              fullWidth
              source={'body_first'}
              label={translate('resources.settings.body.body_first')}
            />
            <TextInput
              multiline
              minRows={8}
              fullWidth
              source={'body_last'}
              label={translate('resources.settings.body.body_last')}
            /> */}
          </div>
          <TextInput
            multiline
            minRows={8}
            fullWidth
            source={'body_first'}
            label={translate('resources.settings.body.body_first')}
          />
          <TextInput
            multiline
            minRows={8}
            fullWidth
            source={'body_last'}
            label={translate('resources.settings.body.body_last')}
          />
          <TextInput
            multiline
            minRows={2}
            className={styles.input}
            source="app_name"
            label={translate('resources.settings.shop_name')}
            // validate={required()}
          />
          <NumberInput
            source="tax"
            label={translate('resources.settings.taxAmount')}
            validate={[minValue(0), maxValue(1)]}
          />
          <div id="config-consumer_status">
            <ArrayInput
              source="consumer_status"
              label={translate('resources.settings.consumerStatus')}>
              <SimpleFormIterator>
                <TextInput
                  fullWidth
                  source={'key'}
                  label={translate('resources.settings.consumer_status.key')}
                />
                <TextInput
                  fullWidth
                  source={'value'}
                  label={translate('resources.settings.consumer_status.value')}
                />
              </SimpleFormIterator>
            </ArrayInput>
          </div>
          <TextInput
            source="currency"
            label={translate('resources.settings.currency.title')}
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
            multiline
            source="shop_inactive_message"
            className={styles.input}
            label={translate('resources.settings.siteActiveMessage')}
            // validate={required()}
          />
          <TextInput
            multiline
            minRows={3}
            source="entry_submit_message"
            className={styles.input}
            label={translate('resources.settings.entry_submit_message')}
            // validate={required()}
          />
          <TextInput
            multiline
            minRows={3}
            source="payment_redirect"
            className={styles.input}
            label={translate('resources.settings.payment_redirect')}
            // validate={required()}
          />

          <div id="config-limit-inputs" style={{ padding: '1.5rem' }}>
            <p
              style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {translate('resources.settings.limit.headTitle')}
            </p>
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

          <div id="config-manualpost-inputs" style={{ padding: '1rem' }}>
            <p
              style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {translate('resources.settings.manual_post.headTitle')}
            </p>
            <ArrayInput
              source="manual_post"
              label={translate('resources.settings.manualPost')}>
              <SimpleFormIterator>
                <TextInput
                  multiline
                  fullWidth
                  source="id"
                  label={translate('resources.settings.manual_post.id')}
                />
                <TextInput
                  multiline
                  fullWidth
                  minRows={2}
                  source={'provider'}
                  label={translate('resources.settings.manual_post.provider')}
                />
                <TextInput
                  multiline
                  fullWidth
                  minRows={2}
                  source={'title'}
                  label={translate('resources.settings.manual_post.title')}
                />
                <TextInput
                  multiline
                  fullWidth
                  minRows={2}
                  source={'description'}
                  label={translate(
                    'resources.settings.manual_post.description'
                  )}
                />
                <BooleanInput
                  source={'active'}
                  label={translate('resources.settings.manual_post.active')}
                />
                <NumberInput
                  source={'price'}
                  label={translate('resources.settings.manual_post.price')}
                />
                <NumberInput
                  source={'priceFormula'}
                  label={translate(
                    'resources.settings.manual_post.priceFormula'
                  )}
                />
                <NumberInput
                  source={'base_price'}
                  label={translate('resources.settings.manual_post.base_price')}
                />
                <NumberInput
                  source={'min_price'}
                  label={translate('resources.settings.manual_post.min_price')}
                />
                <NumberInput
                  source={'max_price'}
                  label={translate('resources.settings.manual_post.max_price')}
                />
                <ArrayInput
                  source="cities"
                  label={translate('resources.settings.manual_post.cities')}>
                  <SimpleFormIterator source="cities">
                    <TextInput
                      fullWidth
                      source="" // Set source to null to prevent creating an object
                      label={translate(
                        'resources.settings.manual_post.citiesProps.name'
                      )}
                    />
                  </SimpleFormIterator>
                </ArrayInput>
                <ArrayInput
                  source="states"
                  label={translate('resources.settings.manual_post.states')}>
                  <SimpleFormIterator>
                    <TextInput
                      fullWidth
                      source=""
                      // source={'name'}
                      label={translate(
                        'resources.settings.manual_post.statesProps.name'
                      )}
                    />
                  </SimpleFormIterator>
                </ArrayInput>

                <NumberInput
                  source={'products_min_price'}
                  label={translate(
                    'resources.settings.manual_post.products_min_price'
                  )}
                />
                <NumberInput
                  source={'products_max_price'}
                  label={translate(
                    'resources.settings.manual_post.products_max_price'
                  )}
                />
                <NumberInput
                  source={'products_min_weight'}
                  label={translate(
                    'resources.settings.manual_post.products_min_weight'
                  )}
                />
                <NumberInput
                  source={'products_max_weight'}
                  label={translate(
                    'resources.settings.manual_post.products_max_weight'
                  )}
                />
              </SimpleFormIterator>
            </ArrayInput>
          </div>

          <div id="config-sms-message-on" style={{ padding: '1rem' }}>
            <p
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {translate('resources.settings.sms_message_on.title')}
            </p>
            <TextInput
              fullWidth
              multiline
              minRows={3}
              source={'sms_message_on.register'}
              label={translate('resources.settings.sms_message_on.register')}
            />
            <TextInput
              fullWidth
              multiline
              minRows={3}
              source={'sms_message_on.approach_transaction_expiration'}
              label={translate(
                'resources.settings.sms_message_on.approach_transaction_expiration'
              )}
            />
            <TextInput
              multiline
              fullWidth
              minRows={3}
              source={'sms_message_on.paid_order'}
              label={translate('resources.settings.sms_message_on.paid_order')}
            />
            <TextInput
              multiline
              fullWidth
              minRows={3}
              source={'sms_message_on.cancel_order'}
              label={translate(
                'resources.settings.sms_message_on.cancel_order'
              )}
            />
            <TextInput
              multiline
              fullWidth
              minRows={3}
              source={'sms_message_on.post_order'}
              label={translate('resources.settings.sms_message_on.post_order')}
            />
            <TextInput
              multiline
              fullWidth
              minRows={3}
              source={'sms_message_on.complete_order'}
              label={translate(
                'resources.settings.sms_message_on.complete_order'
              )}
            />
          </div>

          <div id="config-factor-details" style={{ padding: '1rem' }}>
            <p
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {translate('resources.settings.factor.title')}
            </p>
            <TextInput
              fullWidth
              source={'factor.name'}
              label={translate('resources.settings.factor.name')}
              validate={required()}
            />
            <TextInput
              fullWidth
              source={'factor.url'}
              label={translate('resources.settings.factor.url')}
              validate={required()}
            />
            <TextInput
              multiline
              fullWidth
              minRows={3}
              source={'factor.address'}
              label={translate('resources.settings.factor.address')}
            />
            <TextInput
              fullWidth
              source={'factor.tel'}
              label={translate('resources.settings.factor.tel')}
            />
            <TextInput
              fullWidth
              source={'factor.fax'}
              label={translate('resources.settings.factor.fax')}
            />
            <TextInput
              fullWidth
              source={'factor.postalCode'}
              label={translate('resources.settings.factor.postalCode')}
            />
            <TextInput
              fullWidth
              source={'factor.registrationCode'}
              label={translate('resources.settings.factor.registrationCode')}
            />
            <TextInput
              fullWidth
              source={'factor.economicCode'}
              label={translate('resources.settings.factor.economicCode')}
            />
          </div>
        </SimpleForm>
      </Paper>
    )
  );
}
