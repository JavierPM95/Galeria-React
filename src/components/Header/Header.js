import React, {
	useRef,
	useState,
	Fragment,
	useEffect,
} from 'react';
import slugify from 'slugify';
import { useLocation, Redirect, useHistory, NavLink } from 'react-router-dom';

/* context */
import connect from '../../context/connect';

/* config */
import { ASSETS_URL } from '../../config.js';

/* style */
import cx from 'classnames';
import style from './header.css';

/* Actions */
import { logout, handleOpenLogin } from '../../actions/loginAction';

/* Components */
import Icon from '../Icon';
import Navbar from '../Navbar';
import NavItem from '../NavItem';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Buscador from '../Buscador/Buscador';
import Categorias from './Categorias/Categorias';
import RedesSociales from './RedesSociales/RedesSociales';

const Header = ({user, evento, mobileActive, logout, triggerOpenLogin, handleOpenLogin, ...props}) => {
	const location = useLocation();
	const history = useHistory();
	const _navbar = useRef(null);
	const [ openLogin, setOpenLogin ] = useState(false);
	const [ colorIcons, setColorIcons ] = useState('white');
	const [ openSidenav, setOpenSidenav ] = useState(false);
	const [ openBuscador, setOpenBuscador ] = useState(false);
	const [ scrollActive, setScrollActive ] = useState(false);
	const [ openRegister, setOpenRegister ] = useState(false);
	const [ styleInlineNav, setStyleInlineNav ] = useState({});
	const [ classNameFixed, setClassNameFixed ] = useState('');
	const [ logo, setLogo ] = useState('ttde-logo-white.png');
	const [ offsetsNavbar, setOffsetsNavbar ] = useState({
		paddingTop: '90px'
	});
	
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		user && handleActionForm(null, null, true);
	}, [user])

	useEffect(() => {
		handleActionForm(null, null, true);
	}, [location])

	useEffect(() => {
		const updateLogo = (scrollActive && !evento.bandaImagenUrl) ? 
					'ttde-logo-black.png' :
					'ttde-logo-white.png';
		setLogo(updateLogo);
	}, [scrollActive, evento]);

	useEffect(() => {
		setColorIcons((scrollActive || mobileActive) ? 'black' : 'white');
	}, [scrollActive, mobileActive]);

	useEffect(() => {
		if(triggerOpenLogin) {
			handleActionForm(null, 'login');
		}
	}, [triggerOpenLogin]);

	const handleScroll = () => {
		setScrollActive(window.scrollY > 100);
		setOpenRegister(false)
		setOpenLogin(false);
		setOpenBuscador(false);
	}

	useEffect(() => {
		if(evento.bandaImagenUrl) {
			setStyleInlineNav({
				backgroundImage: `url(${ASSETS_URL+evento.bandaImagenUrl})`
			})
		} else {
			setStyleInlineNav({})
		}
	}, [evento])

	useEffect(() => {
		setClassNameFixed((prevState) => {
			return(`${cx(
				{scrollActive}, // clase sass ref => _navbar.scss
				style.navbarFixedTtde,
				{[`${style.webShow}`]: !evento.isEmpty},
				{[`${style.portal}`]: location.pathname == '/'},
				{[`${style.navBgEvento}`]: evento.bandaImagenUrl},
				{[`${style.scrollActive}`]: scrollActive && !evento.bandaImagenUrl},
			)}`)
		})
	}, [evento, location, scrollActive])

	useEffect(() => {
		updateOffsetsNavbar();
	})

	useEffect(() => {
		updateOffsetsNavbar();
	})

	function updateOffsetsNavbar() {
		setOffsetsNavbar((prevState) => {
			const height = document.querySelector('.nav-wrapper').clientHeight;
			let paddingTop = `${(height < 90) ? 90 : height}px`;
			return (paddingTop != prevState.paddingTop) ? { paddingTop } : prevState;
		})
	}

	/**
	 * Controla las acciones que abren o cierran los formularios
	 * de login y registro.
	 * @param {Event} $e Objeto del evento
	 * @param {Boolean} $forceClose fuerza a cerrar el formulario que esté abierto
	 * @param {String} $action acción que se desea realizar
	 * las acciones permitidas son:
	 *
	 * - dasboard: redirige a un usuario logeado a su panel de administración
	 * - logout: cierra la sesión de un usuario logueado
	 * - [register, login, buscar]: cambia al estado opuesto (abierto o cerrado)
	 * 
	 * Post condición: nunca estarán abiertos ambos formularios al mismo tiempo
	 */
	const handleActionForm = (e, action, forceClose = false) => {
		if(forceClose) {
			setOpenRegister(false);
			setOpenLogin(false);
			setOpenBuscador(false);
			return;
		}

		if(triggerOpenLogin) handleOpenLogin();

		e && e.stopPropagation();
		if(action == 'dashboard') return history.push("/dashboard");
		if(action == 'logout') return logout();
		setOpenRegister((prevState) => action === 'register' && !prevState)
		setOpenLogin((prevState) => action === 'login' && !prevState)
		setOpenBuscador((prevState) => action === 'buscar' && !prevState)
	}

	const Sidenav = () => {
		return(
			<Fragment>
				<RedesSociales/>
				<Categorias/>

				<div className={style.navMobileForm} >
					{ mobileActive && renderIconBuscador() }
					{ (!user || !mobileActive) ? null : renderIconTicketera() }
					{ (openLogin || !mobileActive) ? null : renderIconAccount() }
					{ (!user || openLogin || !mobileActive) ? null : renderIconLogout() }
					{ (user || !mobileActive) ? null : renderContentLogin() }
					{ (!mobileActive) ? null : renderRegister() }
					{ (!mobileActive) ? null : renderBuscador() }
				</div>
			</Fragment>
		)
	}

	const renderRegister = () => {
		return(
			<Register
				open={openRegister}
				sidenav={mobileActive}
				handleToggleAccount={handleActionForm}
				className={cx({'scale-1': openRegister})}
			/>
		)
	}

	const renderContentLogin = () => {
		return(
			<div
				className={cx(
					style.tuTicketeraContent,
					{'scale-1': openLogin},
					'z-depth-3'
				)}
			>
				<Login
					open={openLogin}
					sidenav={mobileActive}
					handleCreateAccount={handleActionForm}
				/>
			</div>
		)
	}

	const renderIconTicketera = () => {
		return(
			<span
					className={cx(
						style.iconTicketera,
						{[`${style.mobile}`]: (openSidenav)},
						{[`${style.black}`]: (!evento.bandaImagenUrl && scrollActive || openSidenav)},
						{[`${style.openLogin}`]: openLogin},
						'trigger-scale'
					)}
					onClick={(e) => handleActionForm(e, 'dashboard')}
				>
				<span className={style.lineTop} ></span>
				<span className={style.lineBottom} ></span>
			</span>
		)
	}

	const renderIconBuscador = () => {
		return(
			<li className={cx(
				style.iconBuscador,
				{[`${style.mobile}`]: (mobileActive)}
			)} >
				<NavItem onClick={(e) => handleActionForm(e, 'buscar')} >
					<Icon>
						search
					</Icon>
				</NavItem>
			</li>
		)
	}

	const renderIconAccount = () => {
		const action = (user) ? 'register' : 'login';
		return(
			<li
				onClick={(e) => handleActionForm(e, action, openRegister)}
				className={cx(
					style.navItemLogin,
					{[`${style.mobile}`]: (openSidenav)},
					{[`${style.black}`]: (!evento.bandaImagenUrl && scrollActive || openSidenav)},
				)}
			>
				<Icon className={cx('trigger-scale', style.iconLogin)} >
					account_circle
				</Icon>
			</li>
		)
	}

	const renderIconLogout = () => {
		return(
			<li
				onClick={(e) => handleActionForm(e, 'logout')}
				className={cx(
					style.navItemLogout,
					{[`${style.mobile}`]: (openSidenav)},
					{[`${style.black}`]: (!evento.bandaImagenUrl && scrollActive || openSidenav)},
				)}
			>
				<Icon className={cx('trigger-scale', style.iconLogout)} >
					exit_to_app
				</Icon>
			</li>
		)
	}

	const renderBuscador = () => {
		return(
			<div className={cx(
				style.buscadorContent,
				{'scale-1': openBuscador},
				'z-depth-3'
			)}>
				<Buscador open={openBuscador} />
			</div>
		)
	}

	return(
		<Fragment>
			<Navbar
				ref={_navbar}
				brand={<a onClick={
					() => history.push('/')
				} ><img src={`/img/${logo}`} alt=""/></a>}
				fixed
				sidenav={<Sidenav/>}
				classNameFixed={classNameFixed}
				options={{
					onOpenStart: () => setOpenSidenav(true),
					onCloseStart: () => setOpenSidenav(false)
				}}
				style={styleInlineNav}
			>
			{ (evento.isEmpty) ? null :
				<li className={cx(
							style.navEvento,
							{[`${style.scrollActive}`]: scrollActive},
							{[`${style.black}`]: scrollActive && !evento.bandaImagenUrl}
						)} >
					<div
						className={style.infoBanda}
						onClick={() => {
							history.push(`/evento/${evento.id}/${slugify(evento.tituloEvento)}`);
						}}
						>
						<p>{ evento.tituloEvento }</p>
						<p>{ evento.nombreRecinto }</p>
					</div>
				{ (!evento.fechaSeleccionada) ? null :
					<div className={cx(style.fechaSeleccionada)} >
						<span className={style.diaTexto} >{evento.fechaSeleccionada.diaTexto}</span>
						<span className={style.diaNumero} >{evento.fechaSeleccionada.diaNumero}</span>
						<span className={style.mesHora} >
							<span>{evento.fechaSeleccionada.mesTextoCorto}</span>
							{' - '}
							{evento.fechaSeleccionada.hora}{'hs'}
						</span>
					</div>
				}
				</li>
			}


			{ (!evento.isEmpty) ? null : <RedesSociales/> }

			{ (!evento.isEmpty) ? null : <Categorias/> }

			{ !mobileActive &&  renderIconBuscador() }

			{ (user && !mobileActive) && renderIconTicketera() }

			{ !mobileActive &&  renderIconAccount() }

			{ (user && !mobileActive) ? renderIconLogout() : null }

			{ (user) ?
				<li className='nav-username' >
					<p>{ user.nombres }</p>
				</li> : null
			}

			{ (user || mobileActive) ? null : renderContentLogin() }

			{ (mobileActive) ? null : renderRegister() }

			{ (mobileActive) ? null : renderBuscador() }
			</Navbar>
			{ (location.pathname == '/') ? null :
				// offsets-navbar
				<div style={offsetsNavbar} ></div>
			}
		</Fragment>
	)
}

const mapStateToProps = (store) => ({
	evento: store.evento,
	user: store.login.user,
	triggerOpenLogin: store.login.triggerOpenLogin,
});

const mapDispathToProps = (dispath, store) => ({
	logout: () => dispath(logout()),
	handleOpenLogin: () => dispath(handleOpenLogin(store)),
});

export default connect(mapStateToProps, mapDispathToProps)(Header);