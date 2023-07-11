import { SimpleForm } from 'react-admin';

export default (props) => (
  <SimpleForm
    {...props}
    warnWhenUnsavedChanges
    variant="standard"
    redirect="list"
  />
);
