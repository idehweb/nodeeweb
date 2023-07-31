import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';
import {setStyles} from "#c/functions";
import ConditionStepChildren from "./childrens";
import {ShowElement} from '#c/components/page-builder/PageBuilder';
 const ConditionStep = (props) => {
  const {steps,dynamicStyle} = props;
  let [stepSlug,setStepSlug] = React.useState('');
React.useEffect(()=>{
  setStepSlug(steps[0].settings.general.fields.slug)
},[])
  return (
    steps && steps.map((step,i)=>
        step.settings.general.fields.slug === stepSlug && (
          <Paper key={i}  style={dynamicStyle}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                      {step && step.children.map((element, index) => {
                        return <ShowElement key={index} element={element} condition={true} handleStep={(slug)=>setStepSlug(slug)} />
                      })}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        )
      )
  );
};
export default ConditionStep;
