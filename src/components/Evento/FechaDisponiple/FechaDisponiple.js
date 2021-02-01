import React, {
	useEffect,
	useState
} from 'react';

/* style */
import cx from 'classnames';
import style from './fechaDisponiple.css';

const FechaDisponiple = ({
	data,
	colorTexto,
	colorOcupado,
	nombreRecinto,
	colorDisponible,
	capacidadEvento,
	handleBuyTicket,
}) => {
	const styleBtn = {
		color: colorTexto,
		background: colorDisponible,
	}
	const bgOcupado = {
		background: colorOcupado || 'red',
		width: (capacidadEvento) ? `${(data.totalOcupado / capacidadEvento * 100)}%` : '100%'
	}
	const disabled = (data.totalOcupado >= capacidadEvento);

	return(
		<div className={style.fechaDisponiple}>
			<div className={style.dayAndMonthBox} >
				<span className={style.day} >{data.diaNumero}</span>
				<span className={style.month} >{data.mesTextoCorto}</span>
			</div>

			<div className={style.boxInfo} >
				<h3>{`${data.diaTexto} ${data.diaNumero} de ${data.mesTextoCompleto} - ${data.hora}hs `}</h3>
				<p>{nombreRecinto}</p>
				<button
						style={styleBtn}
						disabled={disabled}
						onClick={() => handleBuyTicket(data)}
						className={cx('btn', 'btn-primary', 'right', style.btnComprar)}
					>
						<span className={style.bgOcupado} style={bgOcupado} ></span>
						<span className={style.labelBtn} >
							{(disabled) ? 'Agotado' : 'Comprar'}
						</span>
					</button>
			</div>
		</div>
	)
};

export default FechaDisponiple;