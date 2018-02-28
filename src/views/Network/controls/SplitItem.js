import PropTypes from 'prop-types';
import React from 'react';

import kind from '@enact/core/kind';
import {MarqueeText} from '@enact/moonstone/Marquee';

import css from './SplitItem.less';

const SpilitItem = kind({
	name: 'SpilitItem',

	propTypes: {
		children: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired
	},

	render: ({label, children}) => (
		<div className={css.splitItem}>
			<MarqueeText className={css.label}>{label}</MarqueeText>
			<MarqueeText className={css.content}>{children}</MarqueeText>
		</div>
	)

});

export default SpilitItem;
