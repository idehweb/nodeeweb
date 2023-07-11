import { useTranslate } from "react-admin";
import { ShowObject } from "@/components";

export default (props) => {
  console.log("props", props);
  const translate = useTranslate();

  if (!props.object1)
    return;

  let valuesArray = Object.keys(props.object1);

  return (
    <table className={"thisIsdiffer"}>
      <thead>
      <tr>
        <th>{translate("components.JsonDiffer.fieldName")}</th>

        <th>{translate("components.JsonDiffer.new")}</th>
        <th>{translate("components.JsonDiffer.old")}</th>
      </tr>
      </thead>
      <tbody>
      {valuesArray.map((item,key) => {
        // console.log('item',item);

        let trClass = "";
        if (typeof props.object1[item] === "object" && (props.object2 && typeof props.object2[item] === "object")) {
          if (JSON.stringify(props.object1[item]) !== JSON.stringify(props.object2[item])) {
            trClass = "makeRed";
          }
        }

        return <tr className={trClass} key={key}>
          <td>{item}</td>
          {/*<td className={'rtl-right'}>{typeof props.object1[item]} - {typeof props.object2[item]}</td>*/}
          <td>
            {props.object1 && <div>
              {props.object1[item] && typeof props.object1[item] === "object" &&
              <ShowObject object1={props.object1[item]}/>}
              {props.object1[item] && typeof props.object1[item] !== "object" && props.object1[item].toString()}
            </div>}
          </td>
          <td>
            {props.object2 && <div>

              {props.object2[item] && typeof props.object2[item] === "object" &&
              <ShowObject object1={props.object2[item]}/>}
              {props.object2[item] && typeof props.object2[item] !== "object" && props.object2[item].toString()}
            </div>
            }
          </td>
        </tr>;
      })
      }
      </tbody>
    </table>
  );

}
