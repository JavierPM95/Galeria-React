import React, { lazy } from 'react';

const Dashboard = lazy(() => import(/* webpackChunkName: 'Dashboard' */ '../components/Dashboard/Dashboard'));
const MisTickets = lazy(() => import(/* webpackChunkName: 'MisTickets' */ '../components/pages/MisTickets/MisTickets'));

const PrivateRoutes = [
	{
		path: '/dashboard',
		exact: true,
		name: 'Dashboard',
		Component: Dashboard
	},
	{
		path: '/mis-tickets',
		exact: true,
		name: 'Mis Tickets',
		Component: MisTickets
	}
];

export default PrivateRoutes;