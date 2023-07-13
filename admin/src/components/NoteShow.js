import { useListContext, useTranslate } from 'react-admin';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const useStyles = makeStyles((theme) => ({
  gridList: {
    margin: 0,
  },
  tileBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)',
  },
  placeholder: {
    backgroundColor: '#d4b965',
    height: '100%',
    color: '#000',
  },
  price: {
    display: 'inline',
    fontSize: '1em',
  },
  link: {
    color: '#fff',
  },
}));

const NoteShow = (props) => {
  const { note, add, onClick } = props;
  const { data } = useListContext();
  const translate = useTranslate();
  const classes = useStyles();
  // console.log("LoadedGridList", data);

  const returnDes = (d) => {
    let f = {};
    if (d.description) f = d.description;
    if (f[translate('lan')]) return f[translate('lan')];
    else return '';
  };

  const returnTitle = (d) => {
    let f = {};
    if (d.title) f = d.title;
    if (f[translate('lan')]) return f[translate('lan')];
    else return '';
  };

  if (add)
    return (
      <div
        onClick={onClick}
        key={'x'}
        className={'media_ImageListItem notLoaded'}>
        <div className={classes.placeholder}>
          <AddIcon className={'posabADDICON'} />
        </div>
      </div>
    );
  if (!note) {
    return <></>;
  }
  return (
    <Link to={'/note/' + note._id} className={'media_ImageListItem notLoaded'}>
      <div className={classes.placeholder}>
        <div
          className={'posabADDICO the-title'}
          dangerouslySetInnerHTML={{ __html: returnTitle(note) }}></div>
        <div
          className={'posabADDICO'}
          dangerouslySetInnerHTML={{ __html: returnDes(note) }}></div>
        {/*<DeleteForeverIcon className={"posabADDICOtrash"}/>*/}
      </div>
    </Link>
  );
};
export default NoteShow;
