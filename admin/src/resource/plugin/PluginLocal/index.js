import { useEffect, useState } from 'react';
import { useTranslate, useLocale, useNotify } from 'react-admin';
import Button from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { Delete, Edit } from '@mui/icons-material';
import Paper from '@mui/material/Paper';

import TableRow from '@mui/material/TableRow';

import API from '@/functions/API';
import RemovePlugin from './RemovePlugin';
import EditPlugin from './EditPlugin';

const list = (props) => {
  const translate = useTranslate();
  const locale = useLocale();
  const notify = useNotify();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  // const [showModal, setShowModal] = useState(false);

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

  if (loading) return <p>Loading...</p>;
  console.log(actionType === 2);
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
              <TableCell>{translate('resources.plugin.unistall')}</TableCell>
              <TableCell>{translate('resources.plugin.edit')}</TableCell>
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
                <TableCell>
                  <Button onClick={() => handleAction(1, row.slug)}>
                    <Delete />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleAction(2, row.slug)}>
                    <Edit />
                  </Button>
                </TableCell>               
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <RemovePlugin
        reFetch={fetchData}
        data={selectedPluginData}
        isLoading={actionLoading}
        open={actionType === 1}
        onClose={() => setActionType(0)}
      />
      <EditPlugin
        data={selectedPluginData}
        isLoading={actionLoading}
        open={actionType === 2}
        onClose={() => setActionType(0)}
      />
    </>
  );
};

export default list;
