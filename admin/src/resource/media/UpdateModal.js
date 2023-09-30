import { useState } from 'react';
import {
  required,
  SaveButton,
  TextInput,
  Form,
  FileInput,
  FileField,
  ImageField,
} from 'react-admin';
import { Modal, Card, Slide, Typography } from '@mui/material';

import { makeStyles } from '@mui/styles';
import { CloseRounded } from '@mui/icons-material';
import { SERVER_URL } from '@/functions/API';
import Tooltip from '@/components/Tooltip';

const useStyles = makeStyles({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    minWidth: '40%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 40px !important',
    borderRadius: 20,
    boxShadow: '0 10px 25px 0 rgba(0, 0, 0, 0.05)',
    animation: 'zoomIn 1s',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '30px',
    fontSize: 22,
    fontWeight: 'bold',
    zIndex: 100000,
    '& svg': {
      //   position: 'absolute',
      cursor: 'pointer',
      top: 30,
      right: 40,
      color: '#f44336',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'scale(1.5)',
      },
    },
  },
});

function UpdateModal({ open = false, onClose, data, submit }) {
  const cls = useStyles();
  const parseDefaultValue = () => ({
    title: data.title,
    attachments: {
      title: data.title,
      src: SERVER_URL + data.url,
    },
  });
  return (
    <Modal
      open={open}
      className={cls.modal}
      closeAfterTransition
      disablePortal
      disableEnforceFocus
      disableAutoFocus
      disablebackdropclick="true"
      onClose={onClose}>
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Card className={cls.card}>
          <div className={cls.header}>
            <Typography variant="h6" component="p">
              Update file
            </Typography>
            <Tooltip title={'cancel'}>
              <CloseRounded onClick={onClose} />
            </Tooltip>
          </div>
          <div>
            <Form onSubmit={submit} defaultValues={parseDefaultValue}>
              <div>
                <TextInput
                  source="title"
                  autoComplete="off"
                  label="title"
                  validate={required()}
                  fullWidth
                />
              </div>
              <div>
                <FileInput source="attachments">
                  <FileField source="src" title="title" />
                </FileInput>
              </div>
              <div>
                <SaveButton label="Update" />
              </div>
            </Form>
          </div>
        </Card>
      </Slide>
    </Modal>
  );
}
export default UpdateModal;
