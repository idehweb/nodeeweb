import { useState, useEffect } from 'react';
import {
  required,
  Button,
  SaveButton,
  TextInput,
  useCreate,
  Form,
  useLocale,
  useNotify,
  useRedirect,
} from 'react-admin';
import API from '@/functions/API';
import Modal from '../Modal';

export default function InstallPlugin({ open, onClose, slug }) {
  const [data, setData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const locale = useLocale();
  const notify = useNotify();
  const redirect = useRedirect();
  const [create, { loading,error }] = useCreate('/plugin/local/' + slug);

  useEffect(() => {
    if (slug) {
      setIsLoaded(false);
      API.get(`/plugin/market/${slug}`).then(({ data }) => {
        setIsLoaded(true);
        setData(data.data);
      });
    }
  }, [slug]);

  const handleSubmit = (values) => {
    create(
      'plugin/local/install' + slug,
      { data: values },
      {
        onSuccess: (data) => {
          notify('install Plugin Successfuly');
          redirect('/plugin/local');
        },
        onError: (err) => {
          notify(err.message, { type: 'error' });
        },
      }
    );
  };

  return (
    <Modal title={data.name} loading={!isLoaded} open={open} onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        <div>
          {data?.add?.inputs.map((i) => (
            <TextInput
              source={i.key}
              autoComplete='off'
              label={locale === 'en' ? i.title.en : i.title.fa}
              validate={required()}
              fullWidth
            />
          ))}
        </div>
        <div>
          <SaveButton label="install" disabled={loading} />
        </div>
      </Form>
    </Modal>
  );
}
