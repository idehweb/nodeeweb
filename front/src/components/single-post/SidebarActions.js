import React from "react";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { addBookmark, getContactData } from "#c/functions/index";
import Theprice from "#c/components/single-post/Theprice";
import TheChip from "#c/components/single-post/combinations-type/TheChip";
import TheList from "#c/components/single-post/combinations-type/TheList";

import { Col, Row } from "shards-react";
import store from "#c/functions/store";
import AddToCardButton from "#c/components/components-overview/AddToCardButton";
import { dFormat, PriceFormat,NormalizePrice } from "#c/functions/utils";
import {isSSR} from "#c/config";

class SidebarActions extends React.PureComponent {
  // requireWarranty
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            email: "",
            lan: store.getState().store.lan,
            optionsId: {},
            combinationsTemp: {}

        };
    }

    handleGetContactData = () => {
        const { _id } = this.props;
        getContactData(_id).then((d) => {
            this.setState(d.customer);
        });
    };

    bookmark = () => {
        const { t, _id } = this.props;
        addBookmark(_id).then((d) => {
            toast.success(t("successfully done!"));
        });
    };
    handleCombinations = (theid, val) => {
        const { t, options, combinations } = this.props;
        let { optionsId, combinationsTemp } = this.state;

        let combt = {};
        // console.log('val', val, optionsId);
        optionsId[theid] = (val.id);
        // console.log('optionsId', optionsId);
        if (options.length === Object.keys(optionsId).length) {
            let tt = [];
            Object.keys(optionsId).forEach(function(op, index) {
                tt.push(optionsId[op]);
            });
            // console.log('tt', tt);
            combinations.map(comb => {
                if (comb.optionsId.every(elem => tt.includes(elem))) {
                    // console.log('comb exist', comb);
                    combt = comb;
                }
            });
            // console.log('comb', combt);
            this.setState({ combinationsTemp: combt });

        }

        this.setState({ optionsId: optionsId });
    };

  returnPrice = (price) => {
    if (themeData.tax && themeData.taxAmount) {
      let ta = parseInt(themeData.taxAmount)
      price = parseInt(((ta / 100) + 1) * parseInt(price))
    }
    if (price)
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + t(themeData.currency)
  }

    render() {
        const { phoneNumber, email, lan, optionsId, combinationsTemp } = this.state;
        let { requireWarranty,t, updatedAt, countryChoosed, type, _id, firstCategory, in_stock, quantity, secondCategory, thirdCategory, title, photos, price, salePrice, options, combinations, method, single = true } = this.props;
        let mixcombandoptions = [];
// return price+'xxx'+salePrice
        if (price) price = NormalizePrice(price);
        if (salePrice) salePrice = NormalizePrice(salePrice);
        let ti = dFormat(updatedAt, t);
        return (
            [<div key={0}>
                {type == "variable" && combinations && <Col lg={12} md={12} sm={12} xs={12}>
                    <Row>
                        {Boolean(!isSSR && combinations.length>0) && <TheChip requireWarranty={requireWarranty} _id={_id} title={title} photos={photos} options={options} single={single} method={method} combinations={combinations} t={t} />}
                        {Boolean(isSSR && combinations.length>0) && <TheList _id={_id} title={title} photos={photos} options={options} single={single} method={method} combinations={combinations} t={t}/>}

                    </Row>
                </Col>}
                {type == "normal" &&
                <Col lg={12} md={12} sm={12} xs={12} className="mb-3 mt-3">
                  {!single && <Theprice price={price} className={"text-center"} salePrice={salePrice} combinations={combinations} type={type} t={t}/>}

                  <AddToCardButton item={{
                        _id: _id,
                        title: title,
                        photos: photos,
                        single: true,
                        in_stock: in_stock,
                        quantity: quantity,
                        price: price,
                        salePrice: salePrice
                    }}/>
                    </Col>
                }

            </div>]
        );
    }
}

export default withTranslation()(SidebarActions);
