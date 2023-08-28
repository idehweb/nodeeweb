import * as React from 'react';
// import MuiGridList from '@mui/material/GridList';
import { ImageListItem } from '@mui/material';
// import GridListTile from '@mui/material/GridListTile';
// import GridListTileBar from '@mui/material/GridListTileBar';
import { makeStyles } from '@mui/styles';
// import withWidth, { WithWidth } from '@mui/material/withWidth';
import { useListContext } from 'react-admin';

import { SERVER_URL, ShopURL } from '@/functions/API';

const useStyles = makeStyles((theme) => ({
  gridList: {
    margin: 0,
  },
  tileBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)',
  },
  placeholder: {
    backgroundColor: theme.palette.grey[300],
    height: '100%',
  },
  price: {
    display: 'inline',
    fontSize: '1em',
  },
  link: {
    color: '#fff',
  },
}));

const getColsForWidth = (width) => {
  if (width === 'xs') return 2;
  if (width === 'sm') return 3;
  if (width === 'md') return 3;
  if (width === 'lg') return 5;
  return 6;
};

const times = (nbChildren, fn) =>
  Array.from({ length: nbChildren }, (_, key) => fn(key));

const LoadingGridList = (props) => {
  const { width, nbItems } = props;
  const classes = useStyles();
  return times(nbItems, (key) => (
    <ImageListItem key={key} className={'media_ImageListItem notLoaded'}>
      <div className={classes.placeholder} />
    </ImageListItem>
  ));
};

const LoadedGridList = (props) => {
  const { width } = props;
  const { data } = useListContext();
  const classes = useStyles();
  console.log('LoadedGridList', data);

  // if (!ids || !data) return null;

  return data.map((d, key) => {
    return (
      <ImageListItem key={key} className={'media_ImageListItem'}>
        <img
          src={SERVER_URL + d.url}
          srcSet={SERVER_URL + d.url}
          loading="lazy"
        />
      </ImageListItem>
    );
  });
};

const GridList = (props) => {
  const { width } = props;
  const { data, isLoading } = useListContext();
  let loaded = Boolean(data && data.length);
  console.log('loaded', loaded, isLoading);
  return loaded ? (
    <LoadedGridList width={width} />
  ) : (
    <LoadingGridList width={width} />
  );
};

export default GridList;
