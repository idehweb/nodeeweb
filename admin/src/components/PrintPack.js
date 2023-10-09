// import {SimpleForm} from 'react-admin';
import React, { useEffect } from 'react';

// import logo from '../assets/img/logo.svg';
import IRANSansWeb_font_eot from '../assets/fonts/eot/IRANSansWeb.eot';
import IRANSansWeb_font_woff2 from '../assets/fonts/woff2/IRANSansWeb.woff2';
import IRANSansWeb_font_woff from '../assets/fonts/woff/IRANSansWeb.woff';
import IRANSansWeb_font_ttf from '../assets/fonts/ttf/IRANSansWeb.ttf';
import { dateFormat } from '@/functions';
// export const logo = require('../assets/img/logo.svg');
import API, { BASE_URL } from '@/functions/API';

export default (props) => {
  // console.log(props.record);
  const divRef = React.useRef();
  const [tel, Stel] = React.useState('');
  // const [cfirstName, ScfirstName] = React.useState(props.record.customer.firstName+' '+props.record.customer.lastName);

  let fname = '',
    lname = '';
  if (props.record.customer_data) {
    if (props.record.customer_data.firstName) {
      fname = props.record.customer_data.firstName;
    }
    if (props.record.customer_data.lastName) {
      lname = props.record.customer_data.lastName;
    }
  }

  if (props.record.customer) {
    if (props.record.customer.firstName) {
      fname = props.record.customer.firstName;
    }
    if (props.record.customer.lastName) {
      lname = props.record.customer.lastName;
    }
  }

  const [cfirstName, ScfirstName] = React.useState(fname + ' ' + lname);
  const [ersal, Sersal] = React.useState(props.record.deliveryPrice || 0);

  // const [clastName, SclastName] = React.useState(props.record.customer.lastName);
  // const [caddress, Scaddress] = React.useState(props.record.billingAddress.State + '، ' + props.record.billingAddress.City + '، ' + props.record.billingAddress.StreetAddress);
  const [caddress, Scaddress] = React.useState(
    props.record.billingAddress && props.record.billingAddress.State
      ? props.record.billingAddress.State +
          '، ' +
          props.record.billingAddress.City +
          '، ' +
          props.record.billingAddress.StreetAddress
      : ''
  );

  // const [codeposti, Scodeposti] = React.useState(props.record.billingAddress.PostalCode);
  const [codeposti, Scodeposti] = React.useState(
    props.record.billingAddress && props.record.billingAddress.PostalCode
      ? props.record.billingAddress.PostalCode
      : ''
  );

  // const [caddress, Scaddress] = React.useState(props.record.billingAddress.StreetAddress);
  const [amount, Samount] = React.useState(props.record.amount || 0);
  const [deliveryDay, SdeliveryDay] = React.useState(
    props.record.deliveryDay || 0
  );
  const [sum, SSum] = React.useState(props.record.sum || 0);
  const [shopData, SetShopData] = React.useState({
    factore_shop_address: '',
    factore_shop_faxNumber: '',
    factore_shop_internationalCode: '',
    factore_shop_name: '',
    factore_shop_phoneNumber: '',
    factore_shop_postalCode: '',
    factore_shop_submitCode: '',
  });

  const getShopData = () => {
    API.get('/settings/factore')
      .then(({ data = {} }) => {
        // setLoading(false);
        // Object.keys(data).forEach(d => {
        //   setValue(d, data[d]);
        // });
        // console.log(d);
        SetShopData({ ...data });
        if (data.factore_shop_phoneNumber) Stel(data.factore_shop_phoneNumber);
        // setValue("title",data.title);
        // setTheData(true);
        return data;
      })
      .catch((e) => {
        // setLoading(false);
        // setTheData(true);
      });
  };
  useEffect(() => {
    console.log('getShopData');
    getShopData();
  }, []);
  const changeInput = (s, t) => {
    // console.log('changeInput', s, t);
    switch (s) {
      case 'tel':
        return Stel(t.target.value);
        break;
      case 'cfirstName':
        return ScfirstName(t.target.value);
        break;
      case 'caddress':
        return Scaddress(t.target.value);
        break;
      case 'codeposti':
        return Scodeposti(t.target.value);
        break;
      case 'sum':
        return SSum(t.target.value.toString().replace(/,/g, ''));
        break;
      case 'amount':
        return Samount(t.target.value.toString().replace(/,/g, ''));
        break;
    }
  };
  const handleClick = () => {
    // console.log();

    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write(
      '<html><head><title>' + document.title + '</title>'
    );
    mywindow.document.write(
      ' <style>\n' +
        '        @font-face {\n' +
        '            font-family: IRANSans;\n' +
        '            font-style: normal;\n' +
        '            src: url(' +
        IRANSansWeb_font_eot +
        ');\n' +
        '            src: url(' +
        IRANSansWeb_font_eot +
        '?#iefix) format("embedded-opentype"),' +
        ' url(' +
        IRANSansWeb_font_woff2 +
        ') format("woff2"),' +
        ' url(' +
        IRANSansWeb_font_woff +
        ') format("woff"),' +
        ' url(' +
        IRANSansWeb_font_ttf +
        ') format("truetype")\n' +
        '        }\n' +
        '\n' +
        '\n' +
        '        .order-details td.product {\n' +
        '            text-align: right;\n' +
        '        }\n' +
        '\n' +
        '        th, td {\n' +
        '            vertical-align: top;\n' +
        '            text-align: center;\n' +
        '        }\n' +
        '\n' +
        '\n' +
        '        table {\n' +
        '            width: 100%;\n' +
        '            text-align: center;\n' +
        '        }\n' +
        '\n' +
        '        body {\n' +
        '            padding: 10px;\n' +
        '            font-family: IRANSans;\n' +
        '            direction: rtl;\n' +
        '            line-height: 20px;\n' +
        '        }\n' +
        '\n' +
        '        p {\n' +
        '            display: inline-block;\n' +
        '        }\n' +
        '\n' +
        '        .order-details th {\n' +
        '            text-align: center;\n' +
        '        }\n' +
        '\n' +
        '\n' +
        '        .shop-name {\n' +
        '            margin-bottom: 0;\n' +
        '        }\n' +
        '\n' +
        '\n' +
        '        .shop-name h3 {\n' +
        '            margin-bottom: 0;\n' +
        '        }\n' +
        '\n' +
        '\n' +
        '        .document-type-label {\n' +
        '            margin-top: 0;\n' +
        '            margin-bottom: 0;\n' +
        '        }\n' +
        '\n' +
        '\n' +
        '        .textAlignR {\n' +
        '            text-align: right;\n' +
        '        }\n' +
        '\n' +
        '        .quantity {\n' +
        '            width: 60px;\n' +
        '        }\n' +
        '\n' +
        '        .order-data-addresses td {\n' +
        '            vertical-align: middle;\n' +
        '            padding: 10px;\n' +
        '        }\n' +
        '\n' +
        '        #theprint textarea{\n' +
        '    float: left;\n' +
        '    line-height: 15px;' +
        '       }\n' +
        '        #theprint .address{\n' +
        '    width: calc(100% - 50px) !important;' +
        '       }\n' +
        '        #theprint input,#theprint textarea{\n' +
        '            border: none;\n' +
        '            width: 100%;\n' +
        '            font-family: IRANSans;\n' +
        '            display: inline-block;\n' +
        '        }\n' +
        '        #theprint input{\n' +
        '            border: none;\n' +
        '        }\n' +
        '\n' +
        '\n' +
        '        .order-data-addresses tr td:nth-child(2) {\n' +
        '            text-align: right;\n' +
        '        }\n' +
        '\n' +
        '        table.order-data-addresses,\n' +
        '        table.order-data-addresses th,\n' +
        '        table.order-data-addresses td,\n' +
        '        table.order-details,\n' +
        '        table.order-details th,\n' +
        '        table.order-details td {\n' +
        '            vertical-align: middle;\n' +
        '            border: 1px solid black;\n' +
        '            border-collapse: collapse;\n' +
        '            font-size: 13px;\n' +
        '            line-height: 19px;\n' +
        '            padding: 2px 5px;\n' +
        '            background-color: #fff;\n' +
        '            color: #000;\n' +
        '        }\n' +
        '\n' +
        '        table.order-details {\n' +
        '\n' +
        '        }\n' +
        '\n' +
        '        .order-data-addresses, .order-details {\n' +
        '            margin-bottom: 0 !important;\n' +
        '        }\n' +
        '\n' +
        '        .order-data-addresses.totals {\n' +
        '            margin-bottom: 0 !important;\n' +
        '            margin-top: 0 !important;\n' +
        '\n' +
        '        }\n' +
        '\n' +
        '        .width300 {\n' +
        '            width: 300px;\n' +
        '\n' +
        '        }\n' +
        '\n' +
        '        .kjhgf img {\n' +
        '            width: 65px !important;\n' +
        '        }\n' +
        '        @media print {\n' +
        '        .no-print {\n' +
        '            display: none !important;\n' +
        '        }\n' +
        '        }\n' +
        '    </style>'
    );
    mywindow.document.write('</head><body >');
    // mywindow.document.write('<h1>' + document.title + '</h1>');
    mywindow.document.write(divRef.current.outerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(function () {
      mywindow.print();
      // mywindo//w.close();

      return true;
    }, 2000);
  };
  // handleClick();
  let {
    factore_shop_name,
    factore_shop_phoneNumber,
    factore_shop_address,
    factore_shop_site_name,
    factore_shop_site_address,
    factore_shop_internationalCode,
    factore_shop_submitCode,
  } = shopData;

  return (
    <div id={'theprint'} ref={divRef}>
      <button onClick={handleClick} className={'no-print'}>
        print
      </button>
      <table className="head container ">
        <tr>
          <td className="header">
            <div className="kjhgf">
              {/*<?php*/}
              {/*if ($this->has_header_logo()) {*/}
              {/*$this->header_logo();*/}
              {/*} else {*/}
              {/*echo $this->get_title();*/}
              {/*}*/}
              {/*?>*/}
              {/*<img style={{width: '130px'}} src={logo}/>*/}
            </div>
          </td>
          <td className="shop-info">
            {/*<?php do_action('wpo_wcpdf_before_shop_name', $this->get_type(), $this->order); ?>*/}
            <div className="shop-name">
              <h3>رسید حمل و نقل</h3>
            </div>
            <h1 className="document-type-label">{factore_shop_name}</h1>
          </td>
          <td className="shop-info">
            <div>
              <span>شماره فاکتور:</span>
              <span>{props.record.orderNumber}</span>
            </div>
            <div className="order-number">
              <span>شماره سفارش:</span>
              <span>{props.record.orderNumber}</span>
            </div>
            <div className="invoice-date">
              <span>تاریخ:</span>
              <span>{dateFormat(props.record.createdAt)}</span>
            </div>
          </td>
        </tr>
      </table>

      <table className="order-data-addresses ">
        <tr>
          <td>ارسال کننده</td>
          <td>
            <div>
              <span>{factore_shop_name} - </span>
              <span>تلفن: </span>
              {factore_shop_phoneNumber}-<span>سایت: </span>
              {factore_shop_site_address}
            </div>

            <div>
              <span>آدرس: </span>
              {factore_shop_address}
            </div>
          </td>
        </tr>
        <tr>
          <td>دریافت کننده</td>
          <td>
            <div>
              <div>
                <span>نام خریدار: </span>
                <input
                  style={{ width: '400px' }}
                  value={cfirstName}
                  onChange={(e) => changeInput('cfirstName', e)}
                />
                {/*<input value={clastName} onChange={(e) => changeInput('clastName', e)}/>*/}
                {/*<?php echo $order_data['billing']['first_name'] . ' ' . $order_data['billing']['last_name']; ?>*/}
                {/*<span>-</span>*/}
              </div>

              <div>
                <span>شماره تماس: </span>
                <span className="billing-phone">
                  {/*{props.record.customer && props.record.customer.phoneNumber}*/}
                  {props.record.customer && props.record.customer.phoneNumber}
                  {!props.record.customer &&
                    props.record.customer_data &&
                    props.record.customer_data.phoneNumber}

                  {props.record.billingAddress &&
                    props.record.billingAddress.PhoneNumber && (
                      <span>
                        <span> - </span>
                        {props.record.billingAddress.PhoneNumber}
                      </span>
                    )}
                </span>
              </div>
              <div>
                <span>کد پستی: </span>
                <input
                  style={{ width: '400px' }}
                  value={codeposti}
                  onChange={(e) => changeInput('codeposti', e)}
                />
              </div>
            </div>
            <div>
              <span>نشانی: </span>
              <span>
                <textarea
                  className={'address'}
                  wrap="off"
                  onChange={(e) => changeInput('caddress', e)}
                  value={caddress}
                />
              </span>

              {/*{props.record.billingAddress && props.record.billingAddress.StreetAddress}//*/}

              {/*<?php echo $order_data['billing']['city'] . '، ' . $order_data['billing']['address_1']; ?>*/}
            </div>
          </td>
        </tr>
      </table>

      <table className="order-data-addresses totals ">
        <tr>
          <td className={'textAlignR'}>
            <div>
              <span>روش ارسال: </span>
              {deliveryDay.title}
            </div>
            <div>
              <span>روش پرداخت: </span>
              درگاه آنلاین
              {/*<?php $this->payment_method(); ?>*/}
            </div>
          </td>
          <td className={'textAlignR'}>
            <div>
              <span>جمع کل (تومان): </span>
              {/*{props.record.c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}*/}
              <input
                className={'width80'}
                value={sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                onChange={(e) => changeInput('sum', e)}
              />
              {/*<?php echo number_format($order_data['total']) . ' تومان'; ?>*/}
            </div>
            <div>
              <span>تخفیف (تومان): </span>
              {/*<?php echo number_format($order_data['discount_total']) . ' تومان'; ?>*/}
            </div>

            <div>
              <span>هزینه ارسال (تومان): </span>
              {ersal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}

              {/*<?php echo number_format($order_data['shipping_total']) . ' تومان'; ?>*/}
            </div>
            <div>
              <span>قابل پرداخت (تومان): </span>

              <input
                className={'width80'}
                value={amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                onChange={(e) => changeInput('amount', e)}
              />
              {/*<?php echo number_format($order_data['total']) . ' تومان'; ?>*/}
            </div>
          </td>
          <td className={'textAlignR width300'}>امضا گیرنده:</td>
        </tr>
      </table>

      <div className="bottom-spacer"></div>
      {/*{handleClick()}*/}
    </div>
  );
};
