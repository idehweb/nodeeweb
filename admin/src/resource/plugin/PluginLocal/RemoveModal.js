import { useNotify } from 'react-admin';
import API from '@/functions/API';
import { Button, Box } from '@mui/material';
import Modal from '../Modal';

export default function RemoveModal({
  open,
  onClose,
  data,
  loading,
  reFetch,
}) {
  const notify = useNotify();

  const unistallHandler = () => {
    API.delete('plugin/local/' + data.slug)
      .then((res) => {
        notify('Unistall Plugin Successfuly');
        onClose();
        reFetch();
      })
      .catch((err) => notify(err.message, { type: 'error' }));
  };
  return (
    <Modal
      title={'Are you sure unistall ' + data.name}
      loading={loading}
      open={open}
      onClose={onClose}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={1}>
        <Button
          onClick={unistallHandler}
          style={{ margin: '0 1rem' }}
          variant="contained">
          Yes
        </Button>
        <Button variant="outlined" onClick={onClose}>
          No
        </Button>
      </Box>
    </Modal>
  );
}
