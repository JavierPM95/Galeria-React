import React, { 
	lazy,
	Suspense,
	useState,
	useEffect,
} from 'react';
import { Switch, Route } from 'react-router-dom';

/* Style */
import './materialize/sass/materialize.scss';

/* Routes */
import PublicRoutes from './routes/publicRoutes';
import PrivateRoutes from './routes/privateRoutes';

/* Components */
import Loading from './components/Loading/Loading';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import AvisoCookies from './components/AvisoCookies/AvisoCookies';
const Footer = lazy(() => {
	return import(/* webpackChunkName: 'Footer' */'./components/Footer/Footer')
});
const Header = lazy(() => {
	return import(/* webpackChunkName: 'Header' */'./components/Header/Header')
});
const NotFoundPage = lazy(() => {
	return import(/* webpackChunkName: 'NotFoundPage' */'./components/NotFoundPage/NotFoundPage')
});

/* context */
import connect from './context/connect';

/* Actions */
import { verifySession } from './actions/loginAction';

/* CustomHooks */
import { useMobileDetector } from './components/customHooks/';

function App({ isLogin, verifySession }) {

	const mobileActive = useMobileDetector();
	const [isVerifySession, setIsVerifySession] = useState(true);

	useEffect(() => {
		(async () => {
			await verifySession();
			setIsVerifySession(false);
		})();
	}, []);

	const _publicRoutes = PublicRoutes.map((route, index) => {
		let {
			name,
			path,
			exact,
			subMenu,
			Component,
			restricted,
		} = route;

		return (Component) ? (
			<PublicRoute
				name={name}
				key={index}
				path={path}
				exact={exact}
				isLogin={isLogin}
				subMenu={subMenu}
				component={Component}
				restricted={restricted}
			/>
		) : (null);
	});

	const _privateRoutes = PrivateRoutes.map((route, index) => {
		let {
			path,
			exact,
			name,
			Component,
		} = route;

		return (Component) ? (
			<PrivateRoute
				key={index}
				path={path}
				name={name}
				exact={exact}
				isLogin={isLogin}
				component={Component}
			/>
		) : (null);
	});


	return ((isVerifySession) ? <Loading/> :
		<Suspense fallback={<Loading/>}>
			<Header
				mobileActive={mobileActive}
			/>
			<Switch>
				{_publicRoutes}
				{_privateRoutes}
				<Route path='*' component={NotFoundPage} />
			</Switch>
			<Footer/>
			<AvisoCookies/>
		</Suspense>
	)
}

const mapStateToProps = (store) => ({
	isLogin: store.login.isLogin
});

const mapDispathToProps = (dispath) => ({
	verifySession: () => verifySession(dispath)
});

export default connect(mapStateToProps, mapDispathToProps)(App);