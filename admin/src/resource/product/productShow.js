import { SimpleShowLayout, Show, TextField } from 'react-admin';
import CardActions from '@mui/material/CardActions';

import TelegramPushPostButton from '@/components/TelegramPushPostButton';

import Form from './productForm';


const show = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="title.fa" />
        <TextField source="views" />
        <TextField source="views" />
      </SimpleShowLayout>
    </Show>
  );
};

export default show;
