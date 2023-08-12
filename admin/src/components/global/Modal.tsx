import {
  Modal as MuiModal,
  ModalProps,
  Typography,
  Zoom,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { CloseRounded } from '@mui/icons-material';
import clsx from 'clsx';

const useStyles = makeStyles<any>(({ palette, spacing }) => ({
  modal: {
    display: 'flex',
    overflowY: 'auto',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacing(1.5),
    margin: 'auto',
    borderRadius: spacing(2),
    backgroundColor: '#fff',
  },
  header: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'end',
    zIndex: 1,
    '& h6': {
      color: palette.grey[800],
      margin: 0,
      marginBottom: 10,
      width: '100%',
      fontWeight: 'bold',
    },
    '& svg': {
      position: 'absolute',
      cursor: 'pointer',
      color: palette.error.main,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'scale(1.3)',
      },
    },
  },
}));

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
      onClose={(e, r) => {
        if (r !== 'backdropClick') onClose();
      }}
      {...rest}>
      <Zoom in={open} mountOnEnter unmountOnExit>
        <div className={clsx(cls.card, className)}>
          <div className={cls.header}>
            {title ? <Typography variant="h6">{title}</Typography> : null}
            <CloseRounded onClick={() => onClose()} />
            <Tooltip title="Close">
              <CloseRounded onClick={onClose} />
            </Tooltip>
          </div>
          {children}
        </div>
      </Zoom>
    </MuiModal>
  );
}
