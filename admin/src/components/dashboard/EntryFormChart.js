import * as React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useGetList, useTranslate } from 'react-admin';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { subDays } from 'date-fns';
import { useSelector } from 'react-redux';

import { Block } from 'notiflix/build/notiflix-block-aio';

import { dateFormat, jToM, getDays } from '@/functions';
import EntryFormChartFilters from '@/components/dashboard/EntryFormChartFilters';
import API from '@/functions/API';

const dateFormatter = (date) => {
  return dateFormat(new Date(date), 'YYYY/MM/DD');
};

const EntryFormChart = (props) => {
  const [totalItems, setTotalItems] = React.useState(0);
  const [defaultDays, setDefaultDays] = React.useState(0);
  const [forms, setForms] = React.useState([]);
  const [formIdFilter, setFormIdFilter] = React.useState('');
  const [startDateFilter, setStartDateFilter] = React.useState(0);
  const [endDateFilter, setEndDateFilter] = React.useState(0);
  let filterListData = [];

  const translate = useTranslate();
  const classes = useStyles();
  const { title } = props;
  const aMonthAgo = subDays(new Date(), 30);
  const lastDay = new Date();
  const lastMonthDays = Array.from(
    { length: defaultDays > 0 ? defaultDays : 30 },
    (_, i) => subDays(lastDay, i)
  );
  aMonthAgo.setDate(aMonthAgo.getDate() - 30);
  aMonthAgo.setHours(0);
  aMonthAgo.setMinutes(0);
  aMonthAgo.setSeconds(0);
  aMonthAgo.setMilliseconds(0);
  const themeData = useSelector((st) => st.themeData);

  const aggregateEntriesByDay = (entry = []) => {
    return entry.reduce((acc, curr) => {
      const day = dateFormat(curr.createdAt, 'YYYY/MM/DD');

      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day] += 1 || 0;
      return acc;
    }, {});
  };
  const getRevenuePerDay = (entries) => {
    const daysWithRevenueEntries = aggregateEntriesByDay(entries);
    return lastMonthDays.map((date) => {
      return {
        date: date.getTime(),
        total: daysWithRevenueEntries[dateFormat(date, 'YYYY/MM/DD')] || 0,
      };
    });
  };

  const handleChangeFormFilter = (formID) => {
    setFormIdFilter(formID);
    filterListData = [];
    const url = '/entry/0/1000?_order=ASC';
    Block.circle('.' + props.model);
    API.get(url).then((res) => {
      const { data } = res;
      setTotalItems(res.headers['x-total-count']);
      if (formID === '') {
        setForms(getRevenuePerDay(data));
      } else {
        if (data) {
          data.forEach((ent) => {
            if (ent.form._id === formID) {
              filterListData.push(ent);
            }
          });
        }
        setForms(getRevenuePerDay(filterListData));
        Block.remove('.' + props.model);
      }
    });
  };

  const getRevenuePerDateFilter = (
    entriessss,
    dateCallBack,
    type,
    days = 0
  ) => {
    let arrayFilter = [];
    const daysWithRevenueEntries = aggregateEntriesByDay(entriessss);
    if (type === 'start') {
      setStartDateFilter(dateCallBack);
      if (defaultDays > 0) {
        lastMonthDays.map((date) => {
          if (startDateFilter > 1) {
            if (date.getTime() > startDateFilter.getTime()) {
              arrayFilter.push({
                date: date.getTime(),
                total:
                  daysWithRevenueEntries[dateFormat(date, 'YYYY/MM/DD')] || 0,
              });
            }
          } else {
            if (date.getTime() > dateCallBack.getTime()) {
              arrayFilter.push({
                date: date.getTime(),
                total:
                  daysWithRevenueEntries[dateFormat(date, 'YYYY/MM/DD')] || 0,
              });
            }
          }
        });
      } else {
        const lastMonthDayss = Array.from(
          { length: days > 0 ? days : 30 },
          (_, i) => subDays(lastDay, i)
        );
        lastMonthDayss.map((date) => {
          if (startDateFilter > 1) {
            if (date.getTime() > startDateFilter.getTime()) {
              arrayFilter.push({
                date: date.getTime(),
                total:
                  daysWithRevenueEntries[dateFormat(date, 'YYYY/MM/DD')] || 0,
              });
            }
          } else {
            if (date.getTime() > dateCallBack.getTime()) {
              arrayFilter.push({
                date: date.getTime(),
                total:
                  daysWithRevenueEntries[dateFormat(date, 'YYYY/MM/DD')] || 0,
              });
            }
          }
        });
      }
    }
    if (type === 'end') {
      setEndDateFilter(dateCallBack);
      if (defaultDays > 0) {
        lastMonthDays.map((date) => {
          if (endDateFilter > 1) {
            if (
              date.getTime() > startDateFilter.getTime() &&
              date.getTime() < endDateFilter.getTime()
            ) {
              arrayFilter.push({
                date: date.getTime(),
                total:
                  daysWithRevenueEntries[dateFormat(date, 'YYYY/MM/DD')] || 0,
              });
            }
          } else {
            if (
              date.getTime() > startDateFilter.getTime() &&
              date.getTime() < dateCallBack.getTime()
            ) {
              arrayFilter.push({
                date: date.getTime(),
                total:
                  daysWithRevenueEntries[dateFormat(date, 'YYYY/MM/DD')] || 0,
              });
            }
          }
        });
      } else {
        const lastMonthDayss = Array.from(
          { length: days > 0 ? days : 30 },
          (_, i) => subDays(lastDay, i)
        );
        lastMonthDayss.map((date) => {
          if (endDateFilter > 1) {
            if (
              date.getTime() > startDateFilter.getTime() &&
              date.getTime() < endDateFilter.getTime()
            ) {
              arrayFilter.push({
                date: date.getTime(),
                total:
                  daysWithRevenueEntries[dateFormat(date, 'YYYY/MM/DD')] || 0,
              });
            }
          } else {
            if (
              date.getTime() > startDateFilter.getTime() &&
              date.getTime() < dateCallBack.getTime()
            ) {
              arrayFilter.push({
                date: date.getTime(),
                total:
                  daysWithRevenueEntries[dateFormat(date, 'YYYY/MM/DD')] || 0,
              });
            }
          }
        });
      }
    }
    if (arrayFilter.length > 0) {
      setForms(arrayFilter);
    }
  };

  const startFunction = (start) => {
    setStartDateFilter(start);
    let filterListDataStart = [];
    const DaysLenght = getDays(start);
    setDefaultDays(DaysLenght.length);
    const url =
      '/entry/0/40000?date_gte=' + jToM(dateFormatter(start)) + '&_order=ASC';
    Block.circle('.' + props.model);
    API.get(url).then((res) => {
      const { data } = res;
      setTotalItems(res.headers['x-total-count']);
      if (data) {
        if (formIdFilter !== '') {
          data.forEach((ent) => {
            if (ent.form._id === formIdFilter) {
              filterListDataStart.push(ent);
            }
          });
          getRevenuePerDateFilter(
            filterListDataStart,
            start,
            'start',
            DaysLenght.length
          );
          Block.remove('.' + props.model);
        }
      }
    });
  }; //endFunction
  const endFunction = (end) => {
    setEndDateFilter(end);
    let filterListDataEnd = [];
    const DaysLenght = getDays(startDateFilter, end);
    setDefaultDays(DaysLenght.length);
    const url =
      '/entry/0/10000?date_gte=' +
      jToM(dateFormatter(startDateFilter)) +
      '&date_lte=' +
      jToM(dateFormatter(end)) +
      '&_order=ASC';
    Block.circle('.' + props.model);
    API.get(url).then((res) => {
      const { data } = res;
      setTotalItems(res.headers['x-total-count']);
      if (data) {
        if (formIdFilter !== '') {
          if (data) {
            data.forEach((ent) => {
              if (ent.form._id === formIdFilter) {
                filterListDataEnd.push(ent);
              }
            });
          }
          getRevenuePerDateFilter(
            filterListDataEnd,
            end,
            'end',
            DaysLenght.length
          );
          Block.remove('.' + props.model);
        }
      }
    });
  }; //endFunction

  return (
    <section className={props.model}>
      <Card className={'width1000'} style={{ marginTop: '20px' }}>
        <CardHeader title={translate(props.title)} />
        <EntryFormChartFilters
          handleChangeForm={handleChangeFormFilter}
          handlerStart={startFunction}
          handlerEnd={endFunction}
          model={'form'}
        />
        <CardContent>
          <div style={{ height: 300 }} className={'entry-chart'}>
            {forms.length > 0 ? (
              <React.Fragment>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forms} width={1000}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      name="date"
                      dataKey="date"
                      // label={'روز'}
                      // type="number"
                      // scale="time"
                      // domain={[
                      //   addDays(aMonthAgo, 1).getTime(),
                      //   new Date().getTime(),
                      // ]}
                      tickFormatter={dateFormatter}
                    />
                    <YAxis />
                    <Tooltip
                      cursor={{ strokeDasharray: '10 10' }}
                      formatter={(value, name, props) => {
                        let { payload } = props;
                        let { date } = payload;
                        if (value)
                          return (
                            <div>
                              <div>{dateFormatter(date)}</div>
                              <div>{value + ' عدد'}</div>
                            </div>
                          );
                        else return '0';
                      }}
                      labelFormatter={(label) => {
                        return dateFormatter(label);
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={'total'}
                      label={translate('total')}
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                    {/*<Line type="monotone" dataKey={("total")} label={translate("total")} stroke="#8884d8"  strokeWidth={2}/>*/}
                    {/*<Line type="monotone" dataKey={("complete")} label={translate("pos.OrderStatus.complete")} stroke="#31bd58"  strokeWidth={2}/>*/}
                    {/*<Line type="monotone" dataKey={("paid")} label={translate("pos.OrderStatus.paid")} stroke="#1875d2"  strokeWidth={2}/>*/}
                  </LineChart>
                </ResponsiveContainer>
                <p className="notes" style={{ textAlign: 'center' }}>
                  Total Items : {totalItems > 0 && totalItems}
                </p>
              </React.Fragment>
            ) : (
              'لطفا فرم مورد نظر را انتخاب نمایید'
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  link: {
    borderRadius: 0,
  },
  linkContent: {
    color: theme.palette.primary.main,
  },
}));

export default EntryFormChart;
