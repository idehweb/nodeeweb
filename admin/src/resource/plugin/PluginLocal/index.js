import { useEffect, useState } from 'react';
import { useTranslate, useLocale, useNotify, useUpdate } from 'react-admin';
import Button from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import {
  Delete,
  Edit,
  ToggleOff,
  ToggleOn,
  Settings,
} from '@mui/icons-material';
import Paper from '@mui/material/Paper';

import TableRow from '@mui/material/TableRow';

import API from '@/functions/API';
import RemoveModal from './RemoveModal';
import EditModal from './EditModal';
import ConfigModal from './ConfigModal';

const STATUS = {
  needConfig: 'need-to-config',
  active: 'active',
  inactive: 'inactive',
};

const list = (props) => {
  const translate = useTranslate();
  const locale = useLocale();
  const notify = useNotify();
  const [updateOne, { isLoading }] = useUpdate();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);
  const [selectedPluginData, setSelectedPluginData] = useState({});
  const [actionType, setActionType] = useState();

  const fetchData = () => {
    setLoading(true);
    API.get('/plugin/local')
      .then(({ data }) => {
        setData(data.data);
        setLoading(false);
      })
      .catch((err) => notify(err.message, { type: 'error' }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = (type, slug) => {
    setActionLoading(true);
    setActionType(type);
    API.get(`/plugin/local/${slug}`)
      .then(({ data }) => {
        setSelectedPluginData(data.data);
        setActionLoading(false);
      })
      .catch((err) => notify(err.message, { type: 'error' }));
  };
  const changeActivationHandler = (slug, statusRow) => {
    if (statusRow === STATUS.needConfig) {
      notify('Please Config plugin', { type: 'error' });
      return;
    }
    const status =
      statusRow === STATUS.active ? STATUS.inactive : STATUS.active;
    updateOne(
      'plugin/local',
      { id: slug, data: { status } },
      {
        onSuccess: (data) => {
          notify('Change Status Successful');
          fetchData();
        },
        onError: (err) => notify(err.message, { type: 'error' }),
      }
    );
  };

  if (loading) return <p>Loading...</p>;
  if (data.length < 1) return <p>There are no plugins installed</p>;
  // if(!data.length) return <p>No plugins are installed</p>

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>{translate('resources.plugin.name')}</TableCell>
              <TableCell>{translate('resources.plugin.description')}</TableCell>
              <TableCell>{translate('resources.plugin.version')}</TableCell>
              <TableCell>{translate('resources.plugin.status')}</TableCell>
              <TableCell>
                {translate('resources.plugin.configuration')}/
                {translate('resources.plugin.edit')}
              </TableCell>
              <TableCell>{translate('resources.plugin.activation')}</TableCell>
              <TableCell>{translate('resources.plugin.unistall')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  {locale === 'en'
                    ? row?.description?.en
                    : row?.description?.fa}
                </TableCell>
                <TableCell>{row.version}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {row.status === STATUS.needConfig ? (
                    <Button onClick={() => handleAction(3, row.slug)}>
                      <Settings />
                    </Button>
                  ) : (
                    <Button onClick={() => handleAction(2, row.slug)}>
                      <Edit />
                    </Button>
                  )}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Button
                    title={row.status}
                    disabled={isLoading}
                    onClick={() =>
                      changeActivationHandler(row.slug, row.status)
                    }
                    style={{ opacity: row.status === STATUS.active ? 1 : 0.5 }}>
                    {row.status === STATUS.active ? (
                      <ToggleOff />
                    ) : (
                      <ToggleOn />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleAction(1, row.slug)}>
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <RemoveModal
        reFetch={fetchData}
        data={selectedPluginData}
        loading={actionLoading}
        open={actionType === 1}
        onClose={() => setActionType(0)}
      />
      <EditModal
        data={selectedPluginData}
        loading={actionLoading}
        open={actionType === 2}
        onClose={() => setActionType(0)}
      />
      <ConfigModal
        reFetch={fetchData}
        data={selectedPluginData}
        loading={actionLoading}
        open={actionType === 3}
        onClose={() => setActionType(0)}
      />
    </>
  );
};

export default list;
