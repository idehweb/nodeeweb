import { FormControlLabel, Switch,FormGroup } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import InstanceDomains from './Domains';
import { Button } from 'shards-react';
import { updateInstance } from '#c/functions/instance-api';

export default function InstanceEditForm({ ins }) {
  const [status, setStatus] = useState({ state: 'none' });
  const turnToggle = useCallback(
    async (e) => {
      e.preventDefault();
      setStatus({ state: 'loading' });
      const response = await updateInstance(ins._id, {
        status: ins.status === 'up' ? 'down' : 'up',
      });
      if (response) return setStatus({ state: 'success' });
      setStatus({ state: 'error' });
    },
    [ins],
  );

  const domainUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      setStatus({ state: 'loading' });
      const domains_add = domainsRef.current.getAdd();
      const domains_rm = domainsRef.current.getRemove();
      const response = await updateInstance(ins._id, {
        domains_add,
        domains_rm,
      });
      if (response) return setStatus({ state: 'success' });
      setStatus({ state: 'error' });
    },
    [ins],
  );

  const domainsRef = useRef(null);

  useEffect(() => {
    if (status.state === 'error') {
      toast('Error', { type: 'error' });
    }
    if (status.state === 'success') {
      toast('Success', { type: 'success' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [status.state]);

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            defaultChecked={ins.status === 'up'}
            disabled={
              !['up', 'down', 'error'].includes(ins.status) ||
              status.state === 'loading'
            }
            onChange={turnToggle}
          />
        }
        label="Status"
      />
      <div>
        <InstanceDomains
          defaultDomains={ins.domains.map((d) => d.content)}
          domainsRef={domainsRef}
        />
        <Button onClick={domainUpdate} disabled={status.state === 'loading'}>
          Save Domains
        </Button>
      </div>
    </FormGroup>
  );
}
