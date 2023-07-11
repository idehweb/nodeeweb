import * as React from "react";
import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomerIcon from "@mui/icons-material/PersonAdd";
import { Link } from "react-router-dom";
import { useGetList, useTranslate } from "react-admin";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import {Card, CardContent, CardHeader} from '@mui/material';
import {addDays, format, subDays} from 'date-fns';

import CardWithIcon from "./CardWithIcon";
// import {Customer} from '../types';

import {dateFormat} from '@/functions';

const lastDay = new Date();
const lastMonthDays = Array.from({length: 30}, (_, i) => subDays(lastDay, i));
// console.log('lastMonthDays', lastMonthDays);
const aMonthAgo = subDays(new Date(), 30);
const dateFormatter = (date) => {
  // console.log('new Date(date).toLocaleDateString()',dateFormat(new Date(date),'YYYY/MM/DD'));
  return dateFormat(new Date(date),'YYYY/MM/DD');
}

const aggregateOrdersByDay = (order=[]) => {
  // console.log('aggregateOrdersByDay()',order);
  // return order;
  return order.reduce((acc, curr) => {
      // console.log('acc',acc)
      // console.log('curr',curr)
      const day = dateFormat(curr.createdAt, 'YYYY/MM/DD');
      // console.log('day', day);
      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day] += 1;
      // console.log('acc', acc);
      return acc;
    }, {});
}
const getRevenuePerDay = (orders) => {
  // console.log('getRevenuePerDay',orders)
  const daysWithRevenue = aggregateOrdersByDay(orders);
  // console.log('daysWithRevenue', daysWithRevenue);
  return lastMonthDays.map(date => {
    // console.log('data',dateFormat(date));
    return ({
      date: date.getTime(),
      'rxxx': daysWithRevenue[dateFormat(date, 'YYYY/MM/DD')] || 0,
    })
  });
};

const NotifChart = (props) => {
  const translate = useTranslate();
  const classes = useStyles();
  const { title } = props;
  const aMonthAgo = subDays(new Date(), 30);
  aMonthAgo.setDate(aMonthAgo.getDate() - 30);
  aMonthAgo.setHours(0);
  aMonthAgo.setMinutes(0);
  aMonthAgo.setSeconds(0);
  aMonthAgo.setMilliseconds(0);
  // React.useEffect(() => {

    const { isLoading: loaded, data: visitors } = useGetList(props.model,
      {
        pagination: { page: 1, perPage: 100000 }
        // sort: { field: "published_at", order: "DESC" }
      }
    );
  // }, []);

  // console.log('loaded',loaded)
  // console.log('visitors',visitors)

  // if (!loaded) return null;

  const nb = visitors ? visitors.reduce((nb) => ++nb, 0) : 0;
  let all_data=getRevenuePerDay(visitors);
  console.log('all_data',all_data)
  // return JSON.stringify(getRevenuePerDay(visitors))
  return (
    <Card className={'width1000'}>
      <CardHeader title={props.title}/>
      <CardContent>
        <div style={{ height: 300}} className={'order-chart'}>
          <ResponsiveContainer>
            <AreaChart data={all_data}>
              <defs>
                <linearGradient
                  id="colorUv"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#8884d8"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#8884d8"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                label={'روز'}

                name="date"
                type="number"
                scale="time"
                domain={[
                  addDays(aMonthAgo, 1).getTime(),
                  new Date().getTime(),
                ]}
                tickFormatter={dateFormatter}
              />
              <YAxis dataKey="rxxx" name="درآمد" unit="T" label={'rxxx'}

              />
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip
                cursor={{strokeDasharray: '3 3'}}
                formatter={value => {
                  if(value)
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' تومان';
                  else
                    return '0';
                }
                  // new Intl.NumberFormat('fa-IR', {
                  //     style: 'currency',
                  //     currency: 'IRR',
                  // }).format(value)
                  // value
                }
                labelFormatter={(label) =>
                  dateFormatter(label)
                }
              />
              <Area
                type="monotone"
                label={'rxxx'}
                dataKey="rxxx"
                stroke="#8884d8"
                strokeWidth={2}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>

  );
};

const useStyles = makeStyles(theme => ({
  link: {
    borderRadius: 0
  },
  linkContent: {
    color: theme.palette.primary.main
  }
}));

export default NotifChart;
