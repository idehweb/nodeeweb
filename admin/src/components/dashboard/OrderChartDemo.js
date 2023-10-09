import React from 'react';
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

import { dateFormat, dateFormatter, getDays, jToM } from '@/functions';
import OrderDateChartFilters from '@/components/dashboard/OrderDateChartFilters';
import API from '@/functions/API';

const OrderChartDemo = (props) => {
  const lastDay = new Date();

  const [forms, setForms] = React.useState([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [defaultDays, setDefaultDays] = React.useState(0);
  const [startDateFilter, setStartDateFilter] = React.useState(0);
  const [endDateFilter, setEndDateFilter] = React.useState(0);
  const lastMonthDays = Array.from(
    { length: defaultDays > 0 ? defaultDays : 30 },
    (_, i) => subDays(lastDay, i)
  );
  const aMonthAgo = subDays(new Date(), 30);
  const translate = useTranslate();
  // const aMonthAgo = subDays(new Date(), 30);
  // aMonthAgo.setDate(aMonthAgo.getDate() - 30);
  // aMonthAgo.setHours(0);
  // aMonthAgo.setMinutes(0);
  // aMonthAgo.setSeconds(0);
  // aMonthAgo.setMilliseconds(0);
  const themeData = useSelector((st) => st.themeData);
  // const { isLoading: loaded, data: visitors } = useGetList(props.model,
  //   {
  //     filter: { date_gte: aMonthAgo.toISOString() },
  //     pagination: { page: 1, perPage: 10000 }
  //     // sort: { field: "published_at", order: "DESC" }
  //   }
  // );

  const aggregateOrdersByDay = ({ data: order = [] }) => {
    return order.reduce((acc, curr) => {
      const day = dateFormat(curr.createdAt, 'YYYY/MM/DD');
      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day] += curr.amount || 0;
      return acc;
    }, {});
  };
  const aggregateOrdersCompletedByDay = ({ data: order = [] }) => {
    return order.reduce((acc, curr) => {
      // console.log('acc',acc)
      // console.log('curr',curr.createdAt)
      const day = dateFormat(curr.createdAt, 'YYYY/MM/DD');
      // console.log('day', day);
      if (!acc[day]) {
        acc[day] = 0;
      }
      if (curr.status == 'complete') acc[day] += curr.amount || 0;
      // console.log('acc', acc);
      return acc;
    }, {});
  };
  const aggregateOrdersSuccessPaymentByDay = ({ data: order = [] }) => {
    return order.reduce((acc, curr) => {
      // console.log('acc',acc)
      // console.log('curr',curr.createdAt)
      const day = dateFormat(curr.createdAt, 'YYYY/MM/DD');
      // console.log('day', day);
      if (!acc[day]) {
        acc[day] = 0;
      }
      if (curr.paymentStatus == 'paid') acc[day] += curr.amount || 0;
      // console.log('acc', acc);
      return acc;
    }, {});
  };
  const getRevenuePerDay = (orders) => {
    let arrayFilter = [];
    const daysWithRevenue = aggregateOrdersByDay(orders);
    const daysWithRevenue2 = aggregateOrdersCompletedByDay(orders);
    const daysWithRevenue3 = aggregateOrdersSuccessPaymentByDay(orders);
    lastMonthDays.map((date) => {
      arrayFilter.push({
        date: date.getTime(),
        total: daysWithRevenue[dateFormat(date, 'YYYY/MM/DD')] || 0,
        complete: daysWithRevenue2[dateFormat(date, 'YYYY/MM/DD')] || 0,
        paid: daysWithRevenue3[dateFormat(date, 'YYYY/MM/DD')] || 0,
      });
    });
    setForms(arrayFilter);
  };

  const getRevenuePerDateFilter = (orders, dateCallBack, type, days = 0) => {
    let arrayFilter = [];
    const daysWithRevenue = aggregateOrdersByDay(orders);
    const daysWithRevenue2 = aggregateOrdersCompletedByDay(orders);
    const daysWithRevenue3 = aggregateOrdersSuccessPaymentByDay(orders);
    if (type === 'start') {
      setStartDateFilter(dateCallBack);
      if (defaultDays > 0) {
        lastMonthDays.map((date) => {
          if (startDateFilter > 1) {
            if (date.getTime() > startDateFilter.getTime()) {
              arrayFilter.push({
                date: date.getTime(),
                total: daysWithRevenue[dateFormat(date, 'YYYY/MM/DD')] || 0,
                complete: daysWithRevenue2[dateFormat(date, 'YYYY/MM/DD')] || 0,
                paid: daysWithRevenue3[dateFormat(date, 'YYYY/MM/DD')] || 0,
              });
            }
          } else {
            if (date.getTime() > dateCallBack.getTime()) {
              arrayFilter.push({
                date: date.getTime(),
                total: daysWithRevenue[dateFormat(date, 'YYYY/MM/DD')] || 0,
                complete: daysWithRevenue2[dateFormat(date, 'YYYY/MM/DD')] || 0,
                paid: daysWithRevenue3[dateFormat(date, 'YYYY/MM/DD')] || 0,
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
                total: daysWithRevenue[dateFormat(date, 'YYYY/MM/DD')] || 0,
                complete: daysWithRevenue2[dateFormat(date, 'YYYY/MM/DD')] || 0,
                paid: daysWithRevenue3[dateFormat(date, 'YYYY/MM/DD')] || 0,
              });
            }
          } else {
            if (date.getTime() > dateCallBack.getTime()) {
              arrayFilter.push({
                date: date.getTime(),
                total: daysWithRevenue[dateFormat(date, 'YYYY/MM/DD')] || 0,
                complete: daysWithRevenue2[dateFormat(date, 'YYYY/MM/DD')] || 0,
                paid: daysWithRevenue3[dateFormat(date, 'YYYY/MM/DD')] || 0,
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
                total: daysWithRevenue[dateFormat(date, 'YYYY/MM/DD')] || 0,
                complete: daysWithRevenue2[dateFormat(date, 'YYYY/MM/DD')] || 0,
                paid: daysWithRevenue3[dateFormat(date, 'YYYY/MM/DD')] || 0,
              });
            }
          } else {
            if (
              date.getTime() > startDateFilter.getTime() &&
              date.getTime() < dateCallBack.getTime()
            ) {
              arrayFilter.push({
                date: date.getTime(),
                total: daysWithRevenue[dateFormat(date, 'YYYY/MM/DD')] || 0,
                complete: daysWithRevenue2[dateFormat(date, 'YYYY/MM/DD')] || 0,
                paid: daysWithRevenue3[dateFormat(date, 'YYYY/MM/DD')] || 0,
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
                total: daysWithRevenue[dateFormat(date, 'YYYY/MM/DD')] || 0,
                complete: daysWithRevenue2[dateFormat(date, 'YYYY/MM/DD')] || 0,
                paid: daysWithRevenue3[dateFormat(date, 'YYYY/MM/DD')] || 0,
              });
            }
          } else {
            if (
              date.getTime() > startDateFilter.getTime() &&
              date.getTime() < dateCallBack.getTime()
            ) {
              arrayFilter.push({
                date: date.getTime(),
                total: daysWithRevenue[dateFormat(date, 'YYYY/MM/DD')] || 0,
                complete: daysWithRevenue2[dateFormat(date, 'YYYY/MM/DD')] || 0,
                paid: daysWithRevenue3[dateFormat(date, 'YYYY/MM/DD')] || 0,
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
    const DaysLenght = getDays(start);
    setDefaultDays(DaysLenght.length);
    const url =
      '/order/0/40000?date_gte=' + jToM(dateFormatter(start)) + '&_order=ASC';
    Block.circle('.' + props.model);
    API.get(url).then((res) => {
      const { data } = res;
      setTotalItems(res.headers['x-total-count']);
      if (data) {
        getRevenuePerDateFilter(data, start, 'start', DaysLenght.length);
        Block.remove('.' + props.model);
      }
    });
  };
  const endFunction = (end) => {
    setEndDateFilter(end);
    let filterListDataEnd = [];
    const DaysLenght = getDays(startDateFilter, end);
    setDefaultDays(DaysLenght.length);
    const url =
      '/order/0/10000?date_gte=' +
      jToM(dateFormatter(startDateFilter)) +
      '&date_lte=' +
      jToM(dateFormatter(end)) +
      '&_order=ASC';
    Block.circle('.' + props.model);
    API.get(url).then((res) => {
      const { data } = res;
      setTotalItems(res.headers['x-total-count']);
      if (data) {
        if (data) {
          data.forEach((ent) => {
            filterListDataEnd.push(ent);
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
    });
  };
  const handleChangeStatus = (status) => {
    console.log('statusOrdersIssssss', status);
  };

  React.useEffect(() => {
    API.get('/order/0/1000?_order=ASC').then((res) => {
      const { data } = res;
      setTotalItems(res.headers['x-total-count']);
      if (data) {
        getRevenuePerDay(data);
      }
    });
  }, []);
  // if (forms.length === 0){
  //   Block.circle('.'+props.model);
  // }else{
  //   Block.remove('.'+props.model);
  // }
  return (
    <section className={props.model}>
      <Card className={'width1000'}>
        <CardHeader title={translate(props.title)} />
        <OrderDateChartFilters
          handleChangeStatus={handleChangeStatus}
          handlerStart={startFunction}
          handlerEnd={endFunction}
          model={props.model}
        />
        <CardContent>
          <div style={{ height: 300 }} className={'order-chart'}>
            {forms.length > 0 && (
              <React.Fragment>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forms} width={1000}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      name="date"
                      dataKey="date"
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
                              <div>
                                {value
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                                  ' ' +
                                  translate(themeData.currency)}
                              </div>
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
                    <Line
                      type="monotone"
                      dataKey={'complete'}
                      label={translate('pos.OrderStatus.complete')}
                      stroke="#31bd58"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey={'paid'}
                      label={translate('pos.OrderStatus.paid')}
                      stroke="#1875d2"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="notes" style={{ textAlign: 'center' }}>
                  Total Items : {totalItems > 0 && totalItems}
                </p>
              </React.Fragment>
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

export default OrderChartDemo;
