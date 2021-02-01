import React, {
	lazy,
	useRef,
	useState,
	Fragment,
	useEffect,
} from 'react';
import ReactNPS from 'nps-sdk-react';
import { useParams, useHistory } from 'react-router-dom';

/* style */
import cx from 'classnames';
import style from './pago.css';

/* components */
const Icon = lazy(() => {
	return import(/* webpackChunkName: 'Icon' */'../../../Icon');
});
const Checkbox = lazy(() => {
	return import(/* webpackChunkName: 'Checkbox' */'../../../Checkbox');
});
const TextInput = lazy(() => {
	return import(/* webpackChunkName: 'TextInput' */'../../../TextInput');
});
const DatePicker = lazy(() => {
	return import(/* webpackChunkName: 'DatePicker' */'../../../DatePicker');
});
const RadioGroup = lazy(() => {
	return import(/* webpackChunkName: 'RadioGroup' */'../../../RadioGroup');
});

/* utils */
import serealizeData from './serealizeData';
import httpClient from '../../../../utils/axios';

const initState = {
	holderName: '',
	numberCard: '',
	securityCode: '',
	expirationDate: '',
	guardarTarjeta: 1
}

const Pago = ({
	clasess,
	resumenDeCompra,
	tarjetasCargadas,
	setResumenDeCompra,
	mediosDePagoValidos,
	componentResumen: ComponentResumen,
}) => {
	const history = useHistory();
	const _resetDate = useRef(null);
	const _refInputDate = useRef(null);
	const [ state, setState ] = useState(initState);
	const [ startPay, setStartPay ] = useState(false);
	const [ tarjetaCargadaValue, setTarjetaCargadaValue ] = useState('');
	const [ formaDePagoValue, setFormaDePagoValue ] = useState('tarjetas-cargadas')

	useEffect(() => {
		if(formaDePagoValue == 'nueva-tarjeta') {
			setTarjetaCargadaValue('')
		}
	}, [formaDePagoValue])

	const handleClickResumen = async (e, action) => {
		setStartPay(true);
		switch (action) {
			case 'volver':
				history.goBack();
				break;
			case 'pagar':
				let dataTarjeta = (formaDePagoValue == 'tarjetas-cargadas') ? {tarjetaCargadaValue} : {...state};
				try {

					let { data } = await httpClient.apiPost('oc',
							serealizeData({
								...dataTarjeta,
								...resumenDeCompra,
								mediosDePagoValidos: mediosDePagoValidos.map((el) => el.codigoNPS)
							})
					);
					if(data.cod == 200) {
						setResumenDeCompra((prevState) => ({...prevState, nro_orden: data.nro_orden}))
						history.push('/comprar/pago-exitoso');
					} else {
						M.toast({
							classes:`black-text yellow`,
							html: data.mensaje
						});
					}
				} catch(e) {
					M.toast({
						classes:`black-text yellow`,
						html: 'Ocurrió un error de red. Por favor vuelva a intentar'
					});
				}
				setStartPay(false);
				break;
		}
	}

	const handleInput = (e) => {
		const nameInput = e.target.name;
		let valueInput = e.target.type !== 'checkbox' ? e.target.value : 
					e.target.checked ? 1 : 0;

		setState((prevState) => {
			const newState = { ...prevState };
			newState[nameInput] = valueInput
			return newState;
		});
	}

	const renderTarjetasCargadas = () => {
		let options = null;
		if(tarjetasCargadas) {
			options = tarjetasCargadas.map((tarjeta) => {
				return {
					label: tarjeta.maskedNumber,
					value: JSON.stringify({
						medioPagoCod: tarjeta.medioPagoCod,
						paymentMethodId: tarjeta.paymentMethodId,
					})
				}
			})
		}
		return(
			<div className="col s12">
			{ (options) ?
				<RadioGroup
					radioClassNames={clasess.radioGroup}
					name="tarjetas-cargadas-radio"
					value={tarjetaCargadaValue}
					onChange={(e) => setTarjetaCargadaValue(e.target.value)}
					options={options}
				/>
				: <p>No tiene tarjetas guardadas</p>
			}
			</div>
		);
	}

	const disabledBotonPagar = () => {
		const empty = (value) => (value && value.trim()) ? false : true;
		for(let i in state) {
			if(i != 'guardarTarjeta' && empty(state[i])){
				return true;
			}
		}
		return false;
	}

	const renderNuevaTarjeta = () => {
		return(
			<Fragment>
				<p className={style.tituloDatos} >Ingrese los datos de la tarjeta</p>
				<TextInput
					s={12}
					type='text'
					name='holderName'
					onChange={handleInput}
					icon={'account_circle'}
					value={state.holderName}
					globalClasses={clasess.inputIcon}
					label='Nombre y Apellido del titular'
				/>

				<TextInput
					s={12}
					type='text'
					name='numberCard'
					icon={'credit_card'}
					onChange={handleInput}
					value={state.numberCard}
					label='Número de tarjeta'
					globalClasses={clasess.inputIcon}
				/>

				<DatePicker
					options={{
						onClose: () => {
							setState((prevState) => ({
								...prevState,
								expirationDate: _refInputDate.current.inputRef.value.split('/').join('')
							}))
						},
						i18n: {},
						format: 'yy/mm'
					}}
					s={12}
					icon={'date_range'}
					refInput={_refInputDate}
					label='Fecha de expiración'
					reset={_resetDate}
					globalClasses={clasess.inputIcon}
				/>

				<TextInput
					s={12}
					type='text'
					name='securityCode'
					icon={'credit_card'}
					onChange={handleInput}
					value={state.securityCode}
					label='Código de seguridad'
					globalClasses={clasess.inputIcon}
				/>
				<Checkbox
					name='guardarTarjeta'
					onChange={handleInput}
					value={state.guardarTarjeta}
					filledIn
					id='checkbox-guardarTarjeta'
					label='Recordar mi tarjeta para futuras compras'
				/>
			</Fragment>
		);
	}

	return(
		<div className={style.contentPagos} >
			<div className={clasess.contentLayout} >
				<section className={clasess.columnLeft} >
					<section className={clasess.subtitulo} >
						<h3>forma de pago</h3>
						<div className='linea-titulo' ></div>
					</section>

					<section>
						<RadioGroup
								radioClassNames={clasess.radioGroup}
								name="radio-forma-de-pago"
								value={formaDePagoValue}
								onChange={(e) => setFormaDePagoValue(e.target.value)}
								options={[
									{
										label: 'Tarjeta crédito / débito cargada',
										value: 'tarjetas-cargadas',
										icon: <Icon className={clasess.icons} >arrow_drop_down</Icon>
									},
									{
										label: 'Nueva tarjeta de crédito / débito',
										value: 'nueva-tarjeta',
										icon: <Icon className={clasess.icons} >arrow_drop_down</Icon>
									}
								]}
							/>
					</section>

					<div className={clasess.divider} ></div>

					<section className={cx('row', style.tarjetasCargadas)} >
					{
						(formaDePagoValue == 'tarjetas-cargadas')
						? renderTarjetasCargadas()
						: renderNuevaTarjeta()
					}
					</section>
				</section>

				<section className={clasess.divider} ></section>

				<section className={style.columnRight} >
					<ComponentResumen
						onClick={handleClickResumen}
						asientos={resumenDeCompra.asientos}
						subtotal={resumenDeCompra.subtotal}
						cargoEnvio={resumenDeCompra.cargoEnvio}
						cargoServicio={resumenDeCompra.cargoServicio}
						estacionamiento={resumenDeCompra.estacionamiento}
						buttonLeft={{
							text: 'Volver',
							action: 'volver',
							disabled: false
						}}
						buttonRight={{
							action: 'pagar',
							text: (startPay) ? 'preloader' : 'Pagar',
							disabled: disabledBotonPagar() && !tarjetaCargadaValue
						}}
					/>
				</section>
			</div>
		</div>
	)
}

export default Pago;