import { styled } from '@mui/material';

export const BaseButton = styled('button')({
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  padding: '4px 8px',
  '& > svg': {
    height: 16,
    width: 16,
    fill: '#464D55',
  },
});

export const EditButton = styled(BaseButton)({
  '& > svg': {
    fill: 'none',
    stroke: '#464D55',
  },
});
EditButton.defaultProps = {
  title: 'Edit',
};

export const MoveButton = styled(BaseButton)({
  cursor: 'grab !important',
});
MoveButton.defaultProps = {
  title: 'Move',
};

export const AddButton = styled(BaseButton)({});
AddButton.defaultProps = {
  title: 'Add',
};

export const DeleteButton = styled(BaseButton)({});
DeleteButton.defaultProps = {
  title: 'Delete',
};

export const Actions = styled('div')({
  display: 'flex',
  marginInlineStart: 16,
  opacity: 0,
  transition: '0.2s ease-in-out',
});
Actions.defaultProps = {
  className: 'pb-actions',
};

export const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fafafa',
  width: '100%',
  height: 30,
  color: '#464d55',
  fontSize: 11,
});
export const Content = styled('div')({
  minHeight: 40,
});

export const Container = styled('div')({
  border: '1px solid #ddd',
  marginBottom: 16,
  borderRadius: 4,
  '&:hover > div > .pb-actions': {
    opacity: 1,
  },
});
export const Footer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fafafa',
  width: '100%',
  height: 30,
  color: '#464d55',
  fontSize: 11,
});

export const Title = styled('h3')({
  cursor: 'pointer',
  color: '#fff',
  height: '40px',
  lineHeight: '40px',
  padding: '0px 10px',
  margin: 0,
});

export const ModalContainer = styled('div')({
  maxWidth: 500,
  background: '#fafafa',
  margin: '16px auto',
  overflow: 'auto',
});

export const Child = styled('div')({
  width: '100%',
  padding: '8px 16px',
});
