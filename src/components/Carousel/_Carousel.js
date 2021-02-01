import React, {
	useRef,
	useEffect,
	useState,
	Fragment
} from 'react';
import cx from 'classnames';

/* components */

/* Style */
import './carousel.scss';

const Carousel = (props) => {
	const {
		childrens,
		options: {
			numVisible,
			imageLeftTextRight,
			imageTopTextButtom
		}
	} = props;
	const _carousel = useRef(null);
	const _carouselContent = useRef(null);
	const _arrowNext = useRef(null);
	const _arrowPrev = useRef(null);
	const [style, setStyle] = useState(null);
	const [widthWindow, setWidthWindow] = useState(window.innerWidth);
	const [intervalId, setIntervalId] = useState(null);

	useEffect(() => {
		setStyle((prevState) => {
			const newState = { ...prevState };
			const marginRight = (widthWindow < 768) ? 20 : 50;
			if(imageLeftTextRight) {
				newState.flexBasis = (widthWindow < 768) ?`${(100 / 2)}%` : `${(100 / numVisible)}%`;
			}

			if(imageTopTextButtom) {
				newState.flexBasis = (widthWindow < 768) ?
						`calc((100% - ${marginRight}px) / 2)` :
						`calc((100% - ${numVisible * marginRight}px) / ${numVisible})`;
				newState.marginRight = `${marginRight}px`;
			}
			return newState;
		})
	}, [numVisible, widthWindow]);

	useEffect(() => {
		window.addEventListener("resize", updateWidthWindow);
		return () => window.removeEventListener("resize", updateWidthWindow);
	});

	useEffect(() => {
		if(_carouselContent) {
			restartArrows();
		}
	}, [_carouselContent])

	const updateWidthWindow = () => {
		setWidthWindow(window.innerWidth);
	};

	const handleHoverArrows = (e, action) => {
		switch (e.type) {
			case 'touchstart':
			case 'mouseenter':
				setIntervalId(setInterval(() => {
					interval(action);
				}, 100))
				break;
			case 'mouseleave':
			case 'touchend':
				restartArrows();
				clearInterval(intervalId);
				break;
		}
	}

	const interval = (action) => {
		_carouselContent.current.scroll({
			top: 0,
			left: _carouselContent.current.scrollLeft + action,
			behavior: 'smooth'
		})
		restartArrows();
	}

	const restartArrows = () => {
		/*
		 * calcular la cantidad de items visibles
		 * Para mobile por modulo son:
		 * imageTopTextButtom => 2 items
		 * imageLeftTextRight => 1 items
		 * Los valore pára desktop vienen en las props
		*/
		const itemsVisible = (childrens.length < numVisible) ? childrens.length : 
				(widthWindow >= 768) ? numVisible : (imageLeftTextRight) ? 1 : 2;

		const marginRight = (widthWindow < 768) ? 20 : 35;

		/* determinar el ancho de los items dependiendo el tipo de modulo renderizado */
		const	width = (imageTopTextButtom) ?
			(_carousel.current.firstChild.offsetWidth + marginRight) :
			_carousel.current.firstChild.offsetWidth;

		const maxScrollRight = width * (childrens.length - itemsVisible);

		if (_carouselContent.current.scrollLeft >= maxScrollRight) {
			_arrowNext.current.classList.add('opacity-0')
		} else {
			_arrowNext.current.classList.remove('opacity-0')
		}

		if (_carouselContent.current.scrollLeft == 0) {
			_arrowPrev.current.classList.add('opacity-0');
			_carousel.current.classList.remove('left-scroll')
		} else {
			_arrowPrev.current.classList.remove('opacity-0')
			_carousel.current.classList.add('left-scroll')
		}

		if(childrens.length < numVisible) {
			_arrowNext.current.classList.add('opacity-0')
			_arrowPrev.current.classList.add('opacity-0')
		}
	}

	const renderChildrens = () => {
		if (imageLeftTextRight) {
			return(
				childrens.map((child) => (
					<article
						key={child.id}
						style={style}
						className="carousel-item thumbnail-left-text-right"
					>
						<div className="thumbnail">
							<img src={'https://gallbers.uy/ttde/paul-mccartney.jpg'} alt=""/>
						</div>
						<div className="text">
							<div className="info">
								<span className='date'>{ child.tituloFecha }</span>
								<h2 className='title-show'>{ child.tituloEvento }</h2>
								<span className='location'>{ child.nombreRecinto }</span>
								<a href="#">» ver evento</a>
							</div>
							<div className="line-right"></div>
						</div>
					</article>
				))
			);
		}

		if(imageTopTextButtom) {
			return(
				childrens.map((child) => {
					return(
						<article
							key={child.id}
							className="carousel-item thumbnail-top-text-bottom"
							style={style}
						>
							<img src={child.imgUrl} alt=""/>
							<div className="text-info">
									<h2 className='title-show'>{ child.title }</h2>
									<a href="#">+ Info</a>
							</div>
						</article>
					)
				})
			)
		}

		return null;
	}

	return( renderChildrens() &&
		<div className="wrapper-carousel">
			{ (true) ? 
				<span
					ref={_arrowPrev}
					onMouseEnter={(e) => handleHoverArrows(e, -20)}
					onTouchStart={(e) => handleHoverArrows(e, -20)}
					onMouseLeave={(e) => handleHoverArrows(e)}
					onTouchEnd={(e) => handleHoverArrows(e)}
					className="arrow-left"></span> : null
			}
			{ (true) ?
				<span
					ref={_arrowNext}
					onMouseEnter={(e) => handleHoverArrows(e, 20)}
					onTouchStart={(e) => handleHoverArrows(e, 20)}
					onMouseLeave={(e) => handleHoverArrows(e)}
					onTouchEnd={(e) => handleHoverArrows(e)}
					className="arrow-right"></span> : null
			}
			<div ref={_carouselContent} className="corousel-content">
				<div ref={_carousel} data-translate='0' className={cx('carousel', {imageLeftTextRight})}>
					{ renderChildrens() }
				</div>
			</div>
		</div>
	)
}

export default Carousel;