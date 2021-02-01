import React from 'react';
import { ReactSVGPanZoom, MODE_IDLE, ACTION_ZOOM } from 'react-svg-pan-zoom';
import {fromObject, scale, transform, translate} from 'transformation-matrix';

/**
 * Descomponer matriz del value
 * @param value
 * @returns {{scaleFactor: number, translationX: number, translationY: number}}
 */
function decompose(value) {
	let matrix = fromObject(value);

	return {
		scaleFactor: matrix.a,
		translationX: matrix.e,
		translationY: matrix.f
	}
}

function isZoomLevelGoingOutOfBounds(value, scaleFactor) {
	const {scaleFactor: curScaleFactor} = decompose(value);
	const lessThanScaleFactorMin = value.scaleFactorMin && (curScaleFactor * scaleFactor) < value.scaleFactorMin;
	const moreThanScaleFactorMax = value.scaleFactorMax && (curScaleFactor * scaleFactor) > value.scaleFactorMax;

	return (lessThanScaleFactorMin && scaleFactor < 1) || (moreThanScaleFactorMax && scaleFactor > 1);
}

/**
 * Change value
 * @param value
 * @param patch
 * @param action
 * @returns {Object}
*/
function set(value, patch, action = null) {
	value = Object.assign({}, value, patch, {lastAction: action});
	return Object.freeze(value);
}

function limitZoomLevel(value, matrix) {
	let scaleLevel = matrix.a;

	if(value.scaleFactorMin != null) {
		// limit minimum zoom
		scaleLevel = Math.max(scaleLevel, value.scaleFactorMin);
	}

	if(value.scaleFactorMax != null) {
		// limit maximum zoom
		scaleLevel = Math.min(scaleLevel, value.scaleFactorMax);
	}

	return set(matrix, {
		a: scaleLevel,
		d: scaleLevel
	});
}

function fitSelection(to) {
	const [
		value,
		selectionSVGPointX,
		selectionSVGPointY,
		selectionWidth,
		selectionHeight
	] = to;

	let { viewerWidth, viewerHeight } = value;

	let scaleX = viewerWidth / selectionWidth;
	let scaleY = viewerHeight / selectionHeight;
	let scaleLevel = Math.min(scaleX, scaleY);

	// Center map
	let centeringX = 0
	let centeringY = 0

	if (scaleX < scaleY) {
		centeringY = (viewerHeight - selectionHeight * scaleLevel) / scaleLevel / 2;
	} else {
		centeringX = (viewerWidth - selectionWidth * scaleLevel) / scaleLevel / 2;
	}

	const matrix = transform(
		scale(scaleLevel, scaleLevel),
		translate(-selectionSVGPointX + centeringX, -selectionSVGPointY + centeringY)
	);

	if(isZoomLevelGoingOutOfBounds(value, scaleLevel / value.d)) {
		// No permitir scale y translation
		return set(value, {
			mode: MODE_IDLE,
			startX: null,
			startY: null,
			endX: null,
			endY: null
		});
	}

	return set(value, {
		mode: MODE_IDLE,
		...limitZoomLevel(value, matrix),
		startX: null,
		startY: null,
		endX: null,
		endY: null
	}, ACTION_ZOOM);
}

// ref implementación: https://es.reactjs.org/docs/forwarding-refs.html
function mapaSvgInteractivo(Component) {
	class MapaSvgInteractivo extends Component {
		constructor(props) {
			super(props);
		}

		// Es requerido declarar los principales métodos del ciclo de vida
		// para un correcto funcionamiento del HOC
		componentDidMount() {}

		componentWillUnmount() {}

		componentDidUpdate(prevProps) {}


		render() {
			const {forwardedRef, ...rest} = this.props;

			if(forwardedRef.current) {
				// Reescribiendo el método fitSelection para
				// agregar posibilidad de centrado al hacer el fit
				forwardedRef.current.fitSelection = (...to) => {
					let nextValue = fitSelection([ forwardedRef.current.getValue(), ...to ]);
					this.setValue(nextValue);
				}
			}

			// Asigne el accesorio personalizado "forwardedRef" como referencia
			return(
				<Component ref={forwardedRef} {...rest} />
			)
		}
	}
	/*
	 * Mira el segundo parámetro "ref" suministrado por React.forwardRef.
	 * Podemos pasarlo a MapaSvgInteractivo como una prop regular.
	 * por ejemplo: "forwardedRef" y puede ser agregado al "Component".
	*/
	return React.forwardRef((props, ref) => {
		return <MapaSvgInteractivo {...props} forwardedRef={ref} />
	});
}

export default mapaSvgInteractivo(ReactSVGPanZoom);