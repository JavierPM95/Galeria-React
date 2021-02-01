import React, {lazy } from 'react';

/* Style */
import cx from 'classnames';
import style from './Asientos.css';

/* components */
const Icon = lazy(() => {
	return import(/* webpackChunkName: 'Icon' */'../../../Icon')
});

const Toolbar = (props) => {
	const {
		fitToViewer,
		getAsientos,
		zoomOnViewerCenter,
		zoomOutViewerCenter,
	} = props;

	return(
		<div className={cx(style.toolbarWrapper)} >
			<button className={cx('btn', style.toolbarBtn)} onClick={() => zoomOnViewerCenter()}>+</button>
			<button className={cx('btn', style.toolbarBtn)} onClick={() => zoomOutViewerCenter()}>-</button>
			<button className={cx('btn', style.toolbarBtn)} onClick={() => fitToViewer()}>1:1</button>
			<button className={cx('btn', style.toolbarBtn)} onClick={() => getAsientos()}>
				<Icon >sync</Icon>
			</button>
		</div>
	)
}

export default Toolbar;