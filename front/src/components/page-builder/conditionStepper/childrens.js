// @flow
import React from 'react';
import {ShowElement} from '#c/components/page-builder/PageBuilder';
const ConditionStepChildren = (props) => {
  const {nestedElements,returnStep} = props;
  return (
    <div>
      {nestedElements && nestedElements.map((element, index) => {
        return <ShowElement key={index} element={element} condition={true} handleStep={returnStep} />
      })}
    </div>
  );
};
export  default ConditionStepChildren;
