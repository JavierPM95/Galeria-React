import React from 'react';
import PropTypes from 'prop-types';
import idgen from '../../utils/idgen';

const prefixID = 'react-svg-min-mapa-mascara';

const MiniMapaMascara = (props)  => {
	const { SVGMinX, SVGMinY, SVGWidth, SVGHeight, x1, y1, x2, y2, zoomToFit } = props;
	const maskID = `${prefixID}_mask_${idgen()}`

	return (
		<g>
			<defs>
				<mask id={maskID}>
					<rect x={SVGMinX} y={SVGMinY} width={SVGWidth} height={SVGHeight} fill="#ffffff"/>
					<rect x={x1} y={y1} width={x2 - x1} height={y2 - y1}/>
				</mask>
			</defs>

			<rect
				x={SVGMinX}
				y={SVGMinY}
				width={SVGWidth}
				height={SVGHeight}
				style={{
					stroke: "none",
					fill: "#000",
					mask: `url(#${maskID})`,
					opacity: 0.4
				}}
			/>
		</g>
	)
}

MiniMapaMascara.propTypes = {
	x1: PropTypes.number.isRequired,
	y1: PropTypes.number.isRequired,
	x2: PropTypes.number.isRequired,
	y2: PropTypes.number.isRequired,
	SVGMinX: PropTypes.number.isRequired,
	SVGMinY: PropTypes.number.isRequired,
	SVGWidth: PropTypes.number.isRequired,
	SVGHeight: PropTypes.number.isRequired,
	zoomToFit: PropTypes.number.isRequired,
}

export default MiniMapaMascara;
