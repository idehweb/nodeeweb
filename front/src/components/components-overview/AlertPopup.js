import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {toast} from "react-toastify";
import {addItem, MainUrl, removeItem} from '#c/functions/index';
const AlertPopup =({show,onHandler,children,title,canBuy,item})=> {
  const [open, setOpen] = React.useState(show);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    onHandler(false);
    setOpen(false);
  };
  const handleCloseAfterSelected = () =>{
    if(canBuy){
      if(item){
        addItem(item).then((x) => {
          toast(t('Added to cart successfully!'), {
            type: 'success'
          })
        });
      }
      onHandler(false);
      setOpen(false);
      
    }else{
      toast('انتخاب گارانتی الزامی است', {
        type: 'danger'
      })
    }
  }
//   document.onclick= function(event) {
//     // Compensate for IE<9's non-standard event model
//     //
//     if (event===undefined) event= window.event;
//     var target= 'target' in event? event.target : event.srcElement;

//     alert('clicked on '+target.tagName);
// };
  return (
    <div>
      <Dialog style={{direction:'rtl'}}
        // onClick={handleClose}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={'xs'}
      >
        <DialogTitle id="alert-dialog-title">
          <div style={{
            fontSize: '1rem',
            fontWeight: '700',
            color:'#070935',
            width:'100%',
            borderBottom:'1px solid #e3e3ea',
            padding:'10px 5px'
          }}>
            <span
             style={{
              fontSize: '1rem',
              fontWeight: '700',
              color:'#070935',
              display:'block',
              width:'100%',
              padding:'0px 5px'
            }}
            >
              گارانتی محصول
            </span>
          <span
          style={{
            fontSize: '12px',
            fontWeight: '400',
            color:'#777891',
            display:'block',
            width:'100%',
            padding:'5px 5px'
          }}
          >
          با تشکر از انتخاب شما برای ادامه یک گارانتی انتخاب کنید
          </span>
          </div>
        </DialogTitle>
        <DialogContent>
                {children}
        </DialogContent>
        <DialogActions>
          <div className='d-flex w-100 p-3 gap-3'>
          <button className='w-50  btn btn-warning rounded ' style={{fontSize:'15px'}}  onClick={handleCloseAfterSelected} autoFocus>
          افزودن کالا  به سبد 
          </button>
          <button className='w-50  btn btn-danger rounded' style={{fontSize:'15px'}} onClick={handleClose} autoFocus>
          فعلا تمایل ندارم 
          </button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default React.memo(AlertPopup);