import { List } from 'react-admin';

export default (props) => (
  <List exporter={false} bulkActionButtons={false} {...props} />
);
