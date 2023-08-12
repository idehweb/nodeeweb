import React, {useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import {dFormat, PriceFormat} from "#c/functions/utils";
import CustomModal from "#c/components/Modal";
import {ListGroup, ListGroupItem} from "shards-react";
import "#c/assets/styles/nodeeweb-page-builder.css";

import {
  addBookmark,
  clearPost,
  getBlogPost,
  GetBuilder,
  isClient,
  loadPost,
  loveIt,
  MainUrl,
  SaveBuilder,
  savePost,
} from "#c/functions/index";
import {SnapChatIcon} from "#c/assets/index";
import {useSelector} from "react-redux";


const OptionBox = ({onClose, open, addToComponents, t, exclude, defaultOptions}) => {
// console.clear();
//   let Options=defaultOptions;
  // console.log('exclude',exclude);
  const themeData = useSelector((st) => st.store.themeData);

  const [Options, SetOptions] = useState(defaultOptions);
//   const createOption=()=> {
//
//     defaultOptions.forEach((dO) => {
//       if (exclude.indexOf(dO.name) === -1) {
//         tempOption.push(dO);
//       }
//     });
//     SetOptions([...tempOption])
//   };
//   Options
  useEffect(() => {
    console.log('use Effect Option box')
    let tempOption = [];

    defaultOptions.forEach((dO) => {
      if (exclude.indexOf(dO.name) === -1) {
        tempOption.push(dO);
      }
    });
    SetOptions(tempOption);
  }, [exclude]);
  useEffect(() => {
    if (themeData.components) {
      let tempOption = Options;
      themeData.components.forEach((dO) => {

        tempOption.push(dO);

      });
      SetOptions(tempOption);

    }
    //

  }, [themeData]);
  console.log('exclude', exclude)
  return (

    <CustomModal onClose={onClose} open={open} className={'width50vw sdfghyjuikol kiuytgfhjuyt modal'}
                 title={t('Choose Element')}>
      <ListGroup flush>

        {Options && Options.map((option, key) => {

          return <ListGroupItem className="" key={key}>
            <div className={'block clickable p-3'} onClick={(e) => {
              // console.log('theCom choosed',onClose)
              // onClose();

              addToComponents(option, {optionBox: false});

            }}>
              {JSON.stringify(option.label)}
            </div>
          </ListGroupItem>
        })}

      </ListGroup>
    </CustomModal>
  );
};
export const PageServer = [
  {}
];
export default withTranslation()(OptionBox);
