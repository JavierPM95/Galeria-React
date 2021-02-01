import React from 'react';

/* config */
import { ASSETS_URL } from '../../../config.js';

/* Style */
import style from './metodosDePago.css';
import cx from 'classnames';

const MetodosDePago = ({metodos, ...props}) => {
	return(
		<div className={style.contentMetodosDePago} >
			<h2>Métodos de pago</h2>
			<div className='linea-titulo' ></div>
			{
				metodos.map((el, index) => (
					<img key={index} src={ASSETS_URL+el.imagenUrl} alt=""/>
				))
			}
		</div>
	)
};

export default MetodosDePago;