import React from 'react';

/* Style */
import style from './AsientoElegido.css';
import cx from 'classnames';


const AsientoElegido = ({ evento, sector, asiento, handleClose }) => {

	return(
		<div className={style.muestraTicket}>
			<div
				className={style.ticketClose}
				onClick={() => handleClose(asiento.id)}
			>
				x
			</div>

			<div className={style.ticketDataRow}>
				<div>
					<div>Sec</div>
					<div>{ asiento.sector }</div>
				</div>
				<div>
					<div>Fila</div>
					<div>{ asiento.fila }</div>
				</div>
				<div>
					<div>Butaca</div>
					<div>{ asiento.butaca }</div>
				</div>
			</div>

			<div className={style.tickerDataRow}>
				<div className={style.ticketPrecioLabel}>Precio:</div>
				<div className={style.ticketPrecioData}>
					{asiento.valorNeto}
				</div>
			</div>
		</div>
	)
}


export default AsientoElegido;