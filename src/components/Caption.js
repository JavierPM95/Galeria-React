import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/* constants */
import { PLACEMENTS } from '../constants';

const Caption = ({ className, placement, children, ...props }) => {
	return (
		<div className={cx('caption', `${placement}-align`, className)} {...props}>
			{children}
		</div>
	);
};

Caption.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	/**
	 * Placement of the caption
	 * @default 'center'
	 */
	placement: PropTypes.oneOf(PLACEMENTS)
};

Caption.defaultProps = {
	placement: 'center'
};

export default Caption;