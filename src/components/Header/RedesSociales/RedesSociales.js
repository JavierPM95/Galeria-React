import React, {
	useState,
	useEffect
} from 'react';
import { useLocation } from 'react-router-dom';

/* style */
import cx from 'classnames';
import style from './redesSociales.css';

/* CustomHooks */
import { useWindowSize } from '../../customHooks';

const RedesSociales = (props) => {
	const [ scrollActive, setScrollActive ] = useState(false);
	const windowSize = useWindowSize();
	const location = useLocation();
	const [ mobileActive, setMobileActive ] = useState(windowSize.width < 993);
	const [ colorIcons, setColorIcons ] = useState('white');
	const [ socialIcons, setSocialIcons ] = useState({
		black: {
			facebook: 'facebook-black.svg',
			twitter: 'twitter-black.svg',
			instagram: 'instagram-black.svg'
		},
		white: {
			facebook: 'facebook-white.svg',
			twitter: 'twitter-white.svg',
			instagram: 'instagram-white.svg'
		}
	});

	useEffect(() => {
		setMobileActive(windowSize.width < 993);
	}, [ windowSize ]);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		setColorIcons((scrollActive || mobileActive) ? 'black' : 'white');
	}, [scrollActive, mobileActive]);

	const handleScroll = () => {
		setScrollActive(window.scrollY > 100);
	}

	return(
		<li >
			<div className={cx(style.contentRedesSociales)} >
				<a target='_blank' href='https://twitter.com/tuticketdeentra' className={style.boxIcon} >
					<img src={`/img/icons/${socialIcons[colorIcons].twitter}`} alt=""/>
				</a>
				<a target='_blank' href='https://www.facebook.com/TuTicketDeEntradaa' className={cx(style.boxIcon)} >
					<img src={`/img/icons/${socialIcons[colorIcons].facebook}`} alt=""/>
				</a>
				<a target='_blank' href='https://www.instagram.com/tuticketdeentrada/?hl=es-la' className={cx(style.boxIcon)} >
					<img src={`/img/icons/${socialIcons[colorIcons].instagram}`} alt=""/>
				</a>
			</div>
		</li>
	)
}

export default RedesSociales;