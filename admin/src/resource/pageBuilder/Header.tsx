import { memo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button, ButtonBase } from '@mui/material';
import { styled } from '@mui/material';
import clsx from 'clsx';

const Tabs = styled('nav')({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  background: '#29b6f6',
  borderRadius: '4px',
  overflow: 'hidden',
  '& button': {
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '12px',
    minWidth: 150,
    transition: 'all 0.2s ease-in-out',
    '&.active': {
      backgroundColor: '#ab47bc',
    },
  },
});

const Component = styled('header')({
  height: 60,
  background: '#fff',
  color: '#000000',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px',
  position: 'relative',
  borderBottom: '1px solid #ddd',
});

const Header = ({ tabValue, setTabValue, onAdd, onSave }) => {
  return (
    <Component style={{ position: 'sticky', width: '100%', top: 0 }}>
      <div>
        <Button onClick={onAdd} variant="contained" endIcon={<AddIcon />}>
          Add Element
        </Button>
      </div>
      <Tabs>
        <ButtonBase
          className={clsx(tabValue === 0 && 'active')}
          onClick={(e) => setTabValue(0)}>
          Builder
        </ButtonBase>
        <ButtonBase
          className={clsx(tabValue === 1 && 'active')}
          onClick={(e) => setTabValue(1)}>
          Preview
        </ButtonBase>
      </Tabs>
      <div>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </div>
    </Component>
  );
};

export default memo(Header);
