import React, {
	lazy,
	useState,
	Fragment,
	useEffect,
} from 'react';

/* Style */
import cx from 'classnames';
import style from './resumenDeCompra.css';

/* components */
const Preloader = lazy(() => {
	return import(/* webpackChunkName: 'Preloader' */'../../../Preloader');
});

const ResumenDeCompra = ({
	onClick,
	asientos,
	subtotal,
	cargoEnvio,
	buttonLeft,
	buttonRight,
	cargoServicio,
	estacionamiento,
}) => {
	const [ total, setTotal ] = useState(0);
	const intlNumber = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

	const handleClick = (e, action) => {
		onClick(e, action);
	}

	const renderEstacionamiento = () => {
		return( (!estacionamiento.active) ? null :
			<Fragment>
				<span className={style.label}>
					Estacionamiento: {' '}
					<span>{estacionamiento.label}</span>
				</span>
				<span className={style.value} >
					{'$ ' + estacionamiento.value}
				</span>
			</Fragment>
		)
	}

	const sumaTotales = () => {
		let suma = subtotal + cargoServicio;
		suma += (estacionamiento.active) ? parseInt(estacionamiento.value) : 0;
		suma += (cargoEnvio && cargoEnvio.value) ? parseInt(cargoEnvio.value) : 0;
		return suma;
	}

	var asientosOrdenados = [];
	if(!asientos.noNumerados) {
		let
			tmpArr = [],
			filaOrdenArr = [];
		asientos.dataAsientos.forEach((el) => {
			if (!(el.fila in tmpArr)) {
				tmpArr[el.fila] = true
				filaOrdenArr.push(el.fila)
			}
		})

		// Ordenar de manera ascendente las filas
		filaOrdenArr = filaOrdenArr.sort((a,b) => ordenarAsientos(a,b));

		// Ordenar de manera ascendente las butacas
		filaOrdenArr = filaOrdenArr.map((fila) => {
			return asientos.dataAsientos
						.filter((el) => el.fila == fila)
						.sort((a,b) => ordenarAsientos(a,b, 'butaca'));
		})
		filaOrdenArr.forEach((el) => {
			asientosOrdenados.push(...el);
		})
	}

	function ordenarAsientos(a,b, ubicacion) {
		let intA = parseInt((ubicacion) ? a[ubicacion] : a);
		let intB = parseInt((ubicacion) ? b[ubicacion] : b);
		if(intA < intB) {
			return -1;
		} else if(intA > intB) {
			return 1;
		} else {
			return 0;
		}
	}

	return(
		<div className={style.ResumenDeCompra} >
			<h3>resumen de compra</h3>
			<div className='linea-titulo' ></div>
			<p>{ asientos.sectorNombre }</p>
			<ul>
				{ (asientos.noNumerados) ?
					<p>
						{asientos.dataAsientos.length}{' '}
						asiento(s)
					</p> :
					asientosOrdenados.map((asiento, key) => (
						<li key={key} >
							Fila: {asiento.fila} - Butaca: {asiento.butaca}
						</li>
					))
				}
			</ul>
			<div className="divider"></div>
			<section className={style.subTotal} >
				<div>
					<span>subtotal tickets</span>
					<span>{intlNumber.format(subtotal)}</span>
				</div>
				<div>
					<span>+ cargo servicio</span>
					<span>{intlNumber.format(cargoServicio)}</span>
				</div>
			</section>
			{ (!cargoEnvio || cargoEnvio.value === null) ? null :
				<section className={style.otrosServicios} >
					<span>otros servicios</span>
					<span className={style.label}>
						envio: {' '}
						<span>{cargoEnvio.label}</span>
					</span>
					<span className={style.value} >
						{'$ ' + cargoEnvio.value}
					</span>
					{renderEstacionamiento()}
				</section>
			}

			<div className="divider"></div>

			<section className={style.total} >
				<span>total:</span>
				<span>
					{intlNumber.format(sumaTotales())}
				</span>
			</section>

			<section className={style.botones} >
				<button
					className={cx('center', 'btn', style.boton)}
					disabled={buttonLeft.disabled}
					onClick={(e) => handleClick(e, buttonLeft.action)}
				>
					{buttonLeft.text}
				</button>
				<span className='offset'></span>
				{
					(buttonRight.text == 'preloader') ? <Preloader/> :
					<button
						className={cx('center', 'btn', style.boton)}
						disabled={buttonRight.disabled}
						onClick={(e) => handleClick(e, buttonRight.action)}
					>
						{buttonRight.text}
					</button>
				}
			</section>

		</div>
	)
}

export default ResumenDeCompra;