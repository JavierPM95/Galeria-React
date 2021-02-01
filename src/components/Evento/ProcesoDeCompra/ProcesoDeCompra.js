import React, {
	lazy,
	useRef,
	Suspense,
	Fragment,
	useState,
	useEffect,
} from 'react';
import slugify from 'slugify';
import { useParams, useHistory } from "react-router-dom";

/* constans */
import { BUYING } from '../../../constants';

/* utils */
import { restaAbs } from '../../../utils/';

/* Actions */
import { resetEvento, buyTicket } from '../../../actions/eventoAction';

/* components */
import Loading from '../../Loading/Loading';
const Pago = lazy(() => {
	return import(/* webpackChunkName: 'Pago' */'./Pago/Pago')
});
const Asientos = lazy(() => {
	return import(/* webpackChunkName: 'Asientos' */'./Asientos/Asientos')
});
const PagoExitoso = lazy(() => {
	return import(/* webpackChunkName: 'PagoExitoso' */'./PagoExitoso/PagoExitoso')
});
const TipoDeEnvio = lazy(() => {
	return import(/* webpackChunkName: 'TipoDeEnvio' */'./TipoDeEnvio/TipoDeEnvio')
});
const Temporizador = lazy(() => {
	return import(/* webpackChunkName: 'Temporizador' */'../../Temporizador/Temporizador')
});
const ResumenDeCompra = lazy(() => {
	return import(/* webpackChunkName: 'ResumenDeCompra' */'./ResumenDeCompra/ResumenDeCompra')
});

/* Style */
import cx from 'classnames';
import style from './procesoDeCompra.css';
const clasessGlobales = {
	icons: style.icons,
	divider: style.divider,
	inputIcon: style.inputIcon,
	subtitulo: style.subtitulo,
	radioGroup: style.radioGroup,
	columnLeft: style.columnLeft,
	contentLayout: style.contentLayout,
}

/* utils */
import httpClient from '../../../utils/axios';

/* connect */
import connect from '../../../context/connect';

const ProcesoDeCompra = ({ evento, resetEvento, user, buying, buyTicket }) => {
	const { step } = useParams();
	const history = useHistory();
	const _refTimeLeftPago = useRef(evento.tiempoPago);
	const _refTimeLeftEnvio = useRef(evento.tiempoFormaEnvio);
	const [ _resumenDeCompra, setResumenDeCompra ] = useState(null);
	const [ tarjetasCargadas, setTarjetasCargadas ] = useState(null);
	const [ datosUsuarioCargado, setDatosUsuarioCargado ] = useState(false);

	/*
	 * Estados del flujo del proceso de compra (asientos => tipo de envio => pago)
	 * para determinar si se a respetado el flujo, se está ingresando directamente
	 * desde una url o se a refrescado la página (f5)
	*/
	const [ recuperandoOCT, setRecuperandoOCT ] = useState(false);
	const [ stepPagoActivo, setStepPagoActivo ] = useState(false);
	const [ stepTipoEnvioActivo, setStepTipoEnvioActivo ] = useState(false);

	useEffect(() => {
		buying();

		if(evento.isEmpty) {
			const eventoTMP = sessionStorage.getItem('evento');

			// Si no hay evento almacenado en el sessionStorage redirigir al home
			if(!eventoTMP) {
				buyTicket(null, {});
				history.replace('/');
			} else {
				buyTicket(null, JSON.parse(eventoTMP));
			}
		} else {
			sessionStorage.setItem('evento', JSON.stringify(evento));

			setResumenDeCompra((prevState) => ({
				...prevState,
				eventoId: evento.id,
				funcionId: evento.fechaSeleccionada.funcionId,
			}))
		}

		return () => {
			resetEvento()
		}
	}, [])

	useEffect(() => {
		// Asegurar cargar el tiempo de temporizador
		// Si se refresca la página (f5)
		_refTimeLeftPago.current = evento.tiempoPago;
		_refTimeLeftEnvio.current = evento. tiempoFormaEnvio;
	}, [ evento ])

	useEffect(() => {
		if(step == 'tipo-envio') {
			if(user && !datosUsuarioCargado) {
				httpClient.apiGet(`cliente/tarjetas/${user.id}`)
				.then(({ data }) => {
					setTarjetasCargadas(data);
					/*
					 * Evitar hacer multiples llamadas
					 * si ya recuperamos los datos del usuario
					 */
					setDatosUsuarioCargado(true);

					setResumenDeCompra((prevState) => ({
						...prevState,
						clienteId: user.id,
					}))
				})
			}

			/*
			 * Si se ingresa directamente desde la url
			 * o se a refrescado la página (F5)
			*/
			if(!stepTipoEnvioActivo) {
				if(!user) {
					history.replace('/comprar/asientos');
				} else {
					if(!recuperandoOCT) {
						setRecuperandoOCT(true);
						recuperarOCT();
					}
				}
			}
		}

		if(step == 'pago') {
			if(!stepPagoActivo) {
				history.replace('/comprar/tipo-envio');
			}
		}

	}, [step, recuperandoOCT])

	const recuperarOCT = async () => {
		const octResponse = await httpClient.apiGet(`oct/${user.id}`);
		const oct = octResponse.data;

		if(oct.cod == 202) {
			let descuentoResponse = await httpClient.apiGet(`promo-descuento/${oct.promoId}`);
			let descuento = (descuentoResponse.data || 0) / 100;
			let valorNeto = oct.valorNeto;
			let valorNetoConDescuento = valorNeto - (valorNeto * descuento);

			setResumenDeCompra((prevState) => {
				return {
					...prevState,
					promoId: oct.promoId,
					eventoId: oct.eventoId,
					sectorId: oct.sectorId,
					funcionId: oct.funcionId,
					asientos: {
						cargoTTDE: oct.cargoTTDE,
						noNumerados: oct.noNumerados,
						sectorNombre: oct.sectorNombre,
						dataAsientos: oct.dataAsientos,
						valorNeto: valorNetoConDescuento,
					},
					ordenDeCompraId: oct.ordenDeCompraId,
				}
			})
			_refTimeLeftPago.current = oct.tiempoRestantePago;
			_refTimeLeftEnvio.current = oct.tiempoRestanteTipoEnvio;
			setStepPagoActivo(true);
			setStepTipoEnvioActivo(true);
		} else if(oct.cod == 205) {
			// La orden de compra supero el limite de tiempo
			httpClient.apiGet(`oct/eliminar/${oct.ordenDeCompraId}`);
			volverAlEvento();
		} else {
			history.replace('/comprar/asientos');
		}
	}

	const callbackTimer = () => {
		/* Eliminar la OCT y redirigir al usuario */
		eliminarOct();
		M.toast({
			displayLength: 7000,
			classes:`black-text yellow`,
			html: 'El tiempo se a termiando, debe volver a elegir los asientos',
		});
		volverAlEvento();
	}

	const eliminarOct = () => {
		/* Eliminar la orden de compra temporal */
		httpClient.apiGet(`oct/eliminar/${_resumenDeCompra.ordenDeCompraId}`);
	}

	const volverAlEvento = () => {
		history.replace(`/evento/${evento.id}/${slugify(evento.tituloEvento)}`);
	}

	const renderSwitch = () => {
		if(evento.isEmpty) return null;
		switch (step) {
			case 'asientos':
				return (
					<Fragment>
						<Asientos
							evento={evento}
							clasess={clasessGlobales}
							volverAlEvento={volverAlEvento}
							setResumenDeCompra={setResumenDeCompra}
							setStepTipoEnvioActivo={setStepTipoEnvioActivo}
						/>
					</Fragment>
				);
				break;
			case 'tipo-envio':
				return (!stepTipoEnvioActivo) ? <Loading/> :
					<Fragment>
						<div className={style.header} >
							<h2>finalización de compra</h2>
							<Temporizador
								refTimeLeft={_refTimeLeftEnvio}
								key={2} seg={_refTimeLeftEnvio.current}
								timeEnd={() => callbackTimer()}
							/>
						</div>
						<TipoDeEnvio
							user={user}
							evento={evento}
							clasess={clasessGlobales}
							eliminarOct={eliminarOct}
							volverAlEvento={volverAlEvento}
							componentResumen={ResumenDeCompra}
							resumenDeCompra={_resumenDeCompra}
							setStepPagoActivo={setStepPagoActivo}
							setResumenDeCompra={setResumenDeCompra}
						/>
					</Fragment>
				break;
			case 'pago':
				return (!stepPagoActivo) ? <Loading/> :
					<Fragment>
						<div className={style.header} >
							<h2>finalización de compra</h2>
							<Temporizador
								refTimeLeft={_refTimeLeftPago}
								timeEnd={() => callbackTimer()}
								key={3} seg={_refTimeLeftPago.current}
							/>
						</div>
						<Pago
							clasess={clasessGlobales}
							resumenDeCompra={_resumenDeCompra}
							componentResumen={ResumenDeCompra}
							tarjetasCargadas={tarjetasCargadas}
							setResumenDeCompra={setResumenDeCompra}
							mediosDePagoValidos={evento.mediosDePago}
						/>
					</Fragment>
			case 'pago-exitoso':
				if(!stepPagoActivo) history.replace('/comprar/asientos');
				return(
					<Fragment>
						<div className={style.header} >
							<h2>Confirmación de compra</h2>
						</div>
						<PagoExitoso
							volverAlEvento={volverAlEvento}
							resumenDeCompra={_resumenDeCompra}
						/>
					</Fragment>
				)
			default:
				return null;
		}
	}

	return(
		<Suspense fallback={<Loading/>}>
			<div
				className={cx(style.pdc, {[`${style.pdcMapa}`]: step == 'asientos'})}>
				{ renderSwitch() }
			</div>
		</Suspense>
	)
}

const mapStateToProps = (store) => ({
	evento: store.evento,
	user: store.login.user,
})

const mapDispatchToProps = (dispatch) => ({
	buying: () => dispatch({type: BUYING}),
	resetEvento: () => dispatch(resetEvento()),
	buyTicket: (data, session) => dispatch(buyTicket(data, session)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProcesoDeCompra);
