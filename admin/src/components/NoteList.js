import * as React from "react";
// import MuiGridList from '@mui/material/GridList';
import { ImageListItem } from "@mui/material";
// import GridListTile from '@mui/material/GridListTile';
// import GridListTileBar from '@mui/material/GridListTileBar';
import { makeStyles } from "@mui/styles";
// import withWidth, { WithWidth } from '@mui/material/withWidth';
import { useListContext, useTranslate } from "react-admin";
import { ShopURL } from "@/functions/API";
import { Link } from "react-router-dom";
import { NoteShow } from "@/components";

import AddIcon from "@mui/icons-material/Add";

const useStyles = makeStyles(theme => ({
  gridList: {
    margin: 0
  },
  tileBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)"
  },
  placeholder: {
    backgroundColor: "#d4b965",
    height: "100%",
    color: "#000"
  },
  price: {
    display: "inline",
    fontSize: "1em"
  },
  link: {
    color: "#fff"
  }
}));

const getColsForWidth = (width) => {
  if (width === "xs") return 2;
  if (width === "sm") return 3;
  if (width === "md") return 3;
  if (width === "lg") return 5;
  return 6;
};

const times = (nbChildren, fn) =>
  Array.from({ length: nbChildren }, (_, key) => fn(key));

const LoadingGridList = (props) => {
  const { width, nbItems = 20 } = props;
  const classes = useStyles();

  return times(nbItems, key => {
    if (key == 0) {
      return <Link to={"/note/create"} key={key} className={"media_ImageListItem notLoaded"}>
        <div className={classes.placeholder}>
          <AddIcon className={"posabADDICON"}/>
        </div>
      </Link>;
    }
    return (
      <></>);
  });
};

const LoadedGridList = (props) => {
  const { width } = props;
  const { data } = useListContext();
  const translate = useTranslate();
  const classes = useStyles();
  console.log("LoadedGridList", data);

  // if (!ids || !data) return null;

  return [<Link to={"/note/create"} key={'x'} className={"media_ImageListItem notLoaded"}>
    <div className={classes.placeholder}>
      <AddIcon className={"posabADDICON"}/>
    </div>
  </Link>,data.map((d, key) => {
    return (
      <NoteShow key={key} note={d}/>

    );
  })]
};


const GridList = (props) => {
  const { width } = props;
  const { data, isLoading } = useListContext();
  let loaded = Boolean(data && data.length);
  console.log("loaded", loaded, isLoading);
  return loaded ? (
    <LoadedGridList width={width}/>
  ) : (
    <LoadingGridList width={width}/>
  );
};

export default GridList;
