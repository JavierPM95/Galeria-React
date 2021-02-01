import React, {
	lazy,
	useState,
	Fragment,
	useEffect,
} from 'react';
import { useParams, useHistory } from "react-router-dom";

/* CustomHooks */
import { useMobileDetector } from './../../../customHooks/';

/* components */
const Icon = lazy(() => {
	return import(/* webpackChunkName: 'Icon' */'../../../Icon')
});
const Select = lazy(() => {
	return import(/* webpackChunkName: 'Select' */'../../../Select')
});
const TextInput = lazy(() => {
	return import(/* webpackChunkName: 'TextInput' */'../../../TextInput')
});
const RadioGroup = lazy(() => {
	return import(/* webpackChunkName: 'RadioGroup' */'../../../RadioGroup')
});

/* Style */
import cx from 'classnames';
import style from './tipoDeEnvio.css';

/* utils */
import paises from '../../../../utils/paises';
import httpClient from '../../../../utils/axios';

const TipoDeEnvio = ({
	user,
	evento,
	clasess,
	eliminarOct,
	volverAlEvento,
	resumenDeCompra,
	setStepPagoActivo,
	setResumenDeCompra,
	componentResumen: ComponentResumen,
}) => {
	const history = useHistory();
	const [ zonas, setZonas ] = useState([]);
	const breakpoint = useMobileDetector(1024);
	const [ pdvValue, setPdvValue ] = useState('');
	const [ subtipos, setSubtipos ] = useState([]);
	const [ zonaValue, setZonaValue ] = useState('');
	const [ provincias, setProvincias ] = useState([]);
	const [ sucursales, setSucursales ] = useState([]);
	const [ paisEnvio, setPaisEnvio ] = useState('ARG');
	const [ cargoEnvio, setCargoEnvio ] = useState(null);
	const [ localidades, setLocalidades ] = useState([]);
	const [ subtipoValue, setSubtipoValue ] = useState('');
	const [ sucursalValue, setSucursalValue ] = useState('');
	const [ tipoEnvioValue, setTipoEnvioValue ] = useState('');
	const [ provinciaValue, setProvinciaValue ] = useState('');
	const [ localidadValue, setLocalidadValue ] = useState('');
	const [ tipoEnvioGroup, setTipoEnvioGroup ] = useState(null);
	const [ direccionValida, setDireccionValida ] = useState(false);
	const [ tipoEnvioOptions, setTipoEnvioOptions ] = useState(null);
	const [ envioMiDireccion, setEnvioMiDireccion ] = useState('midir');
	const [ direccionRequerida, setDireccionRequerida ] = useState(false);
	const [ estacionamientoValue, setEstacionamientoValue ] = useState('0');
	const hayEstacionamiento = evento.fechaSeleccionada.estacionamiento != null;
	const [ stateDireccion, setStateDireccion ] = useState({
		dpto: '',
		piso: '',
		calle: '',
		calleNro: '',
		codpostal: '',
		dirOtroPais: '',
	})
	const [ estacionamiento, setEstacionamiento ] = useState({});

	useEffect(() => {
		httpClient.apiGet(`tipo-envio/${evento.id}`)
		.then(({ data }) => {
			setTipoEnvioValue(data[0].value);

			setTipoEnvioGroup(data.map((el) => {
				switch (el.clase) {
					case 'ETICKET':
					case 'BOLETERIA':
						break; // No mostrar el icono de más opciones
					default:
						el.icon = <Icon className={clasess.icons} >arrow_drop_down</Icon>;
						break;
				}
				return el;
			}))

			setTipoEnvioOptions((prevState) => {
				const newState = {};
				data.forEach((el) => {
					if(el.options) {
						el.options = el.options.map((el, key) => {
							el.label = (
								<div key={key} className={style.labelPDV} >
									<span>{el.label}</span>
									<span>{el.direccion}</span>
								</div>
							)
							return el;
						})
					}
					newState[`${el.value}`] = {
						tipo: el.tipo,
						clase: el.clase,
						label: el.label,
						data: el.options || null,
						cargoEnvio: el.cargoEnvio
					}
				})
				return newState;
			})
		})

		// Setear los totales para el resumen de compra
		setResumenDeCompra((prevState) => ({
			...prevState,
			subtotal: prevState.asientos.valorNeto * prevState.asientos.dataAsientos.length,
			cargoServicio: prevState.asientos.cargoTTDE * prevState.asientos.dataAsientos.length,
		}))

		setEstacionamiento((prevState) => {
			const newState = {active: false};
			if(hayEstacionamiento) {
				let data;
				const noEstacionar = {label: 'NO', value: '0'};
				const estacionamiento = evento.fechaSeleccionada.estacionamiento;
				if(estacionamiento.length == 1) {
					data = [
										noEstacionar,
										{ label: 'SI', value: estacionamiento[0].value },
								];
				} else {
					data = [ noEstacionar, ...estacionamiento];
				}
				newState.data = data;
			}
			return newState;
		})
	}, [])

	useEffect(() => {
		setEstacionamiento((prevState) => {
			const newState = {...prevState};
			newState.value = estacionamientoValue;
			newState.label = (estacionamientoValue == '0') ? 'NO' :
							newState.data.find((el) => el.value == estacionamientoValue).label;
			return newState;
		})
	}, [estacionamientoValue])

	useEffect(() => {
		setResumenDeCompra((prevState) => ({
			...prevState,
			puntoVenta: pdvValue,
			cargoEnvio: cargoEnvio,
			sucursalCorreo: sucursalValue,
			estacionamiento: estacionamiento,
		}))
	}, [cargoEnvio, estacionamiento, pdvValue, sucursalValue])

	useEffect(() => {
		/*
		 * Es requerido resetaer las diferentes posibilidades de opciones
		 * secundarias al cambiar el tipo de envío para evitar inconsistencias
		 * en el cargo de envío en el resumen de compra
		 */
		setSubtipos([]);
		setSubtipoValue('');
		setZonas([]);
		setZonaValue('');

		if(tipoEnvioOptions) {
			const clase = tipoEnvioOptions[tipoEnvioValue].clase;
			if(clase == 'CORREO') {
				httpClient.apiGet('provincias-evento', {
					params: {
						evento: evento.id,
						tipo: tipoEnvioOptions[tipoEnvioValue].tipo
					}
				})
				.then(({ data }) => {
					setProvincias((data) ? data : []);
				});
			}

			if(['OTROS', 'CORREODOM'].includes(clase)) {
				httpClient.apiGet('provincias').then(({ data }) => {
					setProvincias(data);
				});
			}

			if(['CORREODOM', 'OTROS'].includes(clase)) {
				httpClient.apiGet('subtipos', {
					params: {
						evento: evento.id,
						tipo: tipoEnvioOptions[tipoEnvioValue].tipo
					}
				})
				.then(({ data }) => {
					if(!data.length) {
						// No hay subtipos definidos, el precio es tomado del tipo de envío
						setCargoEnvio((prevState) => {
							return {
								...prevState,
								value: tipoEnvioOptions[tipoEnvioValue].cargoEnvio
							}
						})
					}
					setSubtipos(data);
				})
			}

			// determinar si se debe exigir que complete la dirección de envío
			setDireccionRequerida(
				!['BOLETERIA', 'ETICKET', 'PDV', 'CORREO'].includes(clase)
			)

			// Seteo del cargo de envío
			switch (tipoEnvioOptions[tipoEnvioValue].clase) {
				case 'ETICKET':
				case 'BOLETERIA':
					setCargoEnvio({
						label: tipoEnvioOptions[tipoEnvioValue].label,
						value: tipoEnvioOptions[tipoEnvioValue].cargoEnvio
					})
					break;
				default:
				/*
				 * Se setea el tipo de envío seleccionado (label) y se deja el value en null
				 * debido a que el cargo de envío se calcula a partir de las sub opciones
				 * [sucursal | subtipo | zona ]
				 * 
				 */
					setCargoEnvio({
						label: tipoEnvioOptions[tipoEnvioValue].label,
						value: null
					})
			}
		}
	}, [tipoEnvioValue, tipoEnvioOptions])

	useEffect(() => {
		if(direccionRequerida) {
			// evaluar si existe una dirección valida
			let valid;
			const empty = (value) => (value && value.trim()) ? false : true;
			const { dpto, piso, calle, calleNro, codpostal, dirOtroPais } = stateDireccion;

			if(envioMiDireccion == 'midir') {
				valid = !empty(user.domicilio);
			} else if(paisEnvio == 'ARG') {
				valid = (
					empty(dpto) || empty(piso) || empty(calle) || empty(calleNro) ||
					empty(codpostal) || empty(provinciaValue) || empty(localidadValue)
				) ? false : true;
			} else {
				valid = !empty(dirOtroPais);
			}

			setDireccionValida(valid);
		} else {
			setDireccionValida(false);
		}
	}, [
		user,
		paisEnvio,
		stateDireccion,
		provinciaValue,
		localidadValue,
		envioMiDireccion,
		direccionRequerida,
	])

	useEffect(() => {
		setZonaValue('');
		if(subtipoValue) {
			httpClient.apiGet('zonas', {
				params: {
					evento: evento.id,
					subtipo: subtipoValue,
					tipo: tipoEnvioOptions[tipoEnvioValue].tipo,
				}
			})
			.then(({ data }) => {
				if(!data.length) {
					// No hay zonas definidas, el precio es tomado del subtipo
					setCargoEnvio((prevState) => {
						return {
							...prevState,
							value: subtipos.find((el) => el.subTipo == subtipoValue).cargoEnvio
						}
					})
				}
				setZonas((data) ? data : []);
			})
		}
	}, [subtipoValue])

	useEffect(() => {
		setLocalidadValue('');
		setLocalidades([]);
		if(provinciaValue) {
			const clase = tipoEnvioOptions[tipoEnvioValue].clase;
			const url = (['OTROS', 'CORREODOM'].includes(clase)) ?
									'localidades' : 'localidades-evento';

			httpClient.apiGet(url, {
				params: {
					evento: evento.id,
					provinciaCod: provinciaValue,
					tipo: tipoEnvioOptions[tipoEnvioValue].tipo,
				}
			})
			.then(({ data }) => {
				setLocalidades((data) ? data : []);
			})
		}
	}, [provinciaValue, tipoEnvioValue])

	useEffect(() => {
		setSucursalValue('');
		setSucursales([]);
		if(localidadValue) {
			httpClient.apiGet('sucursales', {
				params: {
					evento: evento.id,
					provinciaCod: provinciaValue,
					localidadCod: localidadValue,
					tipo: tipoEnvioOptions[tipoEnvioValue].tipo,
				}
			})
			.then(({ data }) => {
				setSucursales((data) ? data : []);
			})
		}
	}, [localidadValue, provinciaValue, tipoEnvioValue])

	useEffect(() => {
		setCargoEnvio((prevState) => {
			let newState = { ...prevState };
			if(sucursalValue) {
				newState.value = sucursales.find((el) => el.sucursalCod == sucursalValue).cargoEnvio
			} else if (zonaValue) {
				newState.value = zonas.find((el) => el.zona == zonaValue).cargoEnvio
			} else if(pdvValue) {
				const pdv = tipoEnvioGroup.find((el) => el.tipo === 'PDV');
				newState.value = pdv.options.find((el) => el.value === pdvValue).cargoEnvio
			}
			return newState;
		})
	}, [sucursalValue, zonaValue, pdvValue])

	const handleClickResumen = (e, action) => {
		setEstacionamiento((prevState) => {
			const newState = { ...prevState };
			switch (action) {
				case 'continuar':
					newState.active = true;
					break;
				case 'volver':
					if(!prevState.active) {
						let eliminar = window.confirm('Perderas tu reserva temporal ¿estás seguro?');
						if(eliminar) {
							eliminarOct();
							history.goBack();
						}
					}
					newState.active = false
					break;
				case 'pagar':
					let dir = null;
					if(direccionRequerida) {
						if(envioMiDireccion == 'midir') {
							dir = user.domicilio;
						} else if(paisEnvio == 'ARG') {
							dir  = `calle: ${stateDireccion.calle}`;
							dir += ` - N°: ${stateDireccion.calleNro}`;
							dir += ` - Piso: ${stateDireccion.piso}`;
							dir += ` - Departamento: ${stateDireccion.dpto}`;
							dir += ` - Código Postal: ${stateDireccion.codpostal}`;
						} else {
							dir = stateDireccion.dirOtroPais;
						}
					}
					setResumenDeCompra((prevState) => ({
						...prevState,
						direccion: dir,
						zonaEnvio: zonaValue,
						subtipoEnvio: subtipoValue,
						tipoEnvio: tipoEnvioOptions[tipoEnvioValue].tipo,
						claseEnvio: tipoEnvioOptions[tipoEnvioValue].clase,
					}))
					setStepPagoActivo(true);
					history.push('/comprar/pago');
					break;
			}
			return newState;
		});
	}

	const handleInputDireccion = (e) => {
		const nameInput = e.target.name;
		let valueInput = e.target.type !== 'checkbox' ? e.target.value : 
					e.target.checked ? 1 : 0;

		setStateDireccion((prevState) => {
			const newState = { ...prevState };
			newState[nameInput] = valueInput
			return newState;
		});
	}

	const renderSubtipos = () => {
		let selectSubtipos = (
			<Select
				onChange={(e) => setSubtipoValue(e.target.value)}
				value={subtipoValue}
			>
				<option disabled value="" >
					Subtipo
				</option>
			{
				subtipos.map((el, key) => (
					<option key={key} value={el.subTipo} >
						{el.nombreWeb}
					</option>
				))
			}
			</Select>
		);

		let selectZonas = (
			<Select
				onChange={(e) => setZonaValue(e.target.value)}
				value={zonaValue}
			>
				<option disabled value="" >
					Zona
				</option>
			{ (zonas.length || subtipoValue) ? null :
				<option disabled value="" >
					Debes selecionar un subtipo
				</option>
			}
			{
				zonas.map((el, key) => (
					<option key={key} value={el.zona} >
						{el.nombreWeb}
					</option>
				))
			}
			</Select>
		);

		return(
			<Fragment>
				{(subtipos.length) ? selectSubtipos : null}
				{(zonas.length) ? selectZonas : null}
			</Fragment>
		)
	}

	const renderProvincia = () => (
		<Select
			s={12}
			onChange={(e) => setProvinciaValue(e.target.value)}
			value={provinciaValue}
		>
			<option disabled value='' >
				Provincia
			</option>
			{
				provincias.map((el) => (
					<option key={el.provinciaCod} value={el.provinciaCod} >
						{el.provincia}
					</option>
				))
			}
		</Select>
	);

	const renderLocalidad = () => (
		<Select
			s={12}
			onChange={(e) => setLocalidadValue(e.target.value)}
			value={localidadValue}
		>
			<option disabled value="" >
				Localidad
			</option>
		{ (localidades.length) ? null :
			<option disabled value="" >
				Debes selecionar una Provincia
			</option>
		}
		{
			localidades.map((el) => (
				<option key={el.localidadCod} value={el.localidadCod} >
					{el.nombre}
				</option>
			))
		}
		</Select>
	);

	const renderSucursal = () => (
		<Select
			s={12}
			onChange={(e) => setSucursalValue(e.target.value)}
			value={sucursalValue}
		>
			<option disabled value="" >
				Sucursal
			</option>
		{ (sucursales.length) ? null :
			<option disabled value="" >
				Debes selecionar una Localidad
			</option>
		}
		{
			sucursales.map((el, key) => (
				<option key={key} value={el.sucursalCod} >
					{el.nombre}
				</option>
			))
		}
		</Select>
	);

	const renderDireccion = () => (
		<Fragment>
			<TextInput
				s={12}
				l={6}
				name={'calle'}
				value={stateDireccion.calle}
				type='text'
				globalClasses={clasess.inputIcon}
				icon={'location_on'}
				onChange={handleInputDireccion}
				label='Calle'
			/>

			<TextInput
				s={12}
				l={6}
				name={'calleNro'}
				value={stateDireccion.calleNro}
				type='text'
				onChange={handleInputDireccion}
				label='N°'
			/>

			<TextInput
				s={12}
				l={4}
				name={'piso'}
				value={stateDireccion.piso}
				type='text'
				onChange={handleInputDireccion}
				label='Piso'
			/>

			<TextInput
				s={12}
				l={4}
				name={'dpto'}
				value={stateDireccion.dpto}
				type='text'
				onChange={handleInputDireccion}
				label='Dpto'
			/>

			<TextInput
				s={12}
				l={4}
				name={'codpostal'}
				value={stateDireccion.codpostal}
				type='text'
				onChange={handleInputDireccion}
				label='Código postal'
			/>
		</Fragment>
	);

	const renderEnvioMiDireccion = () => {
		return(
			<Fragment>
				<div className={style.wrapperDireccion} >
					<RadioGroup
						radioClassNames={style.radioDireccion}
						name="envio-mi-direccion-radio"
						value={envioMiDireccion}
						onChange={(e) => setEnvioMiDireccion(e.target.value)}
						options={[
							{
								label: 'Enviar a mi dirección',
								value: 'midir'
							},
							{
								label: 'Cambiar dirección',
								value: 'newdir'
							}
						]}
					/>
				</div>
				{ (envioMiDireccion === 'midir') ?
					<p>
						{ (user.domicilio) ? user.domicilio :
							'Debe actualizar su dirección de envío'
						}
					</p>
					:
					<div className='row'>
						<Select
							s={12}
							selectClassName={style.selectM}
							label='País'
							name='dir-pais'
							onChange={(e) => setPaisEnvio(e.target.value)}
							value={paisEnvio}
						>
						{
							paises.map((pais, index) => (<option key={index} value={pais.code}>{pais.label}</option>))
						}
						</Select>
						{paisEnvio === 'ARG' && renderProvincia()}
						{paisEnvio === 'ARG' && renderLocalidad()}
						{paisEnvio === 'ARG' && renderDireccion()}
						{ (paisEnvio === 'ARG') ? null :
							<TextInput
								s={12}
								name={'dirOtroPais'}
								value={stateDireccion.dirOtroPais}
								type='text'
								onChange={handleInputDireccion}
								label='Dirección'
							/>
						}
					</div>
				}
			</Fragment>
		)
	}

	const contentTipoEnvio = (
		<Fragment>
			<section>
			{ (!tipoEnvioGroup) ? null :
				<RadioGroup
					radioClassNames={clasess.radioGroup}
					name="tipo-envio-radio"
					value={tipoEnvioValue}
					onChange={(e) => setTipoEnvioValue(e.target.value)}
					disabledIcon={breakpoint}
					options={tipoEnvioGroup}
				/>
			}
			</section>

			<span className={clasess.divider} ></span>

			<section>
			{
				(!tipoEnvioOptions || !tipoEnvioOptions[tipoEnvioValue]) ? null :
				(!['BOLETERIA', 'ETICKET'].includes(tipoEnvioOptions[tipoEnvioValue].clase) && breakpoint) ? 
					<Fragment>
						<h3>Completar información de envío</h3>
						<div className='linea-titulo' ></div>
					</Fragment>
					 : null
			}
			{
				(!tipoEnvioOptions || !tipoEnvioOptions[tipoEnvioValue]) ? null :
				/* else if */
				(tipoEnvioOptions[tipoEnvioValue].clase == 'PDV') ?
					<RadioGroup
						radioClassNames={style.radioGroupPDV}
						name="envio-pdv-radio"
						value={pdvValue}
						onChange={(e) => {
							setPdvValue(e.target.value)
						}}
						options={tipoEnvioOptions[tipoEnvioValue].data}
					/>
				/* else if */
				: (tipoEnvioOptions[tipoEnvioValue].clase == 'CORREO') ?
					// ['OCA', 'CORREOARG'].includes(tipoEnvioOptions[tipoEnvioValue].tipo)) ?
					<Fragment>
						{renderProvincia()}
						{renderLocalidad()}
						{renderSucursal()}
					</Fragment>
				: (['BOLETERIA', 'ETICKET'].includes(tipoEnvioOptions[tipoEnvioValue].clase)) ?
					null
				/* else */
				:
					<Fragment>
						{renderSubtipos()}
						{renderEnvioMiDireccion()}
					</Fragment>
			}
			</section>
		</Fragment>
	);

	return(
		<div className={style.tipoDeEnvio} >
			<div className={clasess.contentLayout} >
				<section className={clasess.columnLeft} >
					<section className={clasess.subtitulo} >
						<h3>{(estacionamiento.active) ? 'estacionamiento' : 'tipo de envío'}</h3>
						<div className='linea-titulo' ></div>
					</section>
					{(!estacionamiento.active) ?  contentTipoEnvio :
						<section>
							<RadioGroup
								radioClassNames={clasess.radioGroup}
								name="estacionamiento-radio"
								value={estacionamientoValue}
								onChange={(e) => setEstacionamientoValue(e.target.value)}
								options={estacionamiento.data}
							/>
						</section>
					}
				</section>

				<span className={clasess.divider} ></span>

				<ComponentResumen
					cargoEnvio={cargoEnvio}
					onClick={handleClickResumen}
					estacionamiento={estacionamiento}
					asientos={resumenDeCompra.asientos}
					subtotal={resumenDeCompra.subtotal}
					cargoServicio={resumenDeCompra.cargoServicio}
					buttonLeft={{
						text: 'Volver',
						action: 'volver',
					}}
					buttonRight={{
						text: (estacionamiento.active || !hayEstacionamiento) ? 'Pagar' : 'Continuar',
						action: (estacionamiento.active || !hayEstacionamiento) ? 'pagar' : 'continuar',
						disabled: cargoEnvio && cargoEnvio.value === null || direccionRequerida && !direccionValida
					}}
				/>
			</div>
		</div>
	)
}

export default TipoDeEnvio;