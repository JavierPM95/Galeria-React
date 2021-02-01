import React, {
	useRef,
	useState,
	Fragment,
	useEffect,
} from 'react';
import ReCAPTCHA from "react-google-recaptcha";

/* Components */
import TextInput from '../TextInput';
import Preloader from '../Preloader';
import FacebookLogin from '../FacebookLogin/FacebookLogin';
import GoogleLogin from '../GoogleLogin/GoogleLogin';

/* Actions */
import { setUser, restartErrorLogin } from '../../actions/loginAction';

/* utils */
import httpClient from '../../utils/axios';
import { SITE_KEY_RECAPTCHA } from '../../config';

/* connect */
import connect from '../../context/connect';

/* Style */
import style from './login.css';
import cx from 'classnames';

const Login = ({
	open,
	sidenav,
	setUser,
	errorMsj,
	isLoginLoading,
	restartErrorLogin,
	handleCreateAccount,
}) => {
	const _recaptcha = useRef(null);
	const [recaptchaValue, setRecaptchaValue] = useState(null);
	const [recoverPassword, setRecoverPassword] = useState(false);
	const [isLoginRecoverPassword, setIsLoginRecoverPassword] = useState(false);
	const [state, setState] = useState({
		email: '',
		password: ''
	});

	useEffect(() => {
		if(!open) {
			setRecaptchaValue(null);
			setRecoverPassword(false);
		}
	}, [open])

	useEffect(() => {
		if(errorMsj) {
			M.toast({html: errorMsj, classes:'red black-text'});
			setRecaptchaValue(null);
			_recaptcha.current && _recaptcha.current.reset();
			restartErrorLogin();
		}
	}, [errorMsj])

	const handleLogin = (e) => {
		e.preventDefault();

		let errors = 0;
		const { email, password } = state;
	
		if (!email) {
			M.toast({html: 'El email es requerido', classes:'red black-text'});
			errors++;
		} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
			M.toast({html: 'Email invalido', classes:'red black-text'})
			errors++;
		}

		if (!recaptchaValue) {
			M.toast({html: 'Complete el reto captcha', classes:'red black-text'})
			errors++;
		}

		if(!errors && recoverPassword) {
			setIsLoginRecoverPassword(true);
			const formData = new FormData();
			formData.append('email', email);
			httpClient.apiPost('cliente/recover-password', formData)
			.then(({ data }) => {
				setIsLoginRecoverPassword(false);
				if(data.status == 200) {
					M.toast({
						html: 'Revise su bandeja de mail',
						classes:'green black-text'
					})
				} else {
					M.toast({
						html: 'No existe ningún usuario con ese email',
						classes:'red black-text'
					})
				}
				_recaptcha.current.reset();
				setRecoverPassword(false);
			})
			return false;
		}

		if (!password) {
			M.toast({html: 'La contraseña es requerida', classes:'red black-text'})
			errors++;
		}


		if(!errors) {
			setUser({ email, password });
		}
	}

	const handleEmailField = (e) => {
		let email = e.target.value;
		setState((prev) => ({...prev, email}));
	};

	const handlePasswordField = (e) => {
		let password = e.target.value;
		setState((prev) => ({...prev, password}));
	};

	const onChangeRecaptcha = (e) => {
		setRecaptchaValue(e);
	}

	const handleRecoverPassword = () => {
		setRecoverPassword((prevState) => !prevState);
	}

	const renderInputs = () => {
		return(
			<Fragment>
			{ (recoverPassword) ?
				<p>Ingrese la dirección de email de su cuenta de usuario y le enviaremos un enlace para restablecer la contraseña.</p>
				:
				<h3>USUARIO</h3>
			}
				<TextInput
					s={12}
					value={state.email}
					type='email'
					onChange={handleEmailField}
					label='dirección de email'
					validate
					required
				/>

			{ (recoverPassword) ? null :
				<Fragment>
					<h3>CONTRASEÑA</h3>
					<TextInput
						s={12}
						value={state.password}
						type='password'
						onChange={handlePasswordField}
						validate
						required
					/>
				</Fragment>
			}
			</Fragment>
		)
	}

	return(
		<div className={cx(style.wrapperFormTicket)} >
			<form onSubmit={handleLogin}>
				<h2>ACCEDER A MI TICKET</h2>
				{renderInputs()}

				{ (!open) ? null :
					<ReCAPTCHA
						ref={_recaptcha}
						className={style.recaptcha}
						size={(sidenav) ? 'compact' : 'normal'}
						sitekey={SITE_KEY_RECAPTCHA}
						onChange={onChangeRecaptcha}
					/>
				}
				<p
					onClick={handleRecoverPassword}
					className={style.recoverPassword}
				>
				{ (recoverPassword) ?
					'Volver al login' : '¿Olvidaste tu contraseña?'
				}
				</p>
				
				{(isLoginLoading || isLoginRecoverPassword) ? 
						<Preloader active />
					:
						<input
							className='center waves-effect waves-light btn'
							type='submit'
							value={(recoverPassword) ? 'Recuperar contraseña' : 'INGRESAR'}
						/>
				}

			</form>


			{(isLoginLoading || isLoginRecoverPassword) ? null :
				<Fragment>
					<div className={style.wrapperLogin} >
						<span>O inicia sesión con:</span>
						<FacebookLogin/>
						<GoogleLogin />
					</div>
					<div className={style.lineDivider} ></div>

					<h4>¿Aún no estas registrado?</h4>
					<button
						className={cx('trigger-scale', 'center', 'btn', style.btnCreate)}
						onClick={(e) => handleCreateAccount(e, 'register')}
					>CREA TU CUENTA</button>

					<p onClick={(e) => handleCreateAccount(e, 'Login')} className={cx('trigger-scale', style.cancelar)} >CANCELAR</p>
				</Fragment>
			}

		</div>
	)
}

const mapStateToProps = (store) => ({
 isLoginLoading: store.login.isLoginLoading,
 errorMsj: store.login.errorMsj
});

const mapDispathToProps = (dispath) => ({
	setUser: (param) => dispath(setUser(param, dispath)),
	restartErrorLogin: () => dispath(restartErrorLogin())
});

export default connect(
	mapStateToProps,
	mapDispathToProps
)(Login);