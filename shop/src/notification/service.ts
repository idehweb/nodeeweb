import { classCatchBuilder } from "@nodeeweb/core/utils/catchAsync";
import { serviceOnError } from "../common/service";
import { MiddleWare } from "@nodeeweb/core/types/global";
import store from "@nodeeweb/core/store";
import axios from "axios";

export default class Service {
  static create: MiddleWare = async (req, res) => {
    const Notification = store.db.model("notification");
    const Setting = store.db.model("setting");
    const Gateway = store.db.model("gateway");
    delete req.body._id;
    if (!req.body.message) {
      return res.status(400).json({
        success: false,
        message: "enter message!",
      });
    }
    const obj = {
      message: req.body.message,
    };
    if (req.body.limit) {
      obj["limit"] = req.body.limit;
    }
    if (req.body.customerGroup) {
      obj["customerGroup"] = req.body.customerGroup;
    }
    if (req.body.source) {
      obj["source"] = req.body.source;
    }
    if (req.body.offset) {
      obj["offset"] = req.body.offset;
    }
    if (req.body.phoneNumber) {
      obj["phoneNumber"] = req.body.phoneNumber;
    }
    const notification = await Notification.create(obj);
    const setting = await Setting.findOne({}, "defaultSmsGateway");

    if (!setting || !setting.defaultSmsGateway)
      //send with default gateway
      return res.status(400).json({ message: "send with default gateway" });

    const gateway = await Gateway.findById(setting.defaultSmsGateway);

    if (!gateway || !gateway.request) {
      //send with default gateway
      return res.status(404).json({
        success: false,
        gateway: gateway,
      });
    }

    if (req.body.phoneNumber && !req.body.source) {
      let m = gateway.request;
      if (req.body.message) m = m.replaceAll("%message%", req.body.message);
      if (req.body.phoneNumber)
        m = m.replaceAll("%phoneNumber%", req.body.phoneNumber);

      const theReq = JSON.parse(m);
      const data = await axios(theReq);
      return res.status(201).json(notification);
    }

    if (!req.body.phoneNumber && req.body.source) {
      const Customer = store.db.model("Customer");
      const customers = await Customer.find({ source: req.body.source })
        .skip(req.body.offset || 0)
        .limit(req.body.limit || 1000);

      const promises = customers.map(async function (customer, i) {
        let m = gateway.request;
        if (req.body.message) m = m.replaceAll("%message%", req.body.message);
        console.log("phoneNumber", customer.phoneNumber);
        if (customer.phoneNumber)
          m = m.replaceAll("%phoneNumber%", customer.phoneNumber);
        if (customer.firstName) {
          m = m.replaceAll("%firstName%", customer.firstName);
        }
        if (!customer.firstName) {
          m = m.replaceAll("%firstName%", "دوست");
        }

        const theReq = JSON.parse(m);
        const data = await axios(theReq);
      });
      await Promise.all(promises);
    }
  };
  static onError = serviceOnError("Notification");
}
classCatchBuilder(Service);
