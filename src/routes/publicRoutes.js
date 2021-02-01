import React, { lazy } from 'react';

const Portal = lazy(() => import(/* webpackChunkName: 'Portal' */ '../components/Portal/Portal'));
const Evento = lazy(() => import(/* webpackChunkName: 'Evento' */ '../components/Evento/Evento'));
const Ayuda = lazy(() => import(/* webpackChunkName: 'Ayuda' */ '../components/pages/Ayuda/Ayuda'));
const Empresa = lazy(() => import(/* webpackChunkName: 'Empresa' */ '../components/pages/Empresa/Empresa'));
const ConfirmEmail = lazy(() => import(/* webpackChunkName: 'ConfirmEmail' */ '../components/ConfirmEmail'));
const Categorias = lazy(() => import(/* webpackChunkName: 'Categorias' */ '../components/Categorias/Categorias'));
const Copyright = lazy(() => import(/* webpackChunkName: 'Copyright' */ '../components/pages/Copyright/Copyright'));
const UsoDeMarca = lazy(() => import(/* webpackChunkName: 'UsoDeMarca' */ '../components/pages/UsoDeMarca/UsoDeMarca'));
const Beneficios = lazy(() => import(/* webpackChunkName: 'Beneficios' */ '../components/pages/Beneficios/Beneficios'));
const Productores = lazy(() => import(/* webpackChunkName: 'Productores' */ '../components/pages/Productores/Productores'));
const PuntosDeVenta = lazy(() => import(/* webpackChunkName: 'PuntosDeVenta' */ '../components/pages/PuntosDeVenta/PuntosDeVenta'));
const ProcesoDeCompra = lazy(() => import(/* webpackChunkName: 'ProcesoDeCompra' */ '../components/Evento/ProcesoDeCompra/ProcesoDeCompra'));
const TerminosCondiciones = lazy(() => import(/* webpackChunkName: 'TerminosCondiciones' */ '../components/pages/TerminosCondiciones/TerminosCondiciones'));
const PoliticasPrivacidad = lazy(() => import(/* webpackChunkName: 'PoliticasPrivacidad' */ '../components/pages/PoliticasPrivacidad/PoliticasPrivacidad'));

const PublicRoutes = [
	{
		path: '/',
		exact: true,
		name: 'Portal',
		restricted: false,
		Component: Portal
	},
	{
		path: '/evento/:id/:slug',
		exact: true,
		name: 'Evento',
		restricted: false,
		Component: Evento
	},
	{
		path: '/comprar/:step',
		exact: true,
		name: 'Proceso de compra',
		restricted: false,
		Component: ProcesoDeCompra
	},
	{
		path: '/categoria/:categoria(musica|teatro|cine|familia|especiales)',
		exact: true,
		name: 'Musica',
		restricted: false,
		Component: Categorias
	},
	{
		path: '/confirmarcion/:hash',
		exact: true,
		name: 'ConfirmEmail',
		restricted: false,
		Component: ConfirmEmail
	},
	{
		path: '/ayuda',
		exact: true,
		name: 'Ayuda',
		restricted: false,
		Component: Ayuda
	},
	{
		path: '/puntos-de-venta',
		exact: true,
		name: 'PuntosDeVenta',
		restricted: false,
		Component: PuntosDeVenta
	},
	{
		path: '/beneficios',
		exact: true,
		name: 'Beneficios',
		restricted: false,
		Component: Beneficios
	},
	{
		path: '/productores',
		exact: true,
		name: 'Productores',
		restricted: false,
		Component: Productores
	},
	{
		path: '/terminos-condiciones',
		exact: true,
		name: 'TerminosCondiciones',
		restricted: false,
		Component: TerminosCondiciones
	},
	{
		path: '/politicas-privacidad',
		exact: true,
		name: 'PoliticasPrivacidad',
		restricted: false,
		Component: PoliticasPrivacidad
	},
	{
		path: '/empresa',
		exact: true,
		name: 'Empresa',
		restricted: false,
		Component: Empresa
	},
	{
		path: '/Uso-de-marca',
		exact: true,
		name: 'UsoDeMarca',
		restricted: false,
		Component: UsoDeMarca
	},
	{
		path: '/copyright',
		exact: true,
		name: 'Copyright',
		restricted: false,
		Component: Copyright
	}
];

export default PublicRoutes;