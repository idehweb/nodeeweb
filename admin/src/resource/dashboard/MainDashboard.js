import React, { useState } from 'react';
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import { useDataProvider, useTranslate } from 'react-admin';

import Welcome from '@/components/dashboard/Welcome';
import { BASE_URL } from '@/functions/API';
import CustomerChart from '@/components/dashboard/CustomerChart';
import ProductOrdersTable from '@/components/dashboard/ProductOrdersTable';
import EntryFormChart from '@/components/dashboard/EntryFormChart';
import OrderChartDemo from '@/components/dashboard/OrderChartDemo';
import OrderChart from '@/components/dashboard/OrderChart';
import DragDropTest from '@/components/dashboard/base/DragDropTest';

const Spacer = () => <span style={{ width: '1em' }} />;
const VerticalSpacer = () => <span style={{ height: '1em' }} />;
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const data = {
  labels: ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4', 'Thing 5', 'Thing 6'],
  datasets: [
    {
      label: '# of Votes',
      data: [2, 9, 3, 5, 2, 3],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

const styles = {
  flex: { display: 'flex' },
  flexColumn: { display: 'flex', flexDirection: 'column' },
  leftCol: {},
  rightCol: {},
  singleCol: { marginTop: '1em', marginBottom: '1em' },
};

const MainDashboard = () => {
  const [state, setState] = useState({});
  const translate = useTranslate();
  let sOrders = [],
    nbPendingReviews = [],
    dollarPrice = 0,
    pendingReviews = [],
    pendingReviewsCustomers = [];

  const dataProvider = useDataProvider();
  // const isXSmall = useMediaQuery((theme) =>
  //     theme.breakpoints.down('xs')
  // );
  // const isSmall = useMediaQuery((theme) =>
  //     theme.breakpoints.down('md')
  // );
  //
  // const fetchNotifications = useCallback(async () => {
  //     const aMonthAgo = subDays(new Date(), 30);
  //     const {data: recentOrders} = await dataProvider.getList(
  //         'notification',
  //         {
  //             filter: {date_gte: aMonthAgo.toISOString()},
  //             sort: {field: 'date', order: 'DESC'},
  //             pagination: {page: 1, perPage: 10000},
  //         }
  //     );
  //     console.log('recentOrders',recentOrders)
  //     let pendingOrders = [], sOrders = [];
  //     const aggregations = recentOrders
  //         .filter(order => order.status !== 'cancelled')
  //         .reduce(
  //             (stats, order) => {
  //                 // if (order.paymentStatus == 'paid') {
  //                 //     stats.revenue += order.amount;
  //                 //     stats.nbNewOrders++;
  //                 // }
  //                 // if (order.status === 'processing' && order.paymentStatus == 'notpaid') {
  //                 //     pendingOrders.push(order);
  //                 // }
  //                 return stats;
  //             },
  //             {
  //                 revenue: 0,
  //                 nbNewOrders: 0,
  //                 pendingOrders: [],
  //             }
  //         );
  //     recentOrders.map((order) => {
  //         if (order.status === 'processing' && order.paymentStatus == 'notpaid')
  //             pendingOrders.push(order);
  //     });
  //     recentOrders.map((order) => {
  //         if (order.paymentStatus == 'paid')
  //             sOrders.push(order);
  //     });
  //     setState(state => ({
  //       ...state,
  //     }))
  //     //     recentOrders,
  //     //     sOrders,
  //     //     revenue: aggregations.revenue.toLocaleString("fa-IR", {
  //     //         style: 'currency',
  //     //         currency: 'IRR',
  //     //         minimumFractionDigits: 0,
  //     //         maximumFractionDigits: 0,
  //     //     }),
  //     //     nbNewOrders: aggregations.nbNewOrders,
  //     //     pendingOrders: pendingOrders,
  //     // }));
  //     const {data} = await dataProvider.getMany(
  //         'order',
  //         {
  //             ids: aggregations.pendingOrders.map(
  //                 (order) => order.customer_id
  //             ),
  //         }
  //     );
  //     // setState(state => ({
  //     //     ...state,
  //     //     pendingOrdersCustomers: actions
  //     // }));
  // }, [dataProvider]);
  // const fetchOrders = useCallback(async () => {
  //     const aMonthAgo = subDays(new Date(), 30);
  //     const {data: recentOrders} = await dataProvider.getList(
  //         'order',
  //         {
  //             filter: {date_gte: aMonthAgo.toISOString()},
  //             sort: {field: 'date', order: 'DESC'},
  //             pagination: {page: 1, perPage: 10000},
  //         }
  //     );
  //     console.log('recentOrders',recentOrders)
  //     let pendingOrders = [], sOrders = [];
  //     const aggregations = recentOrders
  //         .filter(order => order.status !== 'cancelled')
  //         .reduce(
  //             (stats, order) => {
  //                 if (order.paymentStatus == 'paid') {
  //                     stats.revenue += order.amount;
  //                     stats.nbNewOrders++;
  //                 }
  //                 // if (order.status === 'processing' && order.paymentStatus == 'notpaid') {
  //                 //     pendingOrders.push(order);
  //                 // }
  //                 return stats;
  //             },
  //             {
  //                 revenue: 0,
  //                 nbNewOrders: 0,
  //                 pendingOrders: [],
  //             }
  //         );
  //     recentOrders.map((order) => {
  //         if (order.status === 'processing' && order.paymentStatus == 'notpaid')
  //             pendingOrders.push(order);
  //     });
  //     recentOrders.map((order) => {
  //         if (order.paymentStatus == 'paid')
  //             sOrders.push(order);
  //     });
  //     // setState(state => ({
  //     //     ...state,
  //     //     recentOrders,
  //     //     sOrders,
  //     //     revenue: aggregations.revenue.toLocaleString("fa-IR", {
  //     //         style: 'currency',
  //     //         currency: 'IRR',
  //     //         minimumFractionDigits: 0,
  //     //         maximumFractionDigits: 0,
  //     //     }),
  //     //     nbNewOrders: aggregations.nbNewOrders,
  //     //     pendingOrders: pendingOrders,
  //     // }));
  //     const {data} = await dataProvider.getMany(
  //         'order',
  //         {
  //             ids: aggregations.pendingOrders.map(
  //                 (order) => order.customer_id
  //             ),
  //         }
  //     );
  //     // setState(state => ({
  //     //     ...state,
  //     //     pendingOrdersCustomers: actions
  //     // }));
  // }, [dataProvider]);
  //
  //   const fetchActions = useCallback(async () => {
  //       const aMonthAgo = subDays(new Date(), 30);
  //       const {data} = await dataProvider.getList(
  //           'action',
  //           {
  //               filter: {date_gte: aMonthAgo.toISOString()},
  //               sort: {field: 'date', order: 'DESC'},
  //               pagination: {page: 1, perPage: 50},
  //           }
  //       );
  //
  //       setState(state => ({
  //           ...state,
  //           actions: [{createdAt: '2', title: '', _id: '3'}]
  //       }));
  //   }, [dataProvider]);
  //
  //
  //   useEffect(() => {
  //       fetchOrders();
  // fetchNotifications();
  // fetchDollar();
  // fetchActions();
  // }, []);
  // const isXSmall = useMediaQuery((theme) =>
  //   theme.breakpoints.down('sm')
  // );
  // const isSmall = useMediaQuery((theme) =>
  //   theme.breakpoints.down('lg')
  // );
  // const aMonthAgo = useMemo(() => subDays(startOfDay(new Date()), 30), []);
  // //
  // const { data: orders } = useGetList('order', {
  //   filter: { date_gte: aMonthAgo.toISOString() },
  //   sort: { field: 'date', order: 'DESC' },
  //   pagination: { page: 1, perPage: 50 },
  // });
  // //
  // const aggregation = useMemo(() => {
  //   if (!orders) return {};
  //   const aggregations = orders
  //     .filter(order => order.status !== 'cancelled')
  //     .reduce(
  //       (stats, order) => {
  //         if (order.status !== 'cancelled') {
  //           stats.revenue += order.total;
  //           stats.nbNewOrders++;
  //         }
  //         if (order.status === 'ordered') {
  //           stats.pendingOrders.push(order);
  //         }
  //         return stats;
  //       },
  //       {
  //         revenue: 0,
  //         nbNewOrders: 0,
  //         pendingOrders: [],
  //       }
  //     );
  //   return {
  //     recentOrders: orders,
  //     revenue: aggregations.revenue.toLocaleString(undefined, {
  //       style: 'currency',
  //       currency: 'USD',
  //       minimumFractionDigits: 0,
  //       maximumFractionDigits: 0,
  //     }),
  //     nbNewOrders: aggregations.nbNewOrders,
  //     pendingOrders: aggregations.pendingOrders,
  //   };
  // }, [orders]);

  // const { nbNewOrders, pendingOrders, revenue, recentOrders } = aggregation;
  //   // const {
  //   //     actions,
  //   //     nbNewOrders,
  //   //     nbPendingReviews,
  //   //     pendingOrders,
  //   //     pendingOrdersCustomers,
  //   //     pendingReviews,
  //   //     pendingReviewsCustomers,
  //   //     revenue,
  //   //     recentOrders,
  //   //     sOrders,
  //   //     dollarPrice
  //   // } = state;
  //   console.log('sOrders', sOrders);

  return (
    <>
      <Welcome />
      <div style={styles.flex} className={'flex-wrapp d-block'}>
        <div style={styles.leftCol} className={'leftCol'}>
          <div className={'dwfghrtjy'}>
            {/*<DragDropTest/>*/}
            {/*<OrderChart title={'orders'} model={'order'}/>*/}
            <OrderChartDemo title={'orders'} model={'order'} />
            {/*<CustomerChart title={'customers'} model={'customer'}/>*/}
            <EntryFormChart title={'entryForm'} model={'entry'} />
            <ProductOrdersTable title={'topProductOrders'} model={'order'} />
          </div>
        </div>
        <div style={styles.rightCol} className={'rightCol'}>
          <div className={'dwfghrtjy'}>
            {/*<OrderChart orders={pendingOrders} title={translate('resources.dashboard.countOrdersSuccess30Days')}/>*/}
            {/*<NotifChart title={'notifications'} model={'notification'}/>*/}
          </div>
        </div>
      </div>

      <div style={styles.flex}>
        <div style={styles.leftCol} className={'leftCol'}>
          <div style={styles.flex}>
            {/*<MonthlyRevenue value={revenue} title={translate('resources.dashboard.countAnnLast30Days')}/>*/}
            <Spacer />
            {/*<NbNewOrders value={nbNewOrders} title={translate('resources.dashboard.countPayedLast30Days')}/>*/}
            {/*<NotifChart title={'customer'} model={'customer'}/>*/}
          </div>
          <div style={styles.singleCol}>
            {/*<Actions*/}
            {/*direction={'ltr textAlignLeft'}*/}
            {/*title={translate('resources.dashboard.yourActions')}*/}
            {/*/>*/}
          </div>
        </div>
        <div style={styles.rightCol} className={'rightCol'}>
          <div style={styles.flex}>
            {/*<MonthlyRevenue value={revenue} title={translate('resources.dashboard.countUsers')}/>*/}
            <Spacer />
            {/*<NbNewOrders value={dollarPrice} title={translate('resources.dashboard.dollarPrice')}/>*/}
          </div>

          <div style={styles.singleCol}>
            {/*<PendingReviews*/}
            {/*title={translate('resources.dashboard.orders')}*/}

            {/*nb={nbPendingReviews}*/}
            {/*reviews={pendingReviews}*/}
            {/*customer={pendingReviewsCustomers}*/}
            {/*/>*/}
            <Spacer />
          </div>
        </div>
      </div>
    </>
  );
};
export default MainDashboard;
