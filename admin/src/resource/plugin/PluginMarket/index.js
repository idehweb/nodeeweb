import { useEffect, useState } from 'react';
import {
  useTranslate,
  useLocale,
  useNotify,
  useRedirect,
  useCreate,
} from 'react-admin';
import GetApp from '@mui/icons-material/GetApp';
import {
  Paper,
  TableContainer,
  TableCell,
  TableHead,
  TableBody,
  Table,
  Button,
  Typography,
} from '@mui/material';

import TableRow from '@mui/material/TableRow';

import API from '@/functions/API';

const list = (props) => {
  const translate = useTranslate();
  const locale = useLocale();
  const notify = useNotify();
  const redirect = useRedirect();
  const [create, { isLoading }] = useCreate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/plugin/market')
      .then(({ data }) => {
        setData(data.data);
        setLoading(false);
      })
      .catch((err) => notify(err.message, { type: 'error' }));
  }, []);

  const handleInstall = (slug) => {
    if (!isLoading) {
      create(
        'plugin/local/install/' + slug,
        {},
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
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>{translate('resources.plugin.name')}</TableCell>
            <TableCell>{translate('resources.plugin.description')}</TableCell>
            <TableCell>{translate('resources.plugin.version')}</TableCell>
            <TableCell>{translate('resources.plugin.install')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                {locale === 'en' ? row?.description?.en : row?.description?.fa}
              </TableCell>
              <TableCell>{row.version}</TableCell>
              <TableCell>
                <Button
                  disabled={isLoading}
                  onClick={() => handleInstall(row.slug)}>
                  <GetApp />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default list;
