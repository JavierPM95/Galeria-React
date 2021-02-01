import React from 'react';
import { useLocation, NavLink, Link } from 'react-router-dom';

/* Style */
import './footer.scss';

const Footer = () => {
	const location = useLocation();
	// No mostrar el footer en la selección de asientos (Mapa)
	return( (location.pathname == '/comprar/asientos') ? null :
		<footer>
		<div className="logo">
			<Link to='/'>
				<img src="/img/ttde-logo-black.png" alt=""/>
			</Link>
		</div>
			<div className="links">
				<NavLink to='/ayuda' > Ayuda </NavLink>
				<NavLink to='/puntos-de-venta' > · Puntos de venta </NavLink>
				<NavLink to='/beneficios' > · Beneficios </NavLink>
				<NavLink to='/productores' > · Productores y recintos </NavLink>
				<NavLink to='/terminos-condiciones' >· Términos y condiciones </NavLink>
				<NavLink to='/politicas-privacidad' >· Políticas de privacidad</NavLink>
				<a href="#" title="Call center 0800-000-0000">· Call center 0800-000-0000</a>
				<NavLink to='/empresa' > · La compañía </NavLink>
				<NavLink to="/uso-de-marca">· Uso de marca</NavLink>
				<NavLink to='/copyright' > · Copyright 2020 </NavLink>
			</div>
			<div className="tuticket-link">
				<a target='_blank' href="http://ttde2.ttde.com.ar:8090/dev/sis/LoginUsuario/" className="btn">Ingreso Productores</a>
			</div>
		</footer>
	)
}

export default Footer;