// @ts-check
import { update_prices, getExchangeRate, getTscForm } from "./actions";

let json = {};
export { json };

export default function GomrokGateway(props) {
  console.log("\n\nGomrokGateway\n\n");

  if (!props || !props.entity) return props;

  props.entity.forEach((item, i) => {
    if (item.name !== "settings") return;

    console.log("settings.........................................");
    if (item.routes) {
      // routes => /customer/setting
      item.routes.push(
        ...[
          {
            path: "/update-exchange-rate/",
            method: "post",
            access: "customer_all",
            controller: (req, res, next) => {
              update_prices(req, res, next, true);
            },
          },
          {
            path: "/get-exchange-rate/",
            method: "get",
            access: "customer_all",
            controller: getExchangeRate,
          },
          {
            path: "/get-tsc-form/",
            method: "post",
            access: "customer_all",
            controller: getTscForm,
          },
        ]
      );
    }
  });
  return props;
}
