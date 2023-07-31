import React,{Fragment,useState} from 'react';
import Home from '@mui/icons-material/Home';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import ConditionStep from "./detail";
import {setStyles} from "#c/functions";
import _ from 'lodash'
import {ShowElement} from '#c/components/page-builder/PageBuilder';
const ConditionSteps = (props) => {
  const {element} = props;
  const {children} = element;
  const {settings} = element;
  const {general} = settings;
  const {fields} = general;
  const dynamicStyle = setStyles(fields);
  let [cElementss,setCelementss] = useState({});
  let cElementsHome = children[0];
  const changeActiveStep = (slug) =>{
    if(slug !== 0){
      children.forEach((ch)=>{
        if(ch.settings.general.fields.slug === slug){
          setCelementss(ch)
        }
      })
    }else{
      setCelementss({});
    }
  }
  return (
    <Fragment>
      {/* <ConditionStep
          dynamicStyle={dynamicStyle}
          steps={children}
          content={cElementss.length > 0 ? cElementss : cElementsHome}
          handlerSetStep={changeActiveStep}
           /> */}
        <Paper style={dynamicStyle}>
            {Object.keys(cElementss).length != 0 && <HomeStep atHome={changeActiveStep} />}
              <Grid container spacing={1}>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                          {
                            Object.keys(cElementss).length != 0  ?(
                              cElementss.children.map((element, index) => {
                                // return index
                                return <ShowElement key={index} element={element} condition={true} handleStep={changeActiveStep} />
                              })
                            ):(
                              cElementsHome.children.map((element, index) => {
                                // return index
                                return <ShowElement key={index} element={element} condition={true} handleStep={changeActiveStep} />
                              })
                            )
                          }
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
        </Paper>
    </Fragment>

  );
}
export const HomeStep = (props) =>{
  return(
    <Grid item xs container direction="row" spacing={2}  >
      <Grid item xs={12} display="flex" justifyContent="flex-end">
        <button onClick={()=>{props.atHome(0)}} style={{marginTop:'10px',marginBottom:10,background:'transparent',border:'none'}}>
          <Home/>
        </button>
      </Grid>
  </Grid>
  )

}
export default ConditionSteps
// export default React.memo(ConditionSteps);

