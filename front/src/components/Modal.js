import React from 'react';
import { Modal, Card, Slide } from '@mui/material';
import { Row} from "shards-react";

import { makeStyles } from '@mui/styles';
import { CloseRounded } from '@mui/icons-material';
import Tooltip from '#c/components/Tooltip';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';

const useStyles = makeStyles({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
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
    justifyContent: 'center',
    color: '#052971',
    marginBottom:'30px',
    fontSize: 22,
    fontWeight: 'bold',
    zIndex: 100000,
    '& svg': {
      position: 'absolute',
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

function CustomModal({
  open = false,
  onClose,
  title,
  className,
  children,
  t
}) {
  const cls = useStyles();
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
        <Card className={clsx(cls.card, className)}>
          <div className={cls.header}>
            <Tooltip title={t('cancel')}>
              <CloseRounded onClick={onClose} />
            </Tooltip>
            <span>{title}</span>
          </div>
          <Row>
          {children}
          </Row>
        </Card>
      </Slide>
    </Modal>
  );
}
export default withTranslation()(CustomModal);
