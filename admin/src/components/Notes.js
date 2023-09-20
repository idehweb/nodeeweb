import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

// import MuiGridList from '@mui/material/GridList';
// import GridListTile from '@mui/material/GridListTile';
// import GridListTileBar from '@mui/material/GridListTileBar';
// import withWidth, { WithWidth } from '@mui/material/withWidth';
// import CreateIcon from '@mui/icons-material/Create';
import IconButton from '@mui/material/IconButton';

import { Create, SimpleForm, useDataProvider, useTranslate } from 'react-admin';
import Box from '@mui/material/Box';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useSelector } from 'react-redux';
import { RichTextInput } from 'ra-input-rich-text';

import { dateFormat } from '@/functions';
import { NoteShow } from '@/components';
import { ShopURL } from '@/functions/API';

const Notes = (props) => {
  const { record } = props;
  const { _id } = record;
  const [state, setState] = useState({
    enableAddNote: false,
  });
  const translate = useTranslate();
  // const version = useVersion();
  const dataProvider = useDataProvider();
  const themeData = useSelector((st) => st.themeData);

  const fetchNotes = useCallback(async () => {
    const { data: Data } = await dataProvider.get(
      'note/0/10000?customer=' + _id,
      {}
    );
    console.log('Data', Data);

    setState((state) => ({
      ...state,
      notes: Data,
      enableAddNote: false,
    }));
  }, [dataProvider]);
  useEffect(() => {
    fetchNotes();
  }, []);
  const addNote = () => {
    setState((state) => ({
      ...state,
      enableAddNote: !state.enableAddNote,
    }));
  };
  let { notes, enableAddNote } = state;

  const transform = (data) => ({
    ...data,
    customer: _id,
  });
  const onSuccess = (data) => {
    fetchNotes();
    // setState(state => ({
    //   ...state,
    //   enableAddNote: false
    //
    // }));
  };
  return (
    <div style={{ padding: '10px' }}>
      <div className={'label-top-table'}>
        <span>{translate('notes')}</span>
        <span>
          <IconButton
            aria-label="create"
            onClick={(e) => {
              addNote();
            }}>
            <NoteAddIcon />
          </IconButton>
        </span>
      </div>
      {!enableAddNote && (
        <div className={'grid-box one-box'}>
          {notes &&
            notes.map((d, key) => {
              return <NoteShow key={key} note={d} />;
            })}
          <NoteShow
            add={true}
            onClick={(e) => {
              addNote();
            }}
          />
        </div>
      )}
      {enableAddNote && (
        <Box>
          <Create
            mutationOptions={{ onSuccess }}
            resource="note"
            redirect={'false'}
            transform={transform}>
            <SimpleForm>
              <RichTextInput
                fullWidth
                source={'description.' + translate('lan')}
                toolbar={false}
                label={translate('resources.product.description')}
              />
            </SimpleForm>
          </Create>
        </Box>
      )}
    </div>
  );
};

export default Notes;
