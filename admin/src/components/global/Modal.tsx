import {
  Modal as MuiModal,
  ModalProps,
  Card,
  Slide,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { CloseRounded } from '@mui/icons-material';

import clsx from 'clsx';

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
    backgroundColor: '#fff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#052971',
    marginBottom: '30px',
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

interface Props extends ModalProps {
  onClose: () => void;
  title: string;
}

export default function Modal({
  open = false,
  onClose,
  title,
  className,
  children,
  ...rest
}: Props) {
  const cls = useStyles();
  return (
    <MuiModal
      open={open}
      className={cls.modal}
      closeAfterTransition
      disableEnforceFocus
      disableAutoFocus
      onClose={onClose}
      {...rest}>
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Card className={clsx(cls.card, className)}>
          <div className={cls.header}>
            <Tooltip title={'cancel'}>
              <CloseRounded onClick={onClose} />
            </Tooltip>
            <span>{title}</span>
          </div>
          <div>{children}</div>
        </Card>
      </Slide>
    </MuiModal>
  );
}
