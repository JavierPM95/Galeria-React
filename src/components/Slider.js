import React, {
	useState,
	useEffect,
	useRef,
	Fragment
} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Slider = ({ children, className, options, fullscreen, arrows, ...props }) => {
	const sliderInstance = useRef(null);
	const _slider = useRef(null);
	const [intervalId, setIntervalId] = useState(null);
	const [activeIndex, setActiveIndex] = useState(null);
	const [widthProgress, setWidthProgress] = useState(0);
	const [widthWindow, setWidthWindow] = useState(window.innerWidth);
	const [
		intervalProgressBar,
		setIntervalProgressBar
	] = useState(options.intervalProgressBar || options.interval);

	useEffect(() => {
		const newOptions = {
			...options,
			interval: (10000000 + (intervalProgressBar || options.interval))
		}
		sliderInstance.current = M.Slider.init(_slider.current, newOptions);

		const indicators = sliderInstance.current['$indicators'] || [];
		for (let i = 0; i < indicators.length; i++) {
			indicators[i].addEventListener('click', resetWidthProgress);
		}

		return () => {
			if (sliderInstance.current) {
				const indicators = sliderInstance.current['$indicators'] || [];
				for (let i = 0; i < indicators.length; i++) {
					indicators[i].removeEventListener('click', resetWidthProgress);
				}
				setActiveIndex(sliderInstance.current.activeIndex);
				sliderInstance.current.destroy();
			}
		};
	}, [_slider, options, fullscreen]);

	useEffect(() => {
		if (activeIndex) {
			if (typeof indicators === 'undefined' || options.indicators) {
				sliderInstance.current['$indicators'][activeIndex].className =
					'indicator-item active';
			}
		}
	}, [activeIndex, options.indicators, fullscreen]);

	useEffect(() => {
		startProgressbar();
		return () => {
			clearInterval(intervalId);
		}
	}, [options, widthWindow]);

	const startProgressbar = () => {
		resetProgressbar();
		const interval = 100;
		const crecimiento = (widthWindow / ((intervalProgressBar + options.duration) / interval));
		setIntervalId(setInterval(() => {
			setWidthProgress((prevState) => (prevState + crecimiento));
		}, interval));
	}

	const resetProgressbar = () => {
		resetWidthProgress();
		clearInterval(intervalId);
		setIntervalId(null);
	}

	const resetWidthProgress = () => {
		sliderInstance.current && sliderInstance.current.start();
		setWidthProgress(0);
	}

	useEffect(() => {
		if(widthProgress >= widthWindow) {
			handleMoveSlider('next');
			setWidthProgress(0);
		}
	}, [ widthProgress ]);

	useEffect(() => {
		window.addEventListener("resize", updateWidthWindow);
		return () => window.removeEventListener("resize", updateWidthWindow);
	}, []);

	useEffect(() => {
		document.addEventListener("visibilitychange", updateVisibilitychange);
		return () => document.removeEventListener("visibilitychange", updateVisibilitychange);
	}, []);

	const updateVisibilitychange = (e) => {
		if (document.visibilityState === 'visible') {
			startProgressbar();
		} else {
			resetProgressbar();
			sliderInstance.current && sliderInstance.current.pause();
		}
	}

	const updateWidthWindow = () => {
		setWidthWindow(window.innerWidth);
	};

	/**
	 * If the slider was not in fullscreen, the height is set as a style attribute
	 * on the Slider element. When `.destroy()` is called, this attribute is not
	 * removed, resulting in a fullscreen displayed incorrectly.
	 */
	useEffect(() => {
		if (fullscreen) {
			_slider.current.removeAttribute('style');
			_slider.current.childNodes[0].removeAttribute('style');
		}
	}, [fullscreen]);

	const handleMoveSlider = (action) => {
		sliderInstance.current && sliderInstance.current[action]()
		setWidthProgress(0);
	}

	return (
		<div
			ref={_slider}
			className={cx(
				'slider',
				className,
				{
					fullscreen,
					whithProgressBar: fullscreen
				}
			)}
			{...props}
		>
		{
			(arrows && children.length > 1) ?
				<Fragment>
					<span onClick={() => handleMoveSlider('prev')} className='arrow-left'></span>
					<span onClick={() => handleMoveSlider('next')} className='arrow-right'></span>
				</Fragment>
			: null
		}
			<ul className="slides">{children}</ul>
		{ children.length > 1 &&
			<div style={{width: `${widthProgress}px`}} className="progress-bar"></div>
		}
		</div>
	);
};

Slider.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	/**
	 * Whether or not the Slider should be fullscreen
	 * @default false
	 */
	fullscreen: PropTypes.bool,
	/**
	 * Set to false to hide slide arrows
	 * @default true
	 */
	arrows: PropTypes.bool,
	options: PropTypes.shape({
		/**
		 * Set to false to hide slide indicators
		 * @default true
		 */
		indicators: PropTypes.bool,
		/**
		 * The interval between transitions in ms
		 * @default 6000
		 */
		interval: PropTypes.number,
		/**
		 * The duration of the transation animation in ms
		 * @default 500
		 */
		duration: PropTypes.number,
		/**
		 * The height of the Slider window
		 * @default 400
		 */
		height: PropTypes.number
	})
};

Slider.defaultProps = {
	fullscreen: false,
	options: {
		indicators: true,
		interval: 6000,
		duration: 500,
		height: 400
	}
};

export default Slider;