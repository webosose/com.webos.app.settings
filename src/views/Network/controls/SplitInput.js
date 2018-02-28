import PropTypes from 'prop-types';
import React from 'react';

import Input from '@enact/moonstone/Input';
import Item from '@enact/moonstone/Item';

import css from './SplitInput.less';


class SplitInput extends React.Component {
	render () {
		return (({label, ...rest}) => {
			return (
				<div role="region" aria-label={label} className={css.splitInput}>
					<Item spotlightDisabled marqueeOn={'render'} className={css.label}>{label}</Item>
					<Input className={css.input} {...rest} />
				</div>
			);
		})(this.props);
	}
}

SplitInput.propTypes = {
	label: PropTypes.string.isRequired,
	...Input.propTypes
};

export default SplitInput;
