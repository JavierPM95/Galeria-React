import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const CollapsibleItem = ({
	icon,
	header,
	eventKey,
	expanded,
	onSelect,
	children,
	className,
	node: Node,
	iconClassName,
	classNameBody,
	onSelectParent,
	classNameHeader,
	...props
}) => {
	return(
		<li className={cx(className, { active: expanded })} {...props}>
			<Node
				className={cx('collapsible-header', classNameHeader, { active: expanded })}
				data-active={(expanded) ? 'active' : 'inactive'}
				onClick={() => {
					onSelectParent(eventKey);
					onSelect && onSelect(eventKey);
				}}
			>
				{icon}
				{header}
			</Node>
			<div className={cx('collapsible-body', classNameBody)} >{children}</div>
		</li>
	);
}

CollapsibleItem.propTypes = {
	header: PropTypes.any.isRequired,
	icon: PropTypes.node,
	children: PropTypes.node,
	onSelect: PropTypes.func,
	onSelectParent: PropTypes.func,
	iconClassName: PropTypes.string,
	/**
	 * If the item is expanded by default. Overridden if the parent Collapsible is an accordion.
	 * @default false
	 */
	expanded: PropTypes.bool,
	/**
	 * The value to pass to the onSelect callback.
	 */
	eventKey: PropTypes.any,
	className: PropTypes.string,
	classNameBody: PropTypes.string,
	classNameHeader: PropTypes.string,
	/**
	 * The node type of the header
	 * @default a
	 */
	node: PropTypes.node
};

CollapsibleItem.defaultProps = {
	expanded: false,
	node: 'div'
};

export default CollapsibleItem;