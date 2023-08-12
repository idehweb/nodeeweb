import React from "react";
import { Nav } from "shards-react";
import { logoImg } from "#c/assets/index";
import { Link } from "react-router-dom";
// import Logo from '#c/images/logo-256x512.png';
import NavbarMobileButton from "./../NavbarMobileButton";
// import useWindowSize from '#c/components/common/useWindowSize';
import SearchIcon from "@mui/icons-material/Search";

export default () => {
  // const searchform = useSelector((st) => !!st.store.searchvisible);
  // let [width, height] = useWindowSize();

  let searchform = "";
  console.log("index logo", logoImg);
  return (<Nav navbar className={"flex-row stfwrap" + searchform}>
      <div className={"search-button"}>
        <SearchIcon className={"black"}/>
      </div>
      <div className={"d-table m-auto oiuytrt tm-ksa-logo-parent2 nonestf" + searchform}>
        <Link to="/">{logoImg && <img style={{ maxWidth: 58 }} src={logoImg} alt="mobile logo"/>}</Link>
      </div>
      {/*<MainCats/>*/}

      <NavbarMobileButton/>
    </Nav>
  );
}
