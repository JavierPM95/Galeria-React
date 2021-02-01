import React, {
	lazy,
	useRef,
	useState, 
	useEffect,
	useLayoutEffect,
} from 'react';
import Parse from 'html-react-parser';
import { useParams, useHistory } from 'react-router-dom';

/* utils */
import svgCheck from './svgCheck';
import httpClient from '../../../../utils/axios';
import { restaAbs } from '../../../../utils/';

/* CustomHooks */
import { useEventListener, useWindowSize } from '../../../customHooks/';

/* SVG viewer 2 */
import { INITIAL_VALUE, TOOL_NONE, ALIGN_CENTER } from 'react-svg-pan-zoom';
import MapaSvgInteractivo from '../../../MapaSvgInteractivo/MapaSvgInteractivo';

/* Style */
import cx from 'classnames';
import style from './Asientos.css';

/* utils */
import idgen from '../../../../utils/idgen';

/* connect */
import connect from '../../../../context/connect';

/* Actions */
import { handleOpenLogin } from '../../../../actions/loginAction';

/* Components */
import Toolbar from './Toolbar';
import MiniMapa from '../../../MiniMapa/MiniMapa';
const Icon = lazy(() => {
	return import(/* webpackChunkName: 'Icon' */'../../../Icon')
});
const Select = lazy(() => {
	return import(/* webpackChunkName: 'Select' */'../../../Select')
});
const Preloader = lazy(() => {
	return import(/* webpackChunkName: 'Preloader' */'../../../Preloader');
});
const AsientoElegido = lazy(() => {
	return import(/* webpackChunkName: 'AsientoElegido' */'./AsientoElegido/AsientoElegido');
});

const Asientos = ({
	evento,
	clasess,
	dataLogin,
	volverAlEvento,
	handleOpenLogin,
	setResumenDeCompra,
	setStepTipoEnvioActivo,
}) => {
	const history = useHistory();
	const _tooltips = useRef(null);
	const _viewerRef = useRef(null);
	const _switchRef = useRef(null);
	const windowSize = useWindowSize();
	const _timeStampClick = useRef({});
	const _contentViewerRef = useRef(null);
	const [ maxEntradas, setMaxEntradas ] = useState(1);
	const [ isSending, setIsSending ] = useState(false);
	const [ mostrarMapa, setMostrarMapa ] = useState(false);
	const [ inputAsientos, setInputAsientos ] = useState('1');
	const [ switchPromoActivo, setSwitchPromoActivo ] = useState(false);
	const [ asientosElejidosStyle, setAsientosElejidosStyle ] = useState({});

	/* Referencias para manejar los tooltips */
	const _wrapperTooltips = useRef(null);
	/*
	 * $ref = es una referencia al id del último elemento (asiento, sector)
	 * en el que se hizo hover para determinar si al llamar la función
	 * mostrarTooltips() coinciden el 'ref' global y el 'ref' que es pasado
	 * como parametro a la función
	 *
	 * activo: determina si aún está el evento hover activo
	*/
	const _mostrarTootips = useRef({ref: null, activo: false});

	/* CONSTANTS*/

	// Bandera para controlar eventos en el modo de vista sector/asientos
	const LIMITE_D = 0.9;
	const _limite_d = useRef(0.9);
	const [ modoSectorActivo, setModoSectorActivo ] = useState(true);
	const FONDO_ASIENTO_LIBRE = evento.colorAsientoLibre || '#83bd31';
	const [ fitToViewerActivo, setFitToViewerActivo ] = useState(false);

	/*
	 * Datos recibidos de API's:
	 * @sectores Listado de sectores
	 * @asientos Listado de asientos
	 * @promociones Listado de promociones
	 */
	const [ sectores, setSectores ] = useState([]);
	const [ asientos, setAsientos ] = useState([]);
	const [ promociones, setPromociones ] = useState(null);
	const [ getSeatsFinished, setGetSeatsFinished ] = useState(false);

	/*
	 * @sectorElegido Sector Elegido
	 * Datos seleccionados por usuario
	 * @asientosElegidos Asientos Elegidos
	*/
	const [ sectorElegido, setSectorElegido ] = useState({})
	const [ asientosElegidos, setAsientosElegidos ] = useState([]);
	const [ promocionElegida, setPromocionElegida ] = useState({
		promoId: 'NORMAL',
		minVentaEntradas: 1,
		maxVentaEntradas: 1
	});

	// States para manipular el mapa
	const [ tool, setTool ] = useState(TOOL_NONE);
	const [ valueViewer, setValueViewer ] = useState(INITIAL_VALUE);
	const [ viewerSize, setViewerSize ] = useState({width: 0, height: 0});

	useEffect(() => {
		// Lee Promociones
		httpClient.apiGet('promociones-evento', {
			params: {
				evento: evento.id
			}
		})
		.then(({ data }) => {
			let PromoDiscapacitado = data.find((el) => el.promoId == 'DISCAPACITADO');
			setSwitchPromoActivo((PromoDiscapacitado) ? true : false);

			setPromociones(data);
			setPromocionElegida(data.find((el) => el.promoId == 'NORMAL'));
		})

		getAsientos();
	}, [])

	useEffect(() => {
		setInputAsientos(promocionElegida.minVentaEntradas);
		asientosElegidos.forEach((el) => borrarAsiento(el.id));

		_switchRef.current.checked = promocionElegida.promoId == 'DISCAPACITADO';

		httpClient.apiGet('sectores', {
			params: {
				evento: evento.id,
				promo: promocionElegida.promoId,
				funcion: evento.fechaSeleccionada.funcionId,
			}
		}).then(({ data }) => {
			if(data && data.length) {
				setSectores(data);
			} else {
				setPromocionElegida(promociones.find((el) => el.promoId == 'NORMAL'));
				M.toast({
					html: 'Lo sentimos, no tenemos asientos disponibles para la promoción elegida.',
					classes:`black-text yellow`
				})
			}
		})
	}, [promocionElegida])

	useEffect(() => {
		const { maxVentaEntradas } = promocionElegida;
		const max = (maxVentaEntradas) ? maxVentaEntradas : evento.maxVentaEntradas;
		setMaxEntradas(max);

	}, [promocionElegida, evento]);

	useEffect(() => {
		const { minVentaEntradas } = promocionElegida;
		if(parseFloat(inputAsientos) > maxEntradas) {
			M.toast({
				html: 'A llegado al limite de asientos que puede elegir',
				classes:`black-text yellow`
			});
			setInputAsientos(maxEntradas);
		}

		if(parseFloat(inputAsientos) < asientosElegidos.length) {
			M.toast({
				html: 'Primero debe eliminar alguno de los asientos elegidos',
				classes:`black-text yellow`
			});
			setInputAsientos(asientosElegidos.length);
		}

		if(parseFloat(inputAsientos) < minVentaEntradas) setInputAsientos(minVentaEntradas);

	}, [asientosElegidos, maxEntradas, promocionElegida, inputAsientos])

	useEffect(() => {
		// Restablecer estilos de sectores
		const viewerDOM = _viewerRef.current.ViewerDOM;
		const grupoSectores = viewerDOM.getElementById('grupoSectores');
		viewerDOM.querySelectorAll('#grupoSectores polygon').forEach((el) => {
			el.style.fill = '';
		});

		sectores.forEach(updateSector);
		grupoSectores.addEventListener('mouseup', clickLiberado);
		grupoSectores.addEventListener('click', seleccionaSector);
		grupoSectores.addEventListener('mouseout', mouseoutSector);
		grupoSectores.addEventListener('mousedown', clickSostenido);
		grupoSectores.addEventListener('mouseover', handleHoverSector);

		return(() => {
			grupoSectores.removeEventListener('mouseup', clickLiberado);
			grupoSectores.removeEventListener('click', seleccionaSector);
			grupoSectores.removeEventListener('mouseout', mouseoutSector);
			grupoSectores.removeEventListener('mousedown', clickSostenido);
			grupoSectores.removeEventListener('mouseover', handleHoverSector);
		})
	}, [sectores])

	useEffect(() => {
		if(sectores.length && getSeatsFinished) {
			mostrarMapaCallback();
		}

		const SVG = _viewerRef.current.ViewerDOM;
		/* Seteo de listeners y estilos para Asientos */
		SVG.querySelectorAll('#grupoAsientos circle').forEach((el) => {
			el.style.fill = evento.colorAsientoOcupado
		});

		asientos.forEach((asiento) => {
			const sector = sectores.find((el) => el.sectorId == asiento.sector);
			if(sector) {
				const {
					idAsiento,
					ubicacionFila,
					ubicacionAsiento
				} = asiento;
				const id = `${idAsiento}-${ubicacionFila}:${ubicacionAsiento}`
				const asientoMapa = SVG.getElementById(id)
				if(asientoMapa) {
					asientoMapa.style.fill = FONDO_ASIENTO_LIBRE
					asientoMapa.classList.add('asiento-libre', style.asientoActivo);
				}
			}
		})

		const grupoAsientos = SVG.getElementById('grupoAsientos');

		grupoAsientos.addEventListener('mouseup', clickLiberado);
		grupoAsientos.addEventListener('click', seleccionaAsiento);
		grupoAsientos.addEventListener('mousedown', clickSostenido);
		grupoAsientos.addEventListener('mouseout', mouseoutAsiento);
		grupoAsientos.addEventListener('mouseover', handleHoverAsiento);

		return () => {
			grupoAsientos.removeEventListener('mouseup', clickLiberado);
			grupoAsientos.removeEventListener('click', seleccionaAsiento);
			grupoAsientos.removeEventListener('mousedown', clickSostenido);
			grupoAsientos.removeEventListener('mouseout', mouseoutAsiento);
			grupoAsientos.removeEventListener('mouseover', handleHoverAsiento);
		}
	}, [asientos, sectores, getSeatsFinished])

	useEffect(() => {
		// Dimensionar el mapa
		setMostrarMapa(false);
		setViewerSize({width: 0, height:0});
	}, [windowSize])

	useEffect(() => {
		/*
		 * Intentar mostrar el mapa...
		 * si cambian las dimensiones del viewerSize
		*/
		mostrarMapaCallback();
	}, [viewerSize])

	useEffect(() => {
		if(fitToViewerActivo) {
			setModoSectorActivo((prevState) => {
				if(!prevState) {
					_limite_d.current = getValueViewer().d;
				}
				return true;
			})
		}
	}, [fitToViewerActivo])

	useEffect(() => {
		const SVG = _viewerRef.current.ViewerDOM;
		const grupoNombreSectores = SVG.getElementById('grupoNombreSectores');
		if(modoSectorActivo) {
			if(grupoNombreSectores) grupoNombreSectores.style.opacity = '1';
			setAsientosOpacity(0)
			setSectoresOpacity(1)
		} else {
			setAsientosOpacity(1)
			setSectoresOpacity(0)
			sectores.forEach(updateSector);
			if(grupoNombreSectores) grupoNombreSectores.style.opacity = '0';
		}
	}, [modoSectorActivo])

	const mostrarMapaCallback = () => {
		const valueViewer = { ...getValueViewer() };
		setAsientosElejidosStyle({ maxHeight: `${valueViewer.viewerHeight}px` });

		console.log({viewerSize, asientos, sectores});
		if(viewerSize.width && viewerSize.height && valueViewer.viewerWidth && valueViewer.viewerHeight) {
			// El mapa ya tienes las medidas ideales para ser mostrado
			fitToViewer();
			setMostrarMapa(true);
			setFitToViewerActivo(true);

		} else if(sectores.length && getSeatsFinished) {
			/*
			 * Ya están disponibles los sectores y asientos.
			 * Cambiar las medidas del viewer para mostrar el mapa pintado
			*/
			const offsetTop = _contentViewerRef.current.offsetTop;
			valueViewer.viewerWidth = _contentViewerRef.current.offsetWidth;
			valueViewer.viewerHeight = restaAbs(offsetTop, window.innerHeight);
			setValueViewer(valueViewer);
			setViewerSize({
				width: valueViewer.viewerWidth,
				height: valueViewer.viewerHeight
			});
		}
	}

	/*
	 * Elimina un asiento seleccionado
	 * @asientoABorrar {string} id del asiento ej: "e3s4a37:3"
	 */
	const borrarAsiento = (asientoABorrar) => {
		const borrar = asientosElegidos.find((el) => el.id == asientoABorrar);
		if(borrar && !borrar.hasOwnProperty('numerado')) {
			// Pinta color
			_viewerRef.current.ViewerDOM.getElementById(asientoABorrar).style.fill = FONDO_ASIENTO_LIBRE
			// Quita simbolo check
			_viewerRef.current.ViewerDOM.getElementById('check-' + asientoABorrar).remove()
		}
		setAsientosElegidos((prevState) => {
			return prevState.filter((asiento) => asiento.id !== asientoABorrar);
		})
	}

	const mouseoutAsiento = (e) => {
		const target = e.target;
		const asiento = asientosElegidos.find((el) => el.id == target.id);
		if(asiento) {
			target.style.fill = 'none'
		}
		borrarTooltips();
	}

	const handleHoverAsiento = (e) => {
		const asientoInfo = {};
		// Verificar si el evento lo disparó un evento seleccionado (svgCheck)
		let asiento = (e.target.nodeName == 'path') ? e.target.parentNode : e.target;
		if(asiento.nodeName == 'svg') {
			return;
		} else {
			// Info del tag <circle> => asiento.id = e17s1a9:1-1:42
			const [fila, butaca ] = asiento.id.split('-')[1].split(':')
			asientoInfo.fila = fila;
			asientoInfo.butaca = butaca;
		}

		// Obtener la información del asiento para mostrar en el tooltips
		const
			idSVG = asiento.id.split('-')[0], // ej => e17s1a9:1
			sectorId = idSVG.slice(0, idSVG.indexOf('a')),
			{x, y, width } = asiento.getBoundingClientRect(),
			sector = sectores.find((el) => el.sectorId == sectorId),
			disponible = asiento.classList.contains('asiento-libre'),
			sectorNro = idSVG.slice(idSVG.indexOf('s')+1, idSVG.indexOf('a'));

		_tooltips.current.innerHTML = `
			<section>
				<div>
					<p>Sector</p>
					<p>${sectorNro}</p>
				</div>
				<div>
					<p>Fila</p>
					<p>${asientoInfo.fila}</p>
				</div>
				<div>
					<p>Butaca</p>
					<p>${asientoInfo.butaca}</p>
				</div>
			</section>
			${(disponible) ? '<p>$'+sector.valorNeto+'</p>': ''}
		`;
		_tooltips.current.classList.add(style.tooltipsAsiento);

		// posicionando el tooltips
		_mostrarTootips.current.ref = idSVG;
		_mostrarTootips.current.activo = true;
		setTimeout(() => {
			mostrarTooltips(x, y, width, idSVG);
		}, 400);
	}

	const clickLiberado = (e) => {
		const timeDiff = (new Date() - _timeStampClick.current.startTime) / 1000;
		_timeStampClick.current.stopPropagation = timeDiff > 1.6;
	}

	const clickSostenido = (e) => {
		_timeStampClick.current.startTime = new Date();
	}

	/*
	 * Registrar los asientos seleccionados
	 * @param {event} $e evento (onClick) que llama a la función seleccionaAsiento(e)
	 * `````````
	 * @param {array[object...]} $asientosNoNumerados si los asientos que se desean seleccionar
	 * son de un sector no numerado se debe enviar un array de objetos con las siguentes propiedades:
	 * asiento.fila = '-'
	 * asiento.butaca = '-'
	 * asiento.valorNeto = sector.valorNeto
	 * asiento.numerado = false
	 * asiento.sector (sectorId)
	 * asiento.id => el id se genera utilizando el id del sector concatenado con el entero
	 * devuelto por la función auxiliar idgen() que genera un entero unico entre los generados
	 * con la misma función. Ejemplo si el id del sector es 'e3s12'
	 * sus respectivos id serían e3s12-idgen(), e3s12-idgen()
	 *
	 * `````````
	 */
	const seleccionaAsiento = (e, asientosNoNumerados = null) => {
		// detener la selección de asientos si se está haciendo drag
		if(_timeStampClick.current.stopPropagation) {
			_timeStampClick.current.stopPropagation = false;
			return;
		}
		const banderas = {};
		const asientoState = {};

		setInputAsientos((prevState) => banderas.contador = prevState);
		setMaxEntradas((prevState) => banderas.maxEntradas = prevState);
		setAsientosElegidos((prevState) => {
			banderas.asientosElegidos = prevState.length;
			return prevState;
		});

		if(asientosNoNumerados) {
			// Eliminar el excedente
			if(banderas.asientosElegidos + asientosNoNumerados.length > banderas.contador) {
				let faltante = banderas.contador - banderas.asientosElegidos;
				while(asientosNoNumerados.length > faltante) {
					asientosNoNumerados.pop()
				}
			}
			setAsientosElegidos((prevState) => {
				if(
					prevState.length && asientosNoNumerados.length && 
					prevState[0].sectorId != asientosNoNumerados[0].sectorId
				) {
					M.toast({
						html: 'Solo puede elegir asientos del mismo sector',
						classes:`black-text yellow`
					});
					return prevState;
				}
				return [...prevState, ...asientosNoNumerados]
			})
			return;
		}

		// Verificar si el evento lo disparó un evento seleccionado (svgCheck)
		let asiento = (e.target.nodeName == 'path') ? e.target.parentNode : e.target;
		if(asiento.nodeName == 'svg') {
			// 'asiento.id = check-e17s4a31:2-2:13'.slice(6) => e17s4a31:2-2:13
			asiento = _viewerRef.current.ViewerDOM.getElementById(asiento.id.slice(6));
		} else {
			// Info del tag <circle> => asiento.id = e17s1a9:1-1:42
			const [fila, butaca ] = asiento.id.split('-')[1].split(':')
			asientoState.fila = fila;
			asientoState.butaca = butaca;
		}

		asientoState.id = asiento.id;
		const idSVG = asientoState.id.split('-')[0]; // ej => e17s1a9:1

		if(!asiento.classList.contains('asiento-libre')) return;

		asientoState.evento = evento.id
		asientoState.sectorId = idSVG.slice(0, idSVG.indexOf('a'));
		const [ posicionX, posicionY ] = idSVG.split('a')[1].split(':');
		asientoState.posicionX = posicionX;
		asientoState.posicionY = posicionY;

		const sector = sectores.find((el) => {
			return el.sectorId == asientoState.sectorId;
		});

		asientoState.valorNeto = sector.valorNeto;
		asientoState.cargoTTDE = sector.cargoTTDE;

		asientoState.sector = idSVG.slice(idSVG.indexOf('s')+1, idSVG.indexOf('a'));

		asientoState.codigo = idSVG.slice(idSVG.indexOf('a')+1);

		setAsientosElegidos((prevState) => {
			let newState = [];
			const viewerDOM = _viewerRef.current.ViewerDOM;
			const asintoExistente = prevState.find((el) => el.id == asientoState.id);

			if(asintoExistente) {
				/* El asiento ya fue elegido, debe ser removido */
				viewerDOM.getElementById('check-' + asientoState.id).remove();
				viewerDOM.getElementById(asientoState.id).style.fill = FONDO_ASIENTO_LIBRE;
				newState = prevState.filter((el) => el.id != asientoState.id);
			} else if(prevState.length && prevState[0].sectorId != asientoState.sectorId) {
				M.toast({
					html: 'Solo puede elegir asientos del mismo sector',
					classes:`black-text yellow`
				});
				newState = [...prevState];
			} else if(banderas.asientosElegidos >= banderas.contador) {
				// Validación de límites
				M.toast({
					html: 'Debe aumentar la cantidad de asientos que quiere comprar para poder seguir eligiendo',
					classes:`black-text yellow`
				});
				return prevState;
			} else {
				viewerDOM.getElementById('grupoAsientos').insertAdjacentHTML('beforeend', svgCheck)
				const check = viewerDOM.querySelector('#grupoAsientos #newCheck');

				asiento.style.fill = "none";
				check.id = 'check-' + asiento.id
				check.setAttribute('x', parseInt(asiento.getAttribute('cx')) - 7)
				check.setAttribute('y', parseInt(asiento.getAttribute('cy')) - 5)
				newState = [...prevState, asientoState];
			}
			return newState;
		})
	}

	const borrarTooltips = () => {
		_mostrarTootips.current.ref = null;
		_mostrarTootips.current.activo = false;
		const wpTool = _wrapperTooltips.current;
		_tooltips.current.innerHTML = '';
		_tooltips.current.className =  '';
		wpTool.style.opacity = '0';
		wpTool.lastChild.style.opacity = '0';
	}

	/*
	 * @param {integer} $x es la posición relativa al document donde se
	 * posicionara el tooltips (left)
	 *
	 * @param {integer} $y es la posición relativa al document donde se
	 * posicionara el tooltips (top)
	 *
	 * @param {integer} $width ancho del tooltips
	 *
	 * @param {string} $ref es una referencia al id del elemento (asiento, sector)
	 * con el cual se llama a la función
	*/
	const mostrarTooltips = (x, y, width, ref) => {
		if(!_mostrarTootips.current.activo || _mostrarTootips.current.ref != ref) {
			return;
		}
		const wpTool = _wrapperTooltips.current;
		wpTool.style.opacity = '1';
		wpTool.lastChild.style.opacity = '1';
		wpTool.style.top = `${restaAbs(y, wpTool.clientHeight + 10)}px`;
		wpTool.style.left = `${restaAbs(x + width / 2, wpTool.clientWidth / 2)}px`;
	}

	/*
	 * Utilizar el callback del useState
	 * para determinar el valor real del modoSectorActivo
	 * dentro de los eventListener
	*/
	const getModoSectorStatus = () => {
		var bandera;
		setModoSectorActivo((prevState) => {
			bandera = prevState;
			return prevState;
		});
		return bandera
	}

	const mouseoutSector = (e) => {
		// Inhabilitar el event si el modoSector está desactivado
		if(!getModoSectorStatus()) return;

		const id = e.target.id.split('-')[0];
		const sector = sectores.find((el) => el.sectorId == id);
		if(sector) {
			borrarTooltips();
			updateSector(sectores.find((el) => el.sectorId == id));
		}
	}

	const handleHoverSector = (e) => {
		// Inhabilitar el event si el modoSector está desactivado
		if(!getModoSectorStatus()) return;

		const target = e.target;
		const id = target.id.split('-')[0];
		const sector = sectores.find((el) => el.sectorId == id);

		// si el sector no es devuelto por la API no debe pintarce al hacer hover
		if(!sector) return;

		// Calcular disponibilidad del sector
		const { capacidad, totalVendidoEvento, nombre, valorNeto } = sector;
		let ticketsDisponibles = capacidad - totalVendidoEvento;

		_tooltips.current.innerHTML = `
			<p>${nombre}</p>
			<p>$${valorNeto}</p>
			<p>${(ticketsDisponibles) ?
				ticketsDisponibles+' Tickets' : '<span class="red-text">AGOTADO</span>'
			}</p>
		`;
		_tooltips.current.classList.add(style.tooltipsSector);

		// posicionando el tooltips
		const { x, y, width } = target.getBoundingClientRect();
		_mostrarTootips.current.ref = id;
		_mostrarTootips.current.activo = true;
		setTimeout(() => {
			mostrarTooltips(x, y, width, id);
		}, 400);

		if(getValueViewer().d < 0.7) {
			target.style.fill = evento.colorSectorHover || '#030447';
		}
	}

	/* Actualizar sector segun disponibilidad */
	const updateSector = (sector) => {
		const
			colorSectorOcupado20 = evento.colorSectorOcupado20 || '#8ebde2',
			colorSectorOcupado60 = evento.colorSectorOcupado60 || '#469adc',
			colorSectorOcupado99 = evento.colorSectorOcupado99 || '#2782ca',
			colorSectorOcupado100 = evento.colorSectorOcupado100 || '#054d86';

		const { capacidad, totalVendidoPromo, totalVendidoEvento, cupoPromo, nombre } = sector;

		let disponibleSector = capacidad - totalVendidoEvento;

		if(cupoPromo) {
			disponibleSector = Math.min(cupoPromo, disponibleSector);
			disponibleSector -= totalVendidoPromo;
		}

		// Calcular ocupación
		let factorOcupacion = (capacidad - disponibleSector) / capacidad * 100;

		// Calcular color
		const colorFondo = (factorOcupacion <= 20) ? colorSectorOcupado20 :
											 (factorOcupacion <= 60) ? colorSectorOcupado60 :
											 (factorOcupacion <= 99) ? colorSectorOcupado99 :
											 colorSectorOcupado100;

		// Aplica color de ocupación
		const sectorMapa = _viewerRef.current.ViewerDOM
											.querySelector(`polygon[id^=${sector.sectorId}-]`);
		if(sectorMapa) {
			sectorMapa.style.fill = colorFondo;
			if(!sectorMapa.classList.contains(style.sectorActivo)) {
				sectorMapa.classList.add(style.sectorActivo);
			}
		}
	}

	/* Selecciona un sector sobre el mapa, y carga los datos necesarios */
	const seleccionaSector = (e) => {
		// detener la selección de sectores si se está haciendo drag
		if(_timeStampClick.current.stopPropagation) {
			_timeStampClick.current.stopPropagation = false;
			return;
		}

		// Inhabilitar la selección de sectores si el modoSector está desactivado
		if(!getModoSectorStatus()) return;

		const id = e.target.id.split('-')[0];
		const sector = sectores.find((el) => el.sectorId == id);
		if(!sector) return;
		if(!sector.numerado) {
			/*
			 * Se deben configurar asientos ficticios (para ser mostrados)
			 * La cantidad de asientos a crear el la misma que lo que haya
			 * en el input de cantidad de asientos (inputAsientos)
			 * no es necesario hacer zoom del sector (por ser no numerado)
			 */
			let cantidadAsientos;
			setInputAsientos((prevState) => cantidadAsientos = prevState);
			let asientosNoNumerados = [];
			const sectorNro = sector.sectorId.slice(1, sector.sectorId.indexOf('s'));
			for(let i = 0; i < cantidadAsientos; i++) {
				asientosNoNumerados[i] = {
					fila: '-',
					butaca: '-',
					numerado: false,
					sector: sectorNro,
					sectorId: sector.sectorId,
					valorNeto: sector.valorNeto,
					cargoTTDE: sector.cargoTTDE,
					id: `${sector.sectorId}-${idgen()}`,
				}
			}
			seleccionaAsiento(null, asientosNoNumerados);
		} else {
			const { x, y, width, height } = e.target.getBBox();
			// Setea zoom del mapa
			fitSelection({ x, y, width, height })
			_limite_d.current = Math.min(_limite_d.current, getValueViewer().d);
			setModoSectorActivo(false);
		}
	}


	/* Realiza la orden de pre-compra del ticket mediante llamado a API */
	const handleCompraTicket = async () => {

		if(asientosElegidos.length % promocionElegida.multiPromo != 0) {
			M.toast({
				html:`La cantidad de asientos para la promoción
							seleccionada debe ser múltiplo de ${promocionElegida.multiPromo}`,
				classes:`black-text yellow`,
			});
			return;
		}

		if(!dataLogin.isLogin) {
			M.toast({
				html: 'Debe iniciar sesión para poder continuar con la compra',
				classes:`black-text yellow`,
			});
			setTimeout(handleOpenLogin, 300);
			return;
		}

		// Envía orden
		setIsSending(true)
		const formData = new FormData();

		const noNumerados = asientosElegidos[0].hasOwnProperty('numerado');
		let asientosIds = null;
		if(noNumerados) {
			asientosIds = asientosElegidos.length;
		} else {
			asientosIds = JSON.stringify(asientosElegidos.map(elem => elem.id.split('-')[0]));
		}

		formData.append('eventoId', evento.id);
		formData.append('asientos', asientosIds);
		formData.append('clienteId', dataLogin.user.id);
		formData.append('promoId', promocionElegida.promoId);
		formData.append('sectorId', asientosElegidos[0].sectorId);
		formData.append('funcionId', evento.fechaSeleccionada.funcionId);

		let descuentoResponse = await httpClient.apiGet(`promo-descuento/${promocionElegida.promoId}`);
		let descuento = (descuentoResponse.data || 0) / 100;

		let valorNeto = asientosElegidos[0].valorNeto;
		let valorNetoConDescuento = valorNeto - (valorNeto * descuento);

		const resumenAsientos = {
			noNumerados: noNumerados,
			valorNeto: valorNetoConDescuento,
			cargoTTDE: asientosElegidos[0].cargoTTDE,
			dataAsientos: asientosElegidos.map((el) => ({...el, id: el.id.split('-')[0]})),
			sectorNombre: sectores.find((el) => el.sectorId == asientosElegidos[0].sectorId).nombre,
		};

		const { data } = await httpClient.apiPost('oct', formData);

		if(data) {
			if (data.ordenDeCompraId) {
				// Caso de éxito
				M.toast({
					html: 'La orden de compra temporal fue generada con éxito',
					classes:`black-text green`
				});
				setResumenDeCompra((prevState) => ({
					...prevState,
					asientos: resumenAsientos,
					promoId: promocionElegida.promoId,
					ordenDeCompraId: data.ordenDeCompraId,
					sectorId: asientosElegidos[0].sectorId,
				}))
				setStepTipoEnvioActivo(true);
				history.push('/comprar/tipo-envio');
				return;
			} else {
				M.toast({
					html: data.mensaje,
					classes:`black-text yellow`
				});
			}
		} else {
			M.toast({
				html: 'Ocurrió un error. Por favor intente nuevamente',
				classes:`black-text yellow`
			});
		}
		setIsSending(false);
	}

	const getAsientos = () => {
		// Se ará una nueva busqueda de asientos
		setGetSeatsFinished(false);
		asientosElegidos.forEach((el) => borrarAsiento(el.id));
		httpClient.apiGet('asientos', {
			params: {
				evento: evento.id,
				funcion: evento.fechaSeleccionada.funcionId
			}
		})
		.then(({ data }) => {
			setAsientos(data);
			// La busqueda de asientos a finalizado
			console.log('dentro');
			setGetSeatsFinished(true);
		})
	}

	/* Setea opacidad del grupo Asientos y activa o desactiva acciones */
	const setAsientosOpacity = (opacity) => {
		// Cambia opacity del layer y desactiva eventos de mouse
		const ga = _viewerRef.current.ViewerDOM.getElementById('grupoAsientos')
		ga.style.opacity = opacity

		if (opacity) {
			ga.style.pointerEvents = 'all'
		} else {
			ga.style.pointerEvents = 'none'
		}
	}

	/* Setea opacidad del grupo Sectores y activa o desactiva acciones */
	const setSectoresOpacity = (opacity) => {
		// Cambia opacity del layer y desactiva eventos de mouse
		const gs = _viewerRef.current.ViewerDOM.getElementById('grupoSectores')
		gs.style.opacity = opacity;

		if (opacity < 0.3) {
			gs.style.pointerEvents = 'none'
		} else {
			gs.style.pointerEvents = 'all'
		}
	}

	const handlePromociones = (e) => {
		const newPromo = promociones.find((el) => el.promoId == e.target.value);
		setPromocionElegida(newPromo);
	}

	/*
	 * Controla visualización y activación de layers del mapa de acuerdo a nivel de zoom
	 * @data nuevo zoom recibido de svg-pan-zoom component
	 * @return void
	 */
	const zoomController = (data) => {
		borrarTooltips();

		if (data.d <= _limite_d.current) {
			setAsientosOpacity(0)
			setSectoresOpacity(1)
			setModoSectorActivo(true);
		} else {
			setAsientosOpacity(1)
			setSectoresOpacity(0)
			setModoSectorActivo(false);
		}
	}

	const handleSwitchPromo = (e) => {
		if(!switchPromoActivo) {
			e.preventDefault();
			M.toast({
				classes:`black-text yellow`,
				html: 'Lo sentimos, no tenemos asientos disponibles en este momento.',
			});
		} else {
			if(e.target.checked) {
				setPromocionElegida(promociones.find((el) => el.promoId == 'DISCAPACITADO'));
			} else {
				setPromocionElegida(promociones.find((el) => el.promoId == 'NORMAL'));
			}
		}
	}

	const HandleinputAsientos = (e, action = null) => {
		const value = (e) ? e.target.value : null;

		setInputAsientos((prevState) => {
			let newState;
			if(action != null) {
				newState = Number.parseFloat(prevState) + Number.parseFloat(action)
				return (newState > 0) ? newState : 0
			}

			if(value) {
				newState = Number.parseFloat(value);
				return (Number.isInteger(newState)) ? newState : prevState
			} else {
				return 1
			}
		})
	}

	/* Funciones de react-svg-pan-zoom */
	const fitToViewer = () => {
		_viewerRef.current.fitToViewer(ALIGN_CENTER, ALIGN_CENTER)
	}

	const getValueViewer = () => {
		return _viewerRef.current.getValue();
	}

	const openMiniature = () => {
		_viewerRef.current.openMiniature()
	}

	const closeMiniature = () => {
		_viewerRef.current.closeMiniature()
	}

	const changeTool = (nextTool) => {
		setTool(nextTool)
	}

	const changeValueViewer = (nextValue) => {
		let newValue = { ...nextValue };
		let {d, viewerWidth, viewerHeight, SVGWidth, SVGHeight } = nextValue;
		let scaleX = viewerWidth / SVGWidth;
		let scaleY = viewerHeight / SVGHeight;
		let scaleFactorMin = Math.min(scaleX, scaleY);

		// Limitar el zoomOut al 1:1 del mapa (scaleFactorMin)
		if(d < scaleFactorMin) {
			fitToViewer()
			return;
		}

		setValueViewer(newValue)
	}
	const fitSelection = ({ x, y, width, height }) => {
		_viewerRef.current.fitSelection(x, y, width, height)
	}

	const zoomOnViewerCenter = () => {
		_viewerRef.current.zoomOnViewerCenter(1.8)
	}

	const zoomOutViewerCenter = () => {
		_viewerRef.current.zoomOnViewerCenter(0.55)
	}

	return(
		<div className={style.contentAsientos} >
			<div className={cx(clasess.contentLayout, style.contentLayoutAsientos)} >
				<section ref={_contentViewerRef} className={cx({[`${style.cargandoMapa}`]: !mostrarMapa})} >
					<MapaSvgInteractivo
						className={cx(
							{'hide' : !mostrarMapa},
							style.reactSVGPanZoom,
						)}
						tool={'auto'}
						ref={_viewerRef}
						value={valueViewer}
						detectAutoPan={false}
						background={'#F5F5F5'}
						onPan={borrarTooltips}
						onZoom={zoomController}
						scaleFactorOnWheel={1.1}
						preventPanOutside={true}
						SVGBackground={'#F5F5F5'}
						onChangeTool={changeTool}
						onChangeValue={changeValueViewer}
						disableDoubleClickZoomWithToolAuto={true}
						width={viewerSize.width} height={viewerSize.height}
						customMiniature={(props) => <MiniMapa {...props} position='right' />}
						customToolbar={() => (
							<Toolbar
								fitToViewer={fitToViewer}
								getAsientos={getAsientos}
								zoomOnViewerCenter={zoomOnViewerCenter}
								zoomOutViewerCenter={zoomOutViewerCenter}
							/>
						)}
					>
						{ Parse(evento.svgAsientos.trim()) }
					</MapaSvgInteractivo>

					{!mostrarMapa && <Preloader/>}
				</section>


				<section
					style={asientosElejidosStyle}
					className={cx(style.contentAsientosElejidos, {[`${style.ocultar}`]: !mostrarMapa})} >
					<h4>PROMOCIONES</h4>
					<section className={style.botonera} >
					{ (promociones) &&
						<Select
							s={12}
							selectClassName={style.promociones}
							onChange={handlePromociones}
							value={promocionElegida.promoId}
						>
							{
								promociones.map((promo) => {
									return(
										<option key={promo.promoId} value={promo.promoId} >
											{promo.descripcion}
										</option>
									)
								})
							}
						</Select>
					}
						<div className={style.inputAsientos} >
							<span onClick={() => HandleinputAsientos(null, -1)} >-</span>
							<input
								type="text"
								value={inputAsientos}
								onChange={HandleinputAsientos}
							/>
							<span onClick={() => HandleinputAsientos(null, 1)} >+</span>
						</div>
						<div className={cx('switch', style.switch)} >
							<label>
								<input ref={_switchRef} onClick={handleSwitchPromo} type="checkbox" />
								<span className="lever with-icons"><Icon>accessible</Icon></span>
							</label>
						</div>
					</section>
					<div
						className={style.results}
						style={{
							maxHeight: (viewerSize.height) ? `${viewerSize.height}px` : '100%'
						}}
					>
						<h3>Sus tickets</h3>
						<div className='linea-titulo' ></div>
						<div id="ticketList">
						{
							asientosElegidos.map((asiento) => { 
								return(
									<AsientoElegido
										id={asiento.id}
										evento={evento}
										key={asiento.id}
										asiento={asiento}
										handleClose={borrarAsiento}
									/>
								)
							})
						}
						{ (promocionElegida.minVentaEntradas > asientosElegidos.length) &&
							<p className={style.notaDeCompra} >
								Debe elegir un mínimo de: {promocionElegida.minVentaEntradas} asientos
							</p>
						}
						</div>
					</div>
					<div className={style.botonesTicketera} >
						<button
							onClick={handleCompraTicket}
							className={cx(style.btnComprar, 'btn')}
							disabled={
								isSending || !asientosElegidos.length ||
								promocionElegida.minVentaEntradas > asientosElegidos.length
							}
						>
							COMPRAR
						</button>
						<button 
							className="btn" 
							onClick={volverAlEvento}
						>
							Volver
						</button>
					</div>
				</section>
			</div>
			<div ref={_wrapperTooltips} className={style.tooltips} >
				<div ref={_tooltips} ></div>
				<span className={cx(style.tooltipsPuntero)} ></span>
			</div>
		</div>
	)
}

const mapStateToProps = (store) => ({
	dataLogin: store.login,
});

const mapDispathToProps = (dispath, store) => ({
	handleOpenLogin: () => dispath(handleOpenLogin(store)),
});

export default connect(mapStateToProps, mapDispathToProps)(Asientos);
