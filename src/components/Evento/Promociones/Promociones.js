import React, {
	useEffect,
	useState
} from 'react';

/* config */
import { ASSETS_URL } from '../../../config.js';

/* Style */
import style from './promociones.css';
import cx from 'classnames';

const Promociones = ({tjs}) => {
	const [ totalTjs, setTotalTjs ] = useState(tjs.length);
	const [ indexTjActual, setIndexTjActual ] = useState(0);

	const handleToggle = (action) => {
		setIndexTjActual((prevState) => {
			let newState;
			if(action == -1) {
				if(prevState === 0) {
					newState = totalTjs - 1;
				} else {
					newState = --prevState;
				}
			} else if (action == 1) {
				if(prevState === (totalTjs - 1)) {
					newState = 0;
				} else {
					newState = ++prevState;
				}
			}
			return newState;
		})
	}
	
	return(
		<div className={style.contentPromociones} >
			<h2>Promociones Vigentes</h2>
			<div className='linea-titulo' ></div>
			<div className={style.contenedor} >
				<div onClick={() => handleToggle(-1)} className={cx(style.arrow, style.prev)} ></div>
				<div onClick={() => handleToggle(1)} className={cx(style.arrow, style.next)} ></div>
				<div className={style.carta} >
					<div className={cx(style.lado, style.front)} >
						<img src={ASSETS_URL+tjs[indexTjActual].imagenFrenteUrl} alt=""/>
					</div>
					<div className={cx(style.lado, style.back)} >
						<img src={ASSETS_URL+tjs[indexTjActual].imagenAtrasUrl} alt=""/>
					</div>
				</div>
			</div>
		</div>
	)
};

export default Promociones;