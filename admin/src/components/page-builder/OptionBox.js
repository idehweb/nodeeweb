import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import  FormOptions  from "./FormOptions";
import CustomModal from "@/components/Modal";
import { useDispatch, useSelector } from "react-redux";
import ModalOptions from "#c/components/ModalOptions";
const ListGroup = ({ children }) => {
  return <div>{children}</div>;
};
const ListGroupItem = ({ children }) => {
  return <div>{children}</div>;
};
const OptionBox = (props) => {
  let { onClose, open, addToComponents, t, exclude, defaultOptions } = props;
  let para = useParams();
  let { model } = para;
  const themeData = useSelector((st) => st.themeData);

  const [Options, SetOptions] = useState('');


  useEffect(() => {
    let tempOption = [];

    if(model==='form'){
      FormOptions.forEach((dO) => {
        if (exclude.indexOf(dO.name) === -1) {
          tempOption.push(dO);
        }
      });
      SetOptions(tempOption);
    }else{
      defaultOptions.forEach((dO) => {
        if (exclude.indexOf(dO.name) === -1) {
          tempOption.push(dO);
        }
      });
      SetOptions(tempOption);
    }

  }, [exclude]);
  useEffect(() => {
    if (themeData && themeData.components) {
      let tempOption = Options;
      themeData.components.forEach((dO) => {

        tempOption.push(dO);

      });
      SetOptions(tempOption);

    }
    //

  }, [themeData]);

  return (
    <ModalOptions
      Options={Options}
      addToComponents={addToComponents}
      onClose={onClose}
      open={open}
      className={"width50vw modal"}
      title={("Choose Element")}/>
    // <CustomModal onClose={onClose} open={open} className={"width50vw sdfghyjuikol kiuytgfhjuyt modal"}
    //              title={("Choose Element")}>
    //   <ListGroup flush>
    //
    //     {Options && Options.map((option, key) => {
    //
    //
    //       return <ListGroupItem className="" key={key}>
    //         <div className={"block clickable p-3"} onClick={(e) => {
    //           addToComponents(option, { optionBox: false });
    //         }}>
    //           {JSON.stringify(option.label)}
    //         </div>
    //       </ListGroupItem>;
    //     })}
    //
    //   </ListGroup>
    // </CustomModal>
  );
};
export const PageServer = [
  {}
];
export default (OptionBox);
