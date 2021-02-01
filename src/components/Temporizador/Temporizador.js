import React, {
	useRef,
	useState,
	useEffect,
} from 'react';

/* Style */
import cx from 'classnames';
import style from './temporizador.css';

const Temporizador = ({ seg, refTimeLeft, timeEnd = () => {} }) => {
	/*
	 * Las unidades son relativas a la ventana gráfica.
	 * Calcular el radio:
	 * R = (120 / 2) - (6 / 2) = 57
	 *
	 * Totalidad de la circunferencia del temporizador (círculo):
	 *
	 * 2 * π * R  = C
	 * 2 * π * 57 ≈ 358.141
	 */
	const strokeDasharray = 359;

	const _circle = useRef(null);
	const idInterval = useRef(null);
	const [ tiempoRestante, setTiempoRestante ] = useState((seg && seg > 0) ? --seg : 0);

	useEffect(() => {
		idInterval.current = setInterval(() => {
			setTiempoRestante((prevState) => {
				let newState = --prevState;
				let porcentajeRestante = newState * 100 / seg;
				let strokeDashoffset = strokeDasharray * ((100 - porcentajeRestante) / 100);
				_circle.current.style.strokeDashoffset = strokeDashoffset;
				return newState
			})
		}, 1000)
		return () => {
			clearInterval(idInterval.current);
		}
	}, [])

	useEffect(() => {
		if(tiempoRestante <= 0) {
			timeEnd();
			clearInterval(idInterval.current);
		}
		if(refTimeLeft) refTimeLeft.current = tiempoRestante;
	}, [tiempoRestante])

	return(
		<div className={style.temporizador} >
			<span className={style.tiempo} >
				{('0' + Math.floor(tiempoRestante / 60)).slice(-2)}
				{':'}
				{('0' + Math.floor(tiempoRestante % 60)).slice(-2)}
			</span>
			<svg width="120" height="120" viewBox="0 0 120 120">
				<circle ref={_circle} cx="60" cy="60" r="57" fill="none" strokeWidth="6" />
			</svg>
		</div>
	)
}

export default Temporizador;