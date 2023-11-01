import React, { useEffect, useState } from 'react';
import { LinearProgress } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import {
  ImageField,
  ImageInput,
  useInput,
  useNotify,
  SaveButton,
  LoadingComponent,
} from 'react-admin';

import { useWatch } from 'react-hook-form';

import API, { BASE_URL, SERVER_URL } from '@/functions/API';
import Api from '@/functions/API-v1';
import { TheImages, showFiles } from '@/components';
import { uploadMedia } from '@/functions';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';

export default (props) => {
  // console.log("UploaderField...");
  // console.log("props", props);
  let valuesphotos = useWatch({ name: 'photos' });
  let valuesthumbnail = useWatch({ name: 'thumbnail' });
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  // let {values} = useFormState();
  let { field } = useInput(props);
  // console.log("input", field);
  const [gallery, setGallery] = useState(valuesphotos || []);
  const [counter, setCounter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState();
  // console.log('props.photos',valuesthumbnail);

  const [v, setV] = useState(valuesthumbnail || '');
  // console.log("props.v", v, valuesthumbnail);

  // useEffect(() => {
  //   console.log("React.useEffect UploaderField");
  //   if (field.value) setV(field.value);
  // }, []);
  // notify('File saved successfully', 'success');
  const handleUpload = () => {
    let GalleryTemp = gallery;
    // console.log("hanfleUpload");
    let file = files[0];

    if (!file) return;

    let formData = new FormData();
    formData.append('file', file);
    formData.append('type', file.type);
    setLoading(true);

    uploadMedia(file, (percent, canceler) => {
      setProgress(percent);
    })
      .then(({ data }) => {
        const { url, _id } = data;
        setProgress(0);
        GalleryTemp.push(url);
        setGallery(null);
        valuesphotos = GalleryTemp;
        props.inReturn({ _id, url }).then((res) => {
          setGallery(GalleryTemp);
          setCounter(counter + 1);
        });
        setLoading(false);
        notify('File saved successfully', { type: 'success' });
      })
      .catch((err) => {
        notify(err, { type: 'error' });
        setProgress(0);
      });
  };
  const deletFromObject = (photo, key) => {
    let cc = [];
    gallery.forEach((item) => {
      const url = item?.url || item;
      if (url !== photo) {
        cc.push(item);
      }
    });
    setGallery(cc);
    setProgress(0);
    props.onRemove && props.onRemove(photo);

    // console.log('valuesphotos',valuesphotos);
  };
  const onImageClick = (photo) => {
    props.thep(photo);
    setV(photo);
    props.changeThumbnail && props.changeThumbnail(photo);
  };
  const removeK = (g) => {
    // e.preventDefault();
    let c = [];
    gallery.map((gal, t) => {
      if (g !== t) c.push(gal);
    });
    // console.log('g', g);
    setGallery(c);
  };

  return (
    <>
      <ImageInput
        source="src"
        name={field.name}
        onChange={field.onChange}
        onBlur={field.onBlur}
        accept={props.accept}
        options={{
          onDrop: (files) => {
            setFiles(files);
          },
        }}>
        <ImageField source="src" title="title" />
      </ImageInput>
      <TheImages
        gallery={gallery?.map((path) => {
          if (path?.url) return path.url;
          return path;
        })}
        v={v}
        onImageClick={onImageClick}
        deletFromObject={deletFromObject}
        counter={counter}
      />
      {progress ? (
        <LinearProgress variant="determinate" value={progress} />
      ) : null}
      <br />
      <br />
      <div>
        <SaveButton
          type="button"
          label="Save"
          endIcon={loading ? <CircularProgress size={13} /> : null}
          disabled={loading}
          onClick={(e) => {
            e.preventDefault();
            handleUpload();
          }}
        />
      </div>
    </>
  );
};
