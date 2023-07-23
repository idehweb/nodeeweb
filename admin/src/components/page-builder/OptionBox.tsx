import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import ModalOptions from '@/components/ModalOptions';

import FormOptions from './FormOptions';
import DefaultOptions from './DefaultOptions';

export default function OptionBox({ onClose, open, addToComponents, exclude }) {
  const { model } = useParams();

  // @ts-ignore
  const themeData = useSelector((st) => st.themeData);

  const [Options, SetOptions] = useState([]);

  useEffect(() => {
    let tempOption = [];

    let items = model === 'form' ? FormOptions : DefaultOptions;

    items.forEach((dO) => {
      if (exclude.indexOf(dO.name) === -1) tempOption.push(dO);
    });

    SetOptions(tempOption);
  }, [exclude, model]);

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
    />
  );
}
export const PageServer = [{}];
