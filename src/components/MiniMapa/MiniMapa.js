import React from 'react';
import PropTypes from 'prop-types';
import {applyToPoints, inverse} from 'transformation-matrix';

/* components */
import MiniMapaMascara from './MiniMapaMascara';

/* constants */
const POSITION_LEFT = 'left';
const POSITION_RIGHT = 'right';

const MiniMapa = (props) => {
	let {
		value,
		children,
		position,
		background,
		SVGBackground,
		onChangeValue,
		width: miniatureWidth,
		height: miniatureHeight
	} = props;

	let {
		SVGMinX,
		SVGMinY,
		SVGWidth,
		SVGHeight,
		viewerWidth,
		viewerHeight
	} = value;

	let ratio = SVGHeight / SVGWidth;

	let zoomToFit = ratio >= 1
		? miniatureHeight / SVGHeight
		: miniatureWidth / SVGWidth;

	let [{x: x1, y: y1}, {x: x2, y: y2}] = applyToPoints(inverse(value), [
		{x: 0, y: 0},
		{x: viewerWidth, y: viewerHeight}
	]);

	let width, height;
	if (value.miniatureOpen) {
		width = miniatureWidth;
		height = miniatureHeight;
	} else {
		width = 24;
		height = 24;
	}

	let style = {
		position: "absolute",
		overflow: "hidden",
		outline: "1px solid rgba(19, 20, 22, 0.90)",
		transition: "width 200ms ease, height 200ms ease, bottom 200ms ease",
		width: width + "px",
		height: height + "px",
		top: "6px",
		bottom: "6px",
		[position === POSITION_RIGHT ? 'right' : 'left']: "6px",
		background
	};
	Object.assign(style, props.style);

	let centerTranslation = ratio >= 1
		? `translate(${(miniatureWidth - (SVGWidth * zoomToFit)) / 2 - SVGMinX * zoomToFit}, ${ - SVGMinY * zoomToFit})`
		: `translate(${ - SVGMinX * zoomToFit}, ${(miniatureHeight - (SVGHeight * zoomToFit)) / 2 - SVGMinY * zoomToFit})`;

	return (
		<div role="navigation" style={style}>
			<svg
				width={miniatureWidth}
				height={miniatureHeight}
				style={{pointerEvents: "none"}}>
				<g transform={centerTranslation}>
					<g transform={`scale(${zoomToFit}, ${zoomToFit})`}>

						<rect
							fill={SVGBackground}
							x={SVGMinX}
							y={SVGMinY}
							width={SVGWidth}
							height={SVGHeight}/>

						{children}

						<MiniMapaMascara
							SVGWidth={SVGWidth}
							SVGHeight={SVGHeight}
							SVGMinX={SVGMinX}
							SVGMinY={SVGMinY}
							x1={x1}
							y1={y1}
							x2={x2}
							y2={y2}
							zoomToFit={zoomToFit}
						/>

					</g>
				</g>
			</svg>
		</div>
	)
}

MiniMapa.propTypes = {
	value: PropTypes.object.isRequired,
	onChangeValue: PropTypes.func.isRequired,
	SVGBackground: PropTypes.string.isRequired,

	//customizations
	style: PropTypes.object,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	background: PropTypes.string.isRequired,
	position: PropTypes.oneOf([POSITION_RIGHT, POSITION_LEFT]),
};

MiniMapa.defaultProps = {
	width: 100,
	height: 80,
	background: "#616264",
	position: POSITION_LEFT,
}

export default MiniMapa;