import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

/* Utils */
import idgen from '../utils/idgen';

const RadioGroup = ({
	name,
	value,
	options,
	withGap,
	onChange,
	disabled,
	disabledIcon,
	radioClassNames,
}) => {
	return (
		<Fragment>
			{options.map((radioItem) => {
				let idx = `radio-${idgen()}`;
				return(
					<label
						className={radioClassNames}
						htmlFor={idx}
						key={idx}
					>
						<input
							id={idx}
							value={radioItem.value}
							type="radio"
							checked={radioItem.value === value}
							name={name}
							onChange={onChange}
							disabled={disabled}
							className={cx({ 'with-gap': withGap })}
						/>
						<span>{radioItem.label}</span>
						{(disabledIcon || !radioItem.icon) ? null : radioItem.icon}
					</label>
				)
			})}
		</Fragment>
	);
};

RadioGroup.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
			value: PropTypes.string.isRequired,
			icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
		})
	).isRequired,
	/*
	 * predefined checked value
	 */
	value: PropTypes.string,
	/*
	 * radio group name
	 */
	name: PropTypes.string,
	/*
	 * with-gap styled checkbox
	 */
	withGap: PropTypes.bool,
	/*
	 * onChange callback
	 */
	onChange: PropTypes.func,
	/*
	 * disabled input
	 */
	disabled: PropTypes.bool,
	/*
	 * classnames passed to label wrapper
	 */
	radioClassNames: PropTypes.string
};

export default RadioGroup;