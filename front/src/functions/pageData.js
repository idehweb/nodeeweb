import {store} from '#c/functions/store';
import {
  addToDataArray,
  buy,
  contactBoy,
  createOrder,
  savePost,
  sendExtra,
  sendSms,
  pushArrayToDataArray,
} from '#c/functions/index';
import { toast } from 'react-toastify';
// console.log('store',store);
let pageData = {

  submitOrder: {
    add: {
      data: {},
      fields: [
        {
          type: 'input',
          label: 'First Name',
          size: {
            sm: 12,
            lg: 12,
          },

          onChange: (text) => {
            pageData.submitOrder.add.data['firstName'] = text;
            pageData.submitOrder.add.fields[0]['value'] = text;
          },
          placeholder: 'First Name',
          child: [],
          // value:''
          value: store.getState().store.firstName || '',
        },
        {
          type: 'input',
          label: 'Last Name',

          size: {
            sm: 12,
            lg: 12,
          },
          onChange: (text) => {
            pageData.submitOrder.add.data['lastName'] = text;
          },
          placeholder: 'Last Name',
          child: [],
          value: store.getState().store.lastName || '',
          // value:''
        },
        {
          type: 'email',
          label: 'Email',

          size: {
            sm: 12,
            lg: 12,
          },
          onChange: (text) => {
            pageData.submitOrder.add.data['email'] = text;
          },
          placeholder: 'Email (optional)',
          child: [],
          // value:''
          value: store.getState().store.email || '',
        },
        {
          type: 'input',
          label: 'Phone number',

          size: {
            sm: 12,
            lg: 12,
          },
          onChange: (text) => {
            pageData.submitOrder.add.data['phoneNumber'] = text;
          },
          className: 'ltr',
          placeholder: '0912*******',
          child: [],
          value: store.getState().store.phoneNumber || '',
        },

        {
          type: 'empty',
          size: {
            sm: 12,
            lg: 12,
          },
          className: 'height50',
          placeholder: '',
          child: [],
        },
      ],
      buttons: [
        {
          type: 'small',
          header: [],
          body: ['title', 'text'],
          url: '/order/',
          name: 'submit order and pay',
          className: 'ml-auto ffgg btn btn-accent btn-lg',
          size: {
            sm: 12,
            lg: 12,
          },
          onClick: async (e) => {
            console.log('this.data', pageData.submitOrder.add.data);
            let {
              firstName,
              lastName,
              phoneNumber,
              email,
            } = pageData.submitOrder.add.data;
            let { card, agent, link } = store.getState().store;
            let err = '';
            if (!firstName) err = 'Enter your first name';

            if (!lastName) err = 'Enter your last name';
            if (!phoneNumber) err = 'Enter your phone number';
            if (err) return toast.error(err);

            let s = 0;
            card.map((c, i) => {
              s += c.price;
              return;
            });
            createOrder({
              sum: s,
              customer_data: {
                firstName,
                lastName,
                phoneNumber,
                email,
              },
              card: card,
              agent: agent,
              link: link,
            }).then((res) => {
              console.log('res for judytgs is:', res.order._id);
              buy(res.order._id).then((add) => {
                console.log('ass', add);
                window.location.replace(add.url);
              });
            });
          },
        },
      ],
    },
  },
  sendSms: {
    add: {
      data: {},
      fields: [
        {
          type: 'input',
          label: 'شماره موبایل',

          size: {
            sm: 12,
            lg: 12,
          },
          onChange: (text) => {
            pageData.sendSms.add.data['phoneNumber'] = text;
          },
          className: 'ltr',
          placeholder: '0912*******',
          child: [],
          // value: pageData.sendSms.add.data['phoneNumber'] || ""
        },
        {
          type: 'textarea',
          label: 'متن اس ام اس',

          size: {
            sm: 12,
            lg: 12,
          },
          onChange: (text) => {
            pageData.sendSms.add.data['message'] = text;
          },
          className: 'ltr',
          placeholder: 'متن پیام',
          child: [],
          // value: pageData.sendSms.add.data['message'] || ""
        },

        {
          type: 'empty',
          size: {
            sm: 12,
            lg: 12,
          },
          className: 'height50',
          placeholder: '',
          child: [],
        },
      ],
      buttons: [
        {
          type: 'small',
          header: [],
          body: ['title', 'text'],
          url: '/order/',
          name: 'Send sms',
          className: 'ml-auto ffgg btn btn-accent btn-lg',
          size: {
            sm: 12,
            lg: 12,
          },
          onClick: async (e) => {
            console.log('this.data', pageData.sendSms.add.data);
            let { phoneNumber, message } = pageData.sendSms.add.data;

            let err = '';
            if (!message) err = 'پیام خود را وارد کنید';

            if (!phoneNumber) err = 'شماره موبایل خود را وارد کنید';
            if (err) return toast.error(err);

            sendSms({
              phoneNumber,
              message,
            }).then((res) => {
              if (res.success) {
                toast.success('اس ام اس شما ارسال شد');
                pageData.sendSms.add.fields[1].value = '';
              } else toast.error('اس ام اس شما ارسال نشد');
            });
          },
        },
      ],
    },
  },

  createLink: {
    add: {
      data: {},
      fields: [
        {
          type: 'input',
          label: 'شماره موبایل',

          size: {
            sm: 6,
            lg: 6,
          },
          onChange: (text) => {
            pageData.boy.add.data['phoneNumber'] = text;
          },
          className: 'ltr',
          placeholder: '98912*******',
          child: [],
        },

        {
          type: 'empty',
          size: {
            sm: 12,
            lg: 12,
          },
          onChange: (text) => {
            savePost({ lastname: text });
            console.log(text);
          },
          className: 'height50',
          placeholder: 'ایمیل (اختیاری)',
          child: [],
        },
      ],
      buttons: [
        {
          type: 'small',
          header: [],
          body: [],
          params: ['phoneNumber'],
          url: '/boy/customer/number/',
          name: 'ثبت شماره',
          size: {
            sm: 12,
            lg: 6,
          },
          onClick: async (e) => {
            console.log('this.data', pageData.boy.add.data);
            let { phoneNumber } = pageData.boy.add.data;

            if (!phoneNumber) return toast.error('شماره تماس خود را وارد کنید');

            contactBoy(
              'boy/customer/number/' + phoneNumber,
              pageData.estekhdam.add.data
            ).then((res) => {
              console.log('res for addDriver is:', res);
              if (res.success) {
                toast.success(res.message + ' (' + res.customer.count + ') ');
              } else {
                toast.warning(res.message);
              }
            });
          },
        },
      ],
    },
  },
};

export default pageData;
