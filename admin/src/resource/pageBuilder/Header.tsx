import { memo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button, ButtonBase } from '@mui/material';
import { styled } from '@mui/material';
import clsx from 'clsx';
import { Tabs, Component, NewTabs, NewButton } from './Styles';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';

const Header = ({ tabValue, setTabValue, onAdd, onSave }) => {
  return (
    <Component style={{ position: 'sticky', width: '100%', top: 0 }}>
      <div>
        {/* <Button onClick={onAdd} variant="contained" endIcon={<AddIcon />}>
          Add Element
        </Button> */}
        <Fab onClick={onAdd} style={{ background: '#00aced', color: '#fff' }}>
          <AddIcon />
        </Fab>
      </div>
      <NewTabs>
        <NewButton onClick={(e) => setTabValue(0)}>Builder</NewButton>
        <NewButton onClick={(e) => setTabValue(1)}>Preview</NewButton>
      </NewTabs>
      {/* <Tabs>
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
      </Tabs> */}
      <div>
        {/* <Button variant="contained" onClick={onSave}>
          Save
        </Button> */}
        <Fab onClick={onSave} style={{ background: '#00aced', color: '#fff' }}>
          <SaveIcon />
        </Fab>
      </div>
    </Component>
  );
};

export default memo(Header);
