// import {SimpleForm} from 'react-admin';
import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import IRANSansWeb_font_eot from '../assets/fonts/eot/IRANSansWeb.eot';
import IRANSansWeb_font_woff2 from '../assets/fonts/woff2/IRANSansWeb.woff2';
import IRANSansWeb_font_woff from '../assets/fonts/woff/IRANSansWeb.woff';
import IRANSansWeb_font_ttf from '../assets/fonts/ttf/IRANSansWeb.ttf';
// export const logo = require('../assets/img/logo.svg');
import { dateFormat } from '@/functions';
import API, { BASE_URL } from '@/functions/API';

export default (props) => {
  // console.clear();
  console.log('psssssssssssssssssssssssss', props);
  const themeData = useSelector((st) => st.themeData);

  const divRef = React.useRef();
  const [tel, Stel] = React.useState('');
  // if(!props.record.customer_data){
  //     props.record.customer_data={
  //         firstName:''
  //     }
  // }
  let fname = '',
    lname = '',
    phoneNumber = '',
    discountCode = null;

  if (props.record.discountCode) {
    discountCode = props.record.discountCode;
  }
  if (props.record.customer) {
    if (props.record.customer.firstName) {
      fname = props.record.customer.firstName;
    }
    if (props.record.customer.lastName) {
      lname = props.record.customer.lastName;
    }
  }
  if (props.record.customer_data) {
    if (props.record.customer_data.firstName) {
      fname = props.record.customer_data.firstName;
    }
    if (props.record.customer_data.lastName) {
      lname = props.record.customer_data.lastName;
    }

    if (props.record.customer_data.phoneNumber) {
      phoneNumber = props.record.customer_data.phoneNumber;
    }
  }
  let sum = 0;
  if (props.record.sum) {
    sum = props.record.sum;
  }
  if (props.record.card) sum = 0;
  props.record.card.forEach((o) => {
    sum += o.salePrice || o.price;
  });
  props.record.card.forEach((o) => {
    sum *= o.count;
  });
  if (themeData && themeData.tax && themeData.taxAmount) {
    let y = (parseInt(themeData.taxAmount) * sum) / 100;
    y = parseInt(y);
    if (y) {
      sum = y + sum;
    }
  }
  const [cfirstName, ScfirstName] = React.useState(fname + ' ' + lname || '');
  const [codeMelli, ScodeMelli] = React.useState(
    props.record.customer_data && props.record.customer_data.internationalCode
      ? props.record.customer_data.internationalCode
      : ''
  );
  // const [clastName, SclastName] = React.useState(props.record.customer.lastName);
  const [caddress, Scaddress] = React.useState(
    props.record.billingAddress && props.record.billingAddress.State
      ? props.record.billingAddress.State +
          '، ' +
          props.record.billingAddress.City +
          '، ' +
          props.record.billingAddress.StreetAddress
      : ''
  );
  const [codeposti, Scodeposti] = React.useState(
    props.record.billingAddress && props.record.billingAddress.PostalCode
      ? props.record.billingAddress.PostalCode
      : ''
  );
  const [cpackage, Scpackage] = React.useState(props.record.package);
  const [csum, Scsum] = React.useState(sum);
  const [discount, Sdiscount] = React.useState(props.record.discount || 0);
  const [discountAmount, SdiscountAmount] = React.useState(
    props.record.discountAmount || 0
  );
  const [ersal, Sersal] = React.useState(props.record.deliveryPrice || 0);
  const [totalTaxAmount, settotalTaxAmount] = React.useState(
    props.record.taxAmount || 0
  );
  const [total, Stotal] = React.useState(props.record.sum || 0);
  // const [total, Stotal] = React.useState(props.record.sum || 0);
  const [amount, Samount] = React.useState(props.record.amount || 0);
  const [deliveryDay, SdeliveryDay] = React.useState(
    props.record.deliveryDay || 0
  );
  const [change, SetChange] = React.useState(0);
  const [shopData, SetShopData] = React.useState({
    factore_shop_address: '',
    factore_shop_faxNumber: '',
    factore_shop_internationalCode: '',
    factore_shop_name: '',
    factore_shop_phoneNumber: '',
    factore_shop_postalCode: '',
    factore_shop_site_address: '',
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
  const changePackage = (s, t, tyhj) => {
    // console.log('changePackage', s, t.target.value, tyhj);
    cpackage[tyhj][s] = t.target.value;
    if (s == 'price') {
      // console.log('t.target.value.toString()',t.target.value.toString().replace(/,/g,'') );
      cpackage[tyhj][s] = t.target.value
        .toString()
        .replace(/,/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if (s == 'total_price') {
      // console.log('t.target.value.toString()',t.target.value.toString().replace(/,/g,'') );
      cpackage[tyhj][s] = t.target.value
        .toString()
        .replace(/,/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    let tt = cpackage;
    Scpackage([]);
    Scpackage(tt);
    SetChange(!change);
  };
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
      case 'csum':
        return Scsum(t.target.value.toString().replace(/,/g, ''));
        break;
      case 'discount':
        return Sdiscount(t.target.value.toString().replace(/,/g, ''));
        break;

      case 'discountAmount':
        return SdiscountAmount(t.target.value.toString().replace(/,/g, ''));
        break;
      case 'ersal':
        return Sersal(t.target.value.toString().replace(/,/g, ''));
        break;
      case 'totalTaxAmount':
        return settotalTaxAmount(t.target.value.toString().replace(/,/g, ''));
        break;
      case 'total':
        return Stotal(t.target.value.toString().replace(/,/g, ''));
        break;
      case 'amount':
        return Samount(t.target.value.toString().replace(/,/g, ''));
        break;
    }
  };
  const taxAccount = (item) => {
    return 'ji';
    if (item) {
      return item.price;
      let x = 0;

      if (discount && discount != props.record.discountAmount) {
        x = 0;
        x = (discount * item.price) / 100;
        x = parseInt(x);
        x = item.price - x;
      }
      if (discount && discount == props.record.discountAmount) {
        x = 0;
        x = item.price - parseInt(discount);
      }
      let f = item.price;
      if (x) {
        f = x;
      }
      let p = (themeData.taxAmount * f) / 100;
      p = parseInt(p);
      return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };
  const returnDiscountOfPRice = (item) => {
    if (item) {
      let p = (discount * item.price) / 100;
      if (discount == props.record.discountAmount) {
        if (props.record.card && props.record.card.length) {
          let v = discount / props.record.card.length;

          return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      }
      p = parseInt(p);
      if (p) return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      else return 0;
    }
  };
  const returnAfterDiscountOfPRice = (item) => {
    if (item) {
      let p = (discount * item.price) / 100;
      if (discount == props.record.discountAmount) {
        if (props.record.card && props.record.card.length) {
          let v = discount / props.record.card.length;

          p = v;
        }
      }
      p = parseInt(p);
      if (p) {
        p = parseInt(item.price) - p;
        return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else return item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };
  const returnTaxAccountToTotal = (item) => {
    if (item) {
      let x = 0;
      if (discount && discount != props.record.discountAmount) {
        x = (discount * item.price) / 100;
        x = parseInt(x);
        x = item.price - x;
      }
      let f = item.price;
      if (x) {
        f = x;
      }
      let p = (themeData.taxAmount * f) / 100;
      p = parseInt(p);
      p = p + f;
      return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };
  const handleClick = () => {
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
        '\n' +
        '\n' +
        '        table.order-details td.price,table.order-details th.price{\n' +
        '        width:120px !important;' +
        '        }' +
        '        .textAlignR input{\n' +
        '        width:100px !important;' +
        '        }' +
        '        #theprint textarea{\n' +
        '    float: left;\n' +
        '    line-height: 15px;' +
        '       }\n' +
        '        .width80,.textAlignR input.width80{\n' +
        '            width: 80px !important;\n' +
        '        }\n' +
        '        .price input,.quantity input{\n' +
        '            text-align: center !important;\n' +
        '        }\n' +
        '        #theprint input,#theprint textarea{\n' +
        '            border: none;\n' +
        '            width: 100%;\n' +
        '            font-family: IRANSans;\n' +
        '            display: inline-block;\n' +
        '        }\n' +
        '        .d-inline-block{\n' +
        '            display: inline-block !important;\n' +
        '            width: auto !important;' +
        '        }\n' +
        '        #theprint .item-name input{\n' +
        '            width: calc(100vw - 930px) !important;\n' +
        '            min-width: 500px;\n' +
        '        }\n' +
        '        .total_taxionf{\n' +
        '            width: 160px !important;\n' +
        '        }\n' +
        '\n' +
        '        #theprint .address{\n' +
        '            width: calc(100% - 50px) !important;\n' +
        '        }\n' +
        '        .minWidth250px{\n' +
        '            min-width: 200px !important;\n' +
        '            display: block;\n' +
        '        }\n' +
        '\n' +
        '        .kjhgf img {\n' +
        '            width: 65px !important;\n' +
        '        }\n' +
        '        .item-name input {\n' +
        '            width: 100% !important;\n' +
        '        }\n' +
        '        .width300 {\n' +
        '            width: 300px;\n' +
        '\n' +
        '        }\n' +
        '        .width100 , input.width100,#theprint input.width100{\n' +
        '            width: 100px !important;\n' +
        '\n' +
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
    // })
  };
  // setTimeout(()=>{
  //   handleClick();

  // },100)
  let {
    factore_shop_name,
    factore_shop_phoneNumber,
    factore_shop_site_address,
    factore_shop_address,
    factore_shop_site_name,
    factore_shop_internationalCode,
    factore_shop_submitCode,
  } = shopData;
  return (
    <div id={'theprint'} ref={divRef}>
      <button onClick={handleClick} className={'no-print'}>
        print
      </button>
      <table className="head container">
        <tbody>
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
                <h3> فاکتور فروش</h3>
              </div>
              <h1 className="document-type-label">{factore_shop_name}</h1>
            </td>

            <td className="shop-info">
              <div>
                <span>شماره فاکتور:</span>
                <span>{props.record.orderNumber}</span>
              </div>
              {/*<div className="order-number">*/}
              {/*<span>شماره سفارش:</span>*/}
              {/*<span>{props.record.orderNumber}</span>*/}
              {/*</div>*/}
              <div className="invoice-date">
                <span>تاریخ:</span>
                <span>{dateFormat(props.record.createdAt)}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="order-data-addresses ">
        <tbody>
          <tr>
            <td>فروشنده</td>
            <td>
              <div>
                <span>
                  <span>نام شخص حقیقی / حقوقی: </span>
                  {factore_shop_name}
                </span>{' '}
                <span style={{ padding: '0 5px' }}> </span>
                {factore_shop_site_address && (
                  <>
                    <span>سایت: </span>
                    {factore_shop_site_address}
                    <span style={{ padding: '0 5px' }}> </span>
                  </>
                )}
                {factore_shop_internationalCode && (
                  <>
                    <span>شماره اقتصادی: </span>
                    {factore_shop_internationalCode}{' '}
                    <span style={{ padding: '0 5px' }}> </span>
                  </>
                )}
                {factore_shop_submitCode && (
                  <>
                    <span>شماره ثبت: </span>
                    {factore_shop_submitCode}
                  </>
                )}
              </div>
              <div>
                <span>آدرس: </span>
                {factore_shop_address}
                <span style={{ padding: '0 5px' }}> </span>
                <span>تلفن: </span>
                <input
                  className={'d-inline-block width100'}
                  value={tel}
                  onChange={(e) => changeInput('tel', e)}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>خریدار</td>
            <td>
              <div>
                <div>
                  <span>نام شخص حقیقی / حقوقی: </span>
                  <input
                    style={{ width: '300px' }}
                    value={cfirstName}
                    onChange={(e) => changeInput('cfirstName', e)}
                  />

                  {codeMelli && [
                    <span>کد ملی: </span>,
                    <input
                      style={{ width: '200px' }}
                      value={codeMelli}
                      onChange={(e) => changeInput('codeMelli', e)}
                    />,
                  ]}
                </div>

                <div>
                  <span>
                    <span>شماره تماس: </span>
                    <span className="billing-phone">
                      {props.record.customer &&
                        props.record.customer.phoneNumber}
                      {!props.record.customer.phoneNumber &&
                        props.record.customer_data.phoneNumber &&
                        props.record.customer_data.phoneNumber}

                      {props.record.billingAddress &&
                        props.record.billingAddress.PhoneNumber && (
                          <span>
                            <span> - </span>
                            {props.record.billingAddress.PhoneNumber}
                          </span>
                        )}
                    </span>
                  </span>
                  {codeposti && (
                    <span style={{ marginRight: '50px' }}>
                      <span>کد پستی: </span>
                      <span>
                        <input
                          style={{ width: '200px' }}
                          value={codeposti}
                          onChange={(e) => changeInput('codeposti', e)}
                        />
                      </span>
                    </span>
                  )}
                </div>
              </div>
              <div>
                <span>نشانی: </span>
                <span>
                  <textarea
                    className={'address'}
                    onChange={(e) => changeInput('caddress', e)}
                    value={caddress}
                  />
                </span>

                {/*{props.record.billingAddress && props.record.billingAddress.StreetAddress}*/}

                {/*<?php echo $order_data['billing']['city'] . '، ' . $order_data['billing']['address_1']; ?>*/}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/*<?php do_action('wpo_wcpdf_before_order_details', $this->get_type(), $this->order); ?>*/}

      <table className="order-details ">
        <thead>
          <tr>
            <th className="product">ردیف</th>
            <th className="sku">کد کالا</th>
            <th className="product">شرح کالا یا خدمات</th>
            <th className="quantity">تعداد</th>
            <th className="price">مبلغ واحد</th>
            <th className="discount">مبلغ تخفیف</th>
            <th className="quantityinprice">مبلغ کل</th>
            {Boolean(themeData && themeData.taxAmount) && (
              <th className="tax">جمع مالیات و عوارض</th>
            )}
            {Boolean(themeData && themeData.taxAmount) && (
              <th className="total_taxionf">
                جمع کل بعلاوه جمع مالیات <br />و عوارض با احتساب تخفیف
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {props.record.package.map((p, tyhj) => {
            if (cpackage[tyhj])
              return (
                <tr className="" key={tyhj}>
                  <td className="therow">{tyhj + 1}</td>
                  <td className="sku">
                    {cpackage[tyhj].sku && <span>{cpackage[tyhj].sku}</span>}
                  </td>
                  <td className="product">
                    <span className="item-name no-print">
                      <textarea
                        className={''}
                        style={{
                          height: 'auto',
                          minHeight: '25px',
                          float: 'right',
                        }}
                        value={cpackage[tyhj].product_name}
                        onChange={(e) => changePackage('product_name', e, tyhj)}
                      />
                    </span>
                    <span className="item-name d-none minWidth250px">
                      {cpackage[tyhj].product_name}
                    </span>
                  </td>
                  <td className="quantity">
                    <input
                      className={'no-print'}
                      value={cpackage[tyhj].quantity}
                      onChange={(e) => changePackage('quantity', e, tyhj)}
                    />
                    <span className={'d-none'}>{cpackage[tyhj].quantity}</span>
                  </td>
                  <td className="price">
                    <input
                      className={'no-print'}
                      value={cpackage[tyhj].price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      onChange={(e) => changePackage('price', e, tyhj)}
                    />
                    <span className={'d-none'}>
                      {cpackage[tyhj].price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </span>
                  </td>
                  <td className=" discount">
                    {returnDiscountOfPRice(cpackage[tyhj])}
                  </td>
                  <td className="quantity total_price">
                    {returnAfterDiscountOfPRice(cpackage[tyhj])}

                    {/*<input*/}
                    {/*className={"no-print"}*/}
                    {/*value={cpackage[tyhj].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}*/}
                    {/*onChange={(e) => changePackage("price", e, tyhj)}/>*/}
                    {/*<span className={"d-none"}>{cpackage[tyhj].price}</span>*/}
                  </td>
                  {Boolean(themeData && themeData.taxAmount) && (
                    <td className="quantity Tax">
                      <span>{taxAccount(cpackage[tyhj])}</span>
                    </td>
                  )}
                  {Boolean(themeData && themeData.taxAmount) && (
                    <td className="quantity with_tax">
                      <span>{returnTaxAccountToTotal(cpackage[tyhj])}</span>
                    </td>
                  )}
                </tr>
              );
            else return <></>;
          })}
        </tbody>
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
            </div>
          </td>
          <td className={'textAlignR'}>
            <div>
              <span>جمع کل: </span>
              <span>
                <input
                  className={'width80'}
                  value={csum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  onChange={(e) => changeInput('csum', e)}
                />
              </span>
              <span></span>
            </div>
            <div>
              <span>تخفیف: </span>
              <span>
                <input
                  className={'width80'}
                  value={discountAmount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  onChange={(e) => changeInput('discountAmount', e)}
                />
              </span>
            </div>

            {Boolean(ersal) && (
              <div>
                <span>هزینه ارسال: </span>
                <span>
                  <input
                    className={'width80'}
                    value={ersal
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    onChange={(e) => changeInput('ersal', e)}
                  />
                </span>
                <span></span>
                {/*<?php echo number_format($order_data['shipping_total']) . ' تومان'; ?>*/}
              </div>
            )}
            {themeData && themeData.tax && (
              <div>
                <span>{themeData.taxAmount}% مالیات بر ارزش افزوده:</span>
                <span>
                  <input
                    className={'width80'}
                    value={totalTaxAmount
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    onChange={(e) => changeInput('totalTaxAmount', e)}
                  />
                </span>
                <span></span>
                {/*<?php echo number_format($order_data['shipping_total']) . ' تومان'; ?>*/}
              </div>
            )}
            <div>
              <span>قابل پرداخت: </span>
              <span>
                <input
                  className={'width80'}
                  value={amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  onChange={(e) => changeInput('amount', e)}
                />
              </span>
              <span></span>
              {/*<?php echo number_format($order_data['total']) . ' تومان'; ?>*/}
            </div>
          </td>
          <td className={'textAlignR width300'}>
            {discountCode && (
              <div>
                <span>کد تخفیف:</span>
                <span>{discountCode}</span>
              </div>
            )}
          </td>
        </tr>
      </table>

      <div className="bottom-spacer "></div>
      {/*{handleClick()}*/}
    </div>
  );
};
