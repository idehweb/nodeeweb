import { useEffect, useState } from 'react';
import { useTranslate, useLocale, useNotify } from 'react-admin';
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
import InstallModal from './InstallPlugin';

import TableRow from '@mui/material/TableRow';

import API from '@/functions/API';

const list = (props) => {
  const translate = useTranslate();
  const locale = useLocale();
  const notify = useNotify();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRowSlug, setActiveRowSlug] = useState();
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    API.get('/plugin/market')
      .then(({ data }) => {
        setData(data.data);
        setLoading(false);
      })
      .catch((err) => notify(err.message, { type: 'error' }));
  }, []);

  const handleInstall = (slug) => {
    setShowModal(true);
    setActiveRowSlug(slug);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
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
                  {locale === 'en'
                    ? row?.description?.en
                    : row?.description?.fa}
                </TableCell>
                <TableCell>{row.version}</TableCell>
                <TableCell>
                  <Button onClick={() => handleInstall(row.slug)}>
                    <GetApp />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <InstallModal
        open={showModal}
        slug={activeRowSlug}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default list;
