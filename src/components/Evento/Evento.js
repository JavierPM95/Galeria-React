import React, {
	lazy,
	Suspense,
	useEffect,
	useState,
	useRef,
	Fragment
} from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';

/* Components */
import TextInput from '../TextInput';
import Loading from '../Loading/Loading';
const YouTube = lazy(() => {
	return import(/* webpackChunkName: 'YouTube' */'../YouTube/YouTube')
});
const Carousel = lazy(() => {
	return import(/* webpackChunkName: 'Carousel' */'../Carousel/Carousel')
});
const Promociones = lazy(() => {
	return import(/* webpackChunkName: 'Promociones' */'./Promociones/Promociones')
});
const NotFoundPage = lazy(() => {
	return import(/* webpackChunkName: 'NotFoundPage' */'../NotFoundPage/NotFoundPage')
});
const MetodosDePago = lazy(() => {
	return import(/* webpackChunkName: 'MetodosDePago' */'./MetodosDePago/MetodosDePago')
});
const FechaDisponiple = lazy(() => {
	return import(/* webpackChunkName: 'FechaDisponiple' */'./FechaDisponiple/FechaDisponiple')
});
const ValoresDeReferencia = lazy(() => {
	return import(/* webpackChunkName: 'ValoresDeReferencia' */'./ValoresDeReferencia/ValoresDeReferencia')
});

/* Style */
import style from './evento.css';
import cx from 'classnames';

/* utils */
import httpClient from '../../utils/axios';

/* Actions */
import { setEvento, resetEvento, buyTicket } from '../../actions/eventoAction';

/* config | constants */
import { ASSETS_URL } from '../../config.js';
import { STARTING_PURCHASE } from '../../constants';

/* connect */
import connect from '../../context/connect';

const Evento = ({ setEvento, resetEvento, evento, isFetching, startingPurchase, buyTicket, ...props }) => {
	const params = useParams();
	const history = useHistory();
	const location = useLocation();
	const _contentVideo = useRef(null);
	const [ emailNewsletter, setEmailNewsletter ] = useState('');
	const [ socialIcons, setSocialIcons ] = useState({
		black: {
			facebook: 'facebook-black.svg',
			twitter: 'twitter-black.svg',
			instagram: 'instagram-black.svg',
			youtube: 'youtube-black.svg'
		},
		white: {
			facebook: 'facebook-white.svg',
			twitter: 'twitter-white.svg',
			instagram: 'instagram-white.svg',
			youtube: 'youtube-white.svg'
		}
	});

	useEffect(() => {
		if(!isFetching) {
			setEvento({...params, history});
		}
		return () => {
			resetEvento();
		}
	}, [location])

	useEffect(() => {
		if(startingPurchase) {
			history.push('/comprar/asientos');
		}
	},[startingPurchase])

	const handleSubmit = async (e) => {
		e.preventDefault();
		let error = 0;

		if(!emailNewsletter) {
			M.toast({
				html: 'El email es requerido',
				classes:`black-text red`
			});
			error++;
		} else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailNewsletter)) {
			M.toast({
				html: 'Email invalido',
				classes:`black-text red`
			});
			error++;
		}
			
		if(!error) {
			const formData = new FormData();
			formData.append('email', emailNewsletter);
			formData.append('eventId', evento.id);
			const { data } = await httpClient.apiPost('subscribirse', formData);
			if(data.status == 200) {
				M.toast({
					html: 'suscripción exitoso',
					classes:`black-text green`
				});
				setEmailNewsletter('');
			} else {
				M.toast({
					html: 'Ocurrió un error. Por favor intente nuevamente',
					classes:`black-text yellow`
				});
			}
		}
	}

	const handleInput = (e) => {
		setEmailNewsletter(e.target.value);
	}

	const handleBuyTicket = (data) => {
		buyTicket(data);
	}

	return(
		<div className={style.evento} >
		{ (evento.isEmpty) ? <Loading/> :
				<Suspense fallback={<Loading/>} >
						<div className={cx('row', style.contenedor)} >
							<div className="col s12">
								<h2 className={style.fechaTitulo} >Fechas Disponibles</h2>
								<p className={style.fechaDesde} >15 al 21 de marzo</p>
							</div>
						</div>
						<div className={cx('row', style.contenedor)} >
							<div className={style.colFechasDisponibles}>
								<div className={style.fechasListado} >
								{
									evento.fechasDisponibles.map((fecha, key) => (
										<FechaDisponiple
											key={key}
											data={fecha}
											colorTexto={evento.colorTexto}
											handleBuyTicket={handleBuyTicket}
											colorOcupado={evento.colorOcupado}
											nombreRecinto={evento.nombreRecinto}
											colorDisponible={evento.colorDisponible}
											capacidadEvento={evento.capacidadEvento}
										/>
									))
								}
								</div>
							</div>

							<div className={style.lineaVertical} ></div>

							<div className={style.colMediosDePago} >
							{ (evento.promociones && !evento.promociones.length) ? null :
								<Promociones tjs={evento.promociones} />
							}
							{ (!evento.mediosDePago) ? null :
								<MetodosDePago metodos={evento.mediosDePago} />
							}
							</div>
						</div>

						<div className={cx(style.contentReferencias)} >
							<div className={cx('row', style.contenedor)}>
								<ValoresDeReferencia
									titulo={evento.nombreRecinto}
									valores={evento.sectores}
									mapaSVG={evento.svgAsientos}
								/>
							</div>
						</div>

						{ evento.bandaImagenUrl &&
							<div style={{backgroundImage: `url(${ASSETS_URL+evento.bandaImagenUrl})`}} className={style.seccionRedes} >
								{ evento.bandaTwitter &&
									<a target='_blank' href={evento.bandaTwitter} className="box-icon">
										<img src={`/img/icons/${socialIcons['white'].twitter}`} alt=""/>
									</a>
								}
								{ evento.bandaFacebook &&
									<a target='_blank' href={evento.bandaFacebook} className="box-icon facebook">
										<img src={`/img/icons/${socialIcons['white'].facebook}`} alt=""/>
									</a>
								}
								{ evento.bandaInstagram &&
									<a target='_blank' href={evento.bandaInstagram} className="box-icon instagram">
										<img src={`/img/icons/${socialIcons['white'].instagram}`} alt=""/>
									</a>
								}

								{ evento.bandaYoutube &&
									<a target='_blank' href={evento.bandaYoutube} className="box-icon youtube">
										<img src={`/img/icons/${socialIcons['white'].youtube}`} alt=""/>
									</a>
								}
							</div>
						}

						<div className={cx('row', style.contenedor, style.sobreLaBanda)} >
							<article
								ref={_contentVideo}
								className={cx('col', 's12', {'l8': evento.noticias.length})}
							>
							{ (!evento.sobreLaBanda && !evento.videoBandaUrl) ? null :
								<h2 className={style.titulo} >Sobre la banda</h2>
							}
							{ (!evento.sobreLaBanda) ? null :
								evento.sobreLaBanda.map((p, key) => (<p key={key} >{p}</p>))
							}

							{ (!evento.videoBandaUrl) ? null :
								<Fragment>
									<h2 className={style.tituloVideo} >último vídeo</h2>
									<YouTube
										content={_contentVideo}
										videoId={evento.videoBandaUrl}
									/>
								</Fragment>
							}
							</article>

							<aside className={cx('col', 's12', 'l4', 'row')} >
							{ (!evento.noticias.length) ? null :
								<article className={cx(style.noticias)} >
									<h2>últimas noticias</h2>
									<div className='linea-titulo' ></div>
									{
										evento.noticias.map((el, key) =>
											<a key={key} target='_blank' href={el.linkNoticia} >
												<img src={ASSETS_URL+el.imagenUrl} alt=""/>
											</a>
										)
									}
								</article>
							}
							{
								<article className={cx('col', 's12', style.newsletter)} >
									<div className={style.headerNew} >
										<h4>suscribirse al newsletter</h4>
										<img src="/img/ttde-isotipo.jpg" alt=""/>
									</div>
									<div className='linea-titulo' ></div>
									<p>Te enviaremos toda la información sobre tus eventos favoritos.</p>
									<form onSubmit={handleSubmit} >
										<TextInput
											s={12}
											name='emailNewsletter'
											value={emailNewsletter}
											type='text'
											onChange={handleInput}
											label={'Ingresa tu email aquí...'}
											validate
											required
										/>
										<button
											className={cx('btn-flat', 'btn-primary', 'right')}
										>» ENVIAR</button>
									</form>
								</article>
							}
							</aside>
						</div>

						{ (!evento.recintoHistoria) ? null :
							<div
								className={style.infoDelRecinto}
							>
							{ (!evento.recintoCabeceraUrl) ? null :
								<img src={ASSETS_URL+evento.recintoCabeceraUrl} alt=""/>
							}

								<div className={style.contenedor} >
									<div className={cx('col', 's12')}>
									{
										<h2 className={style.titulo} >{evento.recintoTitulo}</h2>
									}
									{ (!evento.recintoHistoria) ? null :
										<Fragment>
											<h2>historia</h2>
											<div className='linea-titulo' ></div>
											{evento.recintoHistoria.map((p, key) => (<p key={key} >{p}</p>))}
										</Fragment>
									}
									</div>
								</div>
							</div>
						}

						{ (!evento.eventosDeInteres.length) ? null :
							<div className={style.otrosEventos} >
								<h2>TAMBIÉN TE PUEDE INTERESAR</h2>
								<Carousel
									childrens={evento.eventosDeInteres}
									options={{
										numVisible: 5,
										imageTopTextButtom: true
									}}
								/>
							</div>
						}
				</Suspense>
		}
		</div>
	)
}

const mapStateToProps = (store) => ({
	evento: store.evento,
	isFetching: store.evento.isFetching,
	startingPurchase: store.evento.startingPurchase
});

const mapDispatchToProps = (dispatch) => ({
	setEvento: (param) => dispatch(setEvento(param, dispatch)),
	resetEvento: () => dispatch(resetEvento()),
	buyTicket: (data) => dispatch(buyTicket(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Evento);