import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({component: Component, restricted, isLogin, subMenu, ...rest}) => {
	return (
		// Will not show the component when the user is logged in and 'restricted' is true
		// Otherwise, show the component
		<Route {...rest} render={props => (
			isLogin && restricted ?
				<Redirect to="/" />
			: <Component {...props} subMenu={subMenu} />
		)} />
	);
};

export default PublicRoute;