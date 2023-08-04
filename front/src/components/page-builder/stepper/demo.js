import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import StepDetail from './detail';
import {getEntity, isClient, setStyles, submitForm} from "#c/functions/index";
// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const  DemoSteps = (props) => {
  const {field,onSubmit} = props;
  const {style, size, className, name, label, options, placeholder, value,children,showStepsTitle} = field;

  
  const [trackingCode, setTrackingCode] = React.useState(localStorage.getItem('trackingCode'));
  const [trackingCodeBlock, setTrackingCodeBlock] = React.useState(false);
  const [steps, setSteps] = React.useState(children);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const isStepOptional = (step) => {
    return step === 1;
  };
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const handleNext = () => {
    // let newSkipped = skipped;
    // if (isStepSkipped(activeStep)) {
    //   newSkipped = new Set(newSkipped.values());
    //   newSkipped.delete(activeStep);
    // }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // setSkipped(newSkipped);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  // const handleNextRadio = ()=>{
  //   // setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   console.log('zeeeeeeeeeeeeeeeeeeert')
  // }
  const handleNextRadio = React.useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, [])

  return (
    <Box
      sm={size ? size.sm : ''}
      lg={size ? size.lg : ''}
      className={'MGD stepper ' + (className !== undefined ? className : '')}
      style={style}
    >

    {
      showStepsTitle && (
          <Stepper activeStep={activeStep}>
                  {steps.map((step, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    // if (isStepOptional(index)) {
                    //   labelProps.optional = (
                    //     <Typography variant="caption">Optional</Typography>
                    //   );
                    // }
                    if (isStepSkipped(index)) {
                      stepProps.completed = false;
                    }
                    return (
                      <Step key={index} {...stepProps}>
                        <StepLabel {...labelProps}>
                          &nbsp;&nbsp;{step.settings.general.fields.title}
                          </StepLabel>
                      </Step>
                    );
                  })}
          </Stepper>
      )
    }



      {
      // activeStep === steps.length  ? (
        trackingCodeBlock  ? (
        // trackingCode ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            با تشکر از شما برای ارسال روی دکمه ثبت کلیک نمایید
            {trackingCode}
          </Typography>
          {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset} style={{fontSize:'15px'}}>پاکسازی</Button>
            
          </Box> */}
        </React.Fragment>
      ) : (
        <React.Fragment>




          <StepDetail content={children} activeStep={activeStep} nextStep={handleNextRadio} />







          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              قبلی
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
                         {
                activeStep === steps.length - 1 ?(
                  <Button type="submit"   style={{fontSize:'20px',backgroundColor:'rgb(5, 78, 133)',color:'white',fontFamily:'IRANSans !important'}}>ثبت</Button>
                ):(
                <button style={{background:'transparent','border':'none'}}   onClick={handleNext}>
                      بعدی
                </button>
                )
              }


          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
export default DemoSteps;
