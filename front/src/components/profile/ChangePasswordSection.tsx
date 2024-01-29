import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
} from '@mui/material';

import { useState } from 'react';
import { toast } from 'react-toastify';

import API from '@/functions/API';
import { afterAuth } from '../components-overview/AuthProtocol/utils';

export default function ChangePasswordSection() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePasswordUpdate = async () => {
    if (password.trim().length < 8) {
      toast.error('پسورد باید حداقل 8 کارتر باشد.');
      return;
    }
    if (password !== confirmPassword) {
      toast.info('عدم تطابق رمز عبور');
      return;
    }
    try {
      setLoading(true);
      const changePasswordResponse = await API.patch(
        '/customer/updatePassword',
        { password }
      );

      afterAuth({
        user: changePasswordResponse.data.data.user,
        token: changePasswordResponse.data.data.token,
      });
      console.log('success traceback response #cps1 ', changePasswordResponse);
      toast.success('رمز عبور با موفقیت تغییر یافت');
    } catch (err) {
      console.log('error traceback code #cps2 ', err);
      toast.error('خطا');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        disabled={loading}
        variant="contained"
        onClick={handleOpen}
        sx={{ fontFamily: 'inherit', paddingY: '0.5rem' }}>
        تعویض رمز عبور
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>تعویض رمز عبور</DialogTitle>
        <DialogContent>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <Input
              sx={{ fontFamily: 'inherit' }}
              type="password"
              placeholder="رمز عبور جدید"
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              sx={{ fontFamily: 'inherit' }}
              type="password"
              disabled={loading}
              placeholder="تایید رمز عبور"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            sx={{ fontFamily: 'inherit', paddingY: '0.5rem' }}
            onClick={handleClose}>
            انصراف
          </Button>
          <Button
            disabled={loading}
            sx={{ fontFamily: 'inherit', paddingY: '0.5rem' }}
            variant="contained"
            onClick={handlePasswordUpdate}>
            ثبت تغییرات
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
