import {
  required,
  SaveButton,
  TextInput,
  Form,
  useLocale,
  useCreate,
  useNotify,
} from 'react-admin';
import API from '@/functions/API';
import Modal from '../Modal';

export default function ConfigModal({ open, onClose, data, loading, reFetch }) {
  const locale = useLocale();
  const notify = useNotify();
  const [create, { isLoading }] = useCreate();

  const handleSubmit = (values) => {
    create(
      'plugin/local/config/' + data.slug,
      { data: values },
      {
        onSuccess: (data) => {
          notify('Config Plugin Successfuly');
          reFetch();
          onClose();
        },
        onError: (err) => {
          notify(err.message, { type: 'error' });
        },
      }
    );
  };
  return (
    <Modal title={data.name} loading={loading} open={open} onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        <div>
          {data?.config?.inputs.map((i) => (
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
          <SaveButton label="Config" disabled={isLoading} />
        </div>
      </Form>
    </Modal>
  );
}
