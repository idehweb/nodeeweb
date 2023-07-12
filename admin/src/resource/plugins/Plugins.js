import * as React from 'react';
import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Box, Button, Card, Tab, Tabs } from '@mui/material';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import { useNotify, useRefresh, useTranslate } from 'react-admin';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { useNavigate, useParams } from 'react-router-dom';

import TuneIcon from '@mui/icons-material/Tune';

import { ColorPicker, ShowImageField } from '@/components';
import API, { BASE_URL } from '@/functions/API';
// import {  } from 'react-hook-form';
const Plugins = (props) => {
  const totals = 0;
  const navigate = useNavigate();
  const translate = useTranslate();

  const tabs = [
    { id: 'active', name: translate('active') },
    { id: 'market', name: translate('market') },
    { id: 'deactive', name: translate('deactive') },
  ];
  const [theData, setTheData] = React.useState([]);
  const [status, setStatus] = React.useState('active');
  const notify = useNotify();

  const handleNotif = (t, type = 'success') => notify(t, { type: type });

  React.useEffect(() => {
    console.log('status', getData(status));
  }, [status]);

  const getData = (status = 'active') => {
    let url = '/settings/plugins';
    if (status == 'active') url = '/settings/plugins';
    if (status == 'deactive') url = '/settings/deActivePlugins';

    if (status == 'market') url = '/settings/market';

    API.get(url)
      .then(({ data = {} }) => {
        setTheData(data);
        return data;
      })
      .catch((e) => {
        setTheData([]);
      });
  };

  const handleChange = (s, value) => setStatus(value);

  const activatePlugin = (plugin) => {
    console.log('activatePlugin');
    API.put('/settings/activatePlugin', JSON.stringify(plugin)).then(
      ({ data = {} }) => {
        if (data.success) {
          handleNotif('resources.settings.UpdatedSuccessfully');
          getData('deactive');
        } else {
          handleNotif('resources.settings.sthWrong', 'error');
        }
        return data;
      }
    );
  };
  const deactivatePlugin = (plugin) => {
    API.put('/settings/deActivatePlugin', JSON.stringify(plugin)).then(
      ({ data = {} }) => {
        if (data.success) {
          handleNotif('resources.settings.UpdatedSuccessfully');
          getData('active');
        } else {
          handleNotif('resources.settings.sthWrong', 'error');
        }
        return data;
      }
    );
  };

  if (!theData) {
    return <></>;
  }
  if (theData) {
    return (
      <div noValidate={true} redirect={false}>
        <Tabs
          variant="fullWidth"
          centered
          value={status}
          indicatorColor="primary"
          onChange={handleChange}>
          {tabs.map((choice) => (
            <Tab
              key={choice.id}
              label={
                totals[choice.name]
                  ? `${choice.name} (${totals[choice.name]})`
                  : choice.name
              }
              value={choice.id}
            />
          ))}
        </Tabs>
        {status == 'active' && (
          <div>
            {theData &&
              theData.map((item) => {
                return (
                  <Box className={'mt-2'}>
                    <Card
                      sx={{ padding: '1em' }}
                      className={'d-flex justify-content-between'}>
                      <span>{item.name}</span>
                      <span>
                        <Button
                          onClick={(e) => {
                            // deactivatePlugin(item);
                            navigate(`/plugins/${item.name}`);
                          }}>
                          <TuneIcon />
                        </Button>
                        <Button
                          onClick={(e) => {
                            deactivatePlugin(item);
                          }}>
                          <DoNotDisturbOnIcon />
                        </Button>
                      </span>
                    </Card>
                  </Box>
                );
              })}
          </div>
        )}

        {status == 'deactive' && (
          <div>
            {theData &&
              theData.map((item) => {
                return (
                  <Box className={'mt-2'}>
                    <Card
                      sx={{ padding: '1em' }}
                      className={'d-flex justify-content-between'}>
                      <span>{item.name}</span>
                      <span>
                        <Button
                          onClick={(e) => {
                            activatePlugin(item);
                          }}>
                          <DoneOutlineIcon />
                        </Button>
                      </span>
                    </Card>
                  </Box>
                );
              })}
          </div>
        )}
      </div>
    );
  }
};

export default Plugins;
