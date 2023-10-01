import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import ModalOptions from '@/components/ModalOptions';

import FormOptions from './FormOptions';
import DefaultOptions from './DefaultOptions';

export default function OptionBox({ onClose, open, onAdd, exclude }) {
  const { model } = useParams();

  // @ts-ignore
  const themeData = useSelector((st) => st.themeData);

  const [Options, SetOptions] = useState([]);

  useEffect(() => {
    const tempOption = [];

    const items = model === 'form' ? FormOptions : DefaultOptions;

    items.forEach((dO) => {
      if (exclude.indexOf(dO.name) === -1) tempOption.push(dO);
    });

    SetOptions(tempOption);
  }, [exclude, model]);

  useEffect(() => {
    if (themeData && themeData.components) {
      let newItems = Options;
      newItems.concat(themeData.components);
      SetOptions(newItems);
    }
  }, [themeData]);

  return (
    <ModalOptions
      Options={Options}
      onAdd={onAdd}
      onClose={onClose}
      open={open}
    />
  );
}
export const PageServer = [{}];
