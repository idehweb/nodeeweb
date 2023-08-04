import React from 'react';
import { toggleSearch } from '#c/functions/index';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
export default function NavbarToggle(props) {
  const searchform = useSelector((st) => !!st.store.searchvisible);

  const handleClick = () => toggleSearch(searchform);

  return (
    <div className={"nav toggle-sidebar xtazin2 nonestf "+searchform}>
      <div
        onClick={handleClick}
        className={"nav-link nav-link-icon toggle-sidebar d-sm-inline d-md-inline  text-center "}>
        <SearchIcon/>
      </div>
    </div>
  );
}
