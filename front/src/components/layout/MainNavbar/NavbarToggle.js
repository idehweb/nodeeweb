import React from 'react';
import { toggleSidebar } from '#c/functions/index';
import { useSelector } from 'react-redux';
// import {logoImg} from '#c/assets/index';
// import {Link} from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
export default function NavbarToggle(props) {
  const menu = useSelector((st) => !!st.store.menuVisible);
  // const searchform = useSelector((st) => !!st.store.searchvisible);

  const handleClick = () => toggleSidebar(menu);

  return (
    [
      <div className={"nav toggle-sidebar xtazin2 nonestf "}>
      <div

        onClick={handleClick}
        className="nav-link nav-link-icon toggle-sidebar d-sm-inline d-md-inline  text-center">
        <MenuIcon/>
      </div>
    </div>

    ]
  );
}
