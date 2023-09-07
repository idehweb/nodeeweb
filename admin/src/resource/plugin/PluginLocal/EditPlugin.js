import {
  required,
  SaveButton,
  TextInput,
  Form,
  useLocale,
  useUpdate,
  useNotify,
} from 'react-admin';
import API from '@/functions/API';
import Modal from '../Modal';

export default function RemovePlugin({
  open,
  onClose,
  data,
  isLoading,
  reFetch,
}) {
  const locale = useLocale();
  const notify = useNotify();
  const [updateOne, { loading }] = useUpdate('/plugin/local', {
    id: data.slug,
  });

  const handleSubmit = (values) => {
    updateOne(
      'plugin/local',
      { id: data.slug, data: values },
      {
        onSuccess: (data) => {
          notify('Update Plugin Successfuly');
          onClose();
        },
        onError: (err) => {
          notify(err.message, { type: 'error' });
        },
      }
    );
  };

  const parseDefaultValue = () => {
    const res = {};
    data?.edit?.inputs?.forEach((i) => {
      res[i.key] = i.value;
    });
    return res;
  };

  return (
    <Modal title={data.name} loading={isLoading} open={open} onClose={onClose}>
      <Form onSubmit={handleSubmit} defaultValues={parseDefaultValue}>
        <div>
          {data?.edit?.inputs.map((i) => (
            <TextInput
              source={i.key}
              autoComplete="off"
              value={'123321'}
              label={locale === 'en' ? i.title.en : i.title.fa}
              validate={required()}
              fullWidth
            />
          ))}
        </div>
        <div>
          <SaveButton label="Update" disabled={loading} />
        </div>
      </Form>
    </Modal>
  );
}
