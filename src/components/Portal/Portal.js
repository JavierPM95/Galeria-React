import React, {
	useState,
	Fragment,
	Suspense,
	useEffect,
	lazy
} from 'react';
import { NavLink } from 'react-router-dom';
import slugify from 'slugify';

/* Components */
const Carousel = lazy(() => {
	return import( /*webpackChunkName: 'Carousel' */'../Carousel/Carousel')
});
const Banners = lazy(() => {
	return import( /*webpackChunkName: 'Banners' */'./Banners/Banners')
});
import Loading from '../Loading/Loading';

/* utils */
import httpClient from '../../utils/axios';

/* config */
import { ASSETS_URL } from '../../config.js';

/* Style */
import './portal.scss'
import cx from 'classnames';

function Portal() {
	const [ banners, setBanners ] = useState([]);
	const [ destacados, setDestacados ] = useState([]);
	const [ todoeventos, setTodoeventos ] = useState([]);
	const [ proximamente, setProximamente ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(true);

	useEffect(() => {
		const getBanners = httpClient.apiGet('banners');
		const getDestacados = httpClient.apiGet('destacados');
		const getTodoeventos = httpClient.apiGet('todoeventos');
		const getProximamente = httpClient.apiGet('proximamente');
		
		Promise.all([
			getBanners,
			getDestacados,
			getTodoeventos,
			getProximamente
		]).then(responses => {
			const {
				0: resBanners,
				1: resDestacados,
				2: resTodoeventos,
				3: resProximamente
			} = responses;

			setBanners(resBanners.data);
			setDestacados(resDestacados.data);
			setTodoeventos(resTodoeventos.data);
			setProximamente(resProximamente.data);
			setIsLoading(false);
		})

	}, [])

	const handleHover = (e) => {
		const btnHover = e.currentTarget.lastChild;
		switch (e.type) {
			case 'mouseenter':
				btnHover.classList.add('active');
				break;
			case 'mouseleave':
				btnHover.classList.remove('active');
				break;
			case 'touchstart':
				btnHover.classList.add('active');
				setTimeout(() => btnHover.classList.remove('active'), 4000);
				break;
		}
	}

	return( (isLoading) ? <Loading/> :
	<Suspense fallback={<Loading/>} >
		<div className="wrapper-portal">

		{
			(banners.length) ? <Banners bannersData={banners} /> :
			<Fragment>
				<div className="offsets-navbar"></div>
				<h5 className='center'>No hay eventos</h5>
			</Fragment>
		}

		{ (!destacados.length) ? <h5 className='center'>No hay eventos</h5> :
			<div className="wrapper-destacados-chicos">
				<h2 className='title'>Eventos Destacados</h2>
					<Carousel
						childrens={destacados}
						options={{
							numVisible: 3,
							imageLeftTextRight: true
						}}
					/>
			</div>
		}

		{ (!todoeventos.length) ? <h5 className='center'>No hay eventos</h5> :
			<div className="wrapper-eventos-todos">
			{
				todoeventos.map((child) => {
					const imagenUrl = (child.imagenUrl) ?
							ASSETS_URL+child.imagenUrl :
							'https://via.placeholder.com/300';
					return(
						<article
							key={child.id}
							className="box-evento"
							onMouseEnter={handleHover}
							onMouseLeave={handleHover}
							onTouchStart={handleHover}
						>
							<img src={imagenUrl} alt=""/>
							<NavLink className='btn-hover' to={`/evento/${child.eventoId}/${slugify(child.tituloEvento)} `} >
								<button className='waves-effect waves-light btn' >Comprar</button>
							</NavLink>
						</article>
					)
				})
			}
			</div>
		}

		{ (!proximamente.length) ? <h5 className='center'>No hay eventos</h5> :
			<div className="wrapper-proximamente">
				<h2 className='title'>Próximamente</h2>
				<Carousel
					childrens={proximamente}
					options={{
						numVisible: 5,
						imageTopTextButtom: true
					}}
				/>
			</div>
		}

			<div className="wrapper-catalogo">
				<h1>Explora nuestro catálogo de eventos</h1>
				<div className="catalogo">
					<article className="flex-item">
						<img src="img/catalogo/musica.jpg" alt=""/>
						<NavLink exact to='/categoria/musica' >
							música
						</NavLink>
					</article>

					<article className="flex-item">
						<img src="img/catalogo/teatro.jpg" alt=""/>
						<NavLink exact to='/categoria/teatro' >
							teatro
						</NavLink>
					</article>

					<article className="flex-item">
						<img src="img/catalogo/cine.jpg" alt=""/>
						<NavLink exact to='/categoria/cine' >
							cine
						</NavLink>
					</article>

					<article className="flex-item">
						<img src="img/catalogo/familia.jpg" alt=""/>
						<NavLink exact to='/categoria/familia' >
							familia
						</NavLink>
					</article>

					<article className="flex-item">
						<img src="img/catalogo/especiales.jpg" alt=""/>
						<NavLink exact to='/categoria/especiales' >
							especiales
						</NavLink>
					</article>
				</div>
			</div>
		</div>
	</Suspense>
	)
}

export default Portal;