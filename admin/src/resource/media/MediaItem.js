import { useState } from 'react';
import { useListContext, useNotify, useRefresh } from 'react-admin';
import {
  VideoFile,
  AudioFile,
  Description,
  Edit,
  Delete,
} from '@mui/icons-material';
import Button from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import API, { SERVER_URL } from '@/functions/API';
import UpdateModal from './UpdateModal';

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 10,
    width: 150,
    height: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#444',
    position: 'relative',
    '& img': {
      width: '100%',
      height: '100%',
    },
    '& svg': {
      fontSize: 45,
    },
    '&>div': {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,.6)',
      color: '#fff',
      transition: '.2s all',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
      cursor: 'pointer',
      '& svg': {
        fontSize: 25,
        fill: '#ddd',
      },
      '& div': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      },
    },
    '&:hover>div': {
      opacity: 1,
    },
  },
}));

export default function MediaItem() {
  const cls = useStyles();
  const notify = useNotify();
  const refresh = useRefresh();
  const { data, isLoading } = useListContext();
  const [editFile, setEditFile] = useState(0);

  const openFileHandler = (url) => {
    window.open(SERVER_URL + url);
  };
  const deleteFileHandler = (e, id) => {
    e.stopPropagation();
    API.delete(`/file/${id}`)
      .then(() => {
        notify('Delete file successfuly');
        refresh();
      })
      .catch((err) => notify(err.message, { type: 'error' }));
  };
  const editFileHandler = (data) => {
    const formData = new FormData();    
    formData.append('file', data.attachments?.rawFile);
    formData.append('title', data.title);
    API.defaults.headers.common['Content-Type'] = 'multipart/form-data';
    API.put(`/file/${editFile.id}`, formData)
      .then(() => {
        notify('Update file successfuly');
        setEditFile(0);
        refresh();
      })
      .catch((err) => notify(err.message, { type: 'error' }));
  };

  if (isLoading) return <p>Loading...</p>;
  return (
    <>
      {data.map((i) => (
        <div className={cls.box} onClick={() => openFileHandler(i.url)}>
          {CheckTypeMedia(i)}
          <div>
            <p>{i.title}</p>
            <div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditFile(i);
                }}>
                <Edit />
              </Button>
              <Button onClick={(e) => deleteFileHandler(e, i.id)}>
                <Delete />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <UpdateModal
        open={editFile !== 0}
        onClose={() => setEditFile(0)}
        data={editFile}
        submit={editFileHandler}
      />
    </>
  );
}

const CheckTypeMedia = (data) => {
  switch (data.type) {
    case 'image':
      return <img src={SERVER_URL + data.url} alt={data.title} />;
    case 'video':
      return <VideoFile />;
    case 'audio':
      return <AudioFile />;
    default:
      return <Description />;
  }
};
