import React from 'react';
import { useHistory } from "react-router-dom";
/* style */
import cx from 'classnames';
import style from './pagoExitoso.css';

const PagoExitoso = ({ volverAlEvento, resumenDeCompra }) => {
	const history = useHistory();
	return(
		<div className={style.content} >
			<h3>transacción exitosa</h3>
			<img src="/img/check.png" alt=""/>
			<p>¡Felicitaciones ya tienes <br/> <span>tu ticket de entrada!</span></p>
			{ resumenDeCompra.nro_orden &&
				<p>Orden de Compra: {resumenDeCompra.nro_orden} </p>
			}
			<section className={style.botonera} >
				<button
						className={cx('center', 'btn', style.botonIr, style.boton)}
						onClick={(e) => history.push('/mis-tickets')}
					>
						Ir a mis compras
					</button>
				<button
						className={cx('center', 'btn', style.botonSeguir, style.boton)}
						onClick={() => history.replace('/')}
					>
						Seguir comprando
					</button>
			</section>
		</div>
	)
}

export default PagoExitoso;