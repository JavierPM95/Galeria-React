import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* style */
import cx from 'classnames';
import style from './avisoCookies.css';

const AvisoCookies = () => {
	const [ aceptoTerminos, setAceptoTerminos ] = useState(false);
	useEffect(() => {
		if(localStorage.getItem('aceptoTerminos') == 'true') {
			setAceptoTerminos(true);
		}
	})
	const handleClick = (e) => {
		setAceptoTerminos(true);
		localStorage.setItem('aceptoTerminos', true);
	}

	return( (aceptoTerminos) ? null :
		<div className={cx(style.avisoCookies)}>
			<span>
			{
				'Este sitio web utiliza cookies, incluidas cookies de terceros, que le'+' '+
				'permiten a TuTicketDeEntrada obtener información sobre su visita al sitio web. Haga'
			}
				<Link onClick={handleClick} to='/politicas-privacidad'> clic aquí </Link>
			{
				'para obtener más información sobre las cookies utilizadas en este sitio'+' '+
				'web y cómo cambiar la configuración actual si no está de acuerdo.'+' '+
				'Al continuar usando este sitio web, usted acepta el uso de cookies.'
			}
			</span>
			<span onClick={handleClick} className={style.aceptar} >
				Estoy de acuerdo / Cerrar
			</span>
		</div>
	);
}

export default AvisoCookies;