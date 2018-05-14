import React from 'react';
import PropTypes from 'prop-types';
//import PureRenderMixin from 'react-addons-pure-render-mixin';

import Scroller from '@enact/moonstone/Scroller';
import Spotlight from '@enact/spotlight';

import css from '../style/main.less';

let maximumCount = 100;	// I don't think it will be exceeded but for safety...
let _count = 0;

const incrementId = (id) => `${id}_${_count++ % maximumCount}`;

class SettingsScroller extends React.Component {
	constructor (props) {
		super(props);

		//this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.uniqueId = incrementId('settingsScroller');
	}

	componentDidMount () {
		const config = {
			leaveFor: {
				down: ''
			}
		};
		if (!this.props.focusableScrollbar) {
			config.leaveFor.right = '';
		}
		Spotlight.set(this.uniqueId, config);
	}

	render () {
		const {...rest} = this.props;
		delete rest.callSpotlightItem;
		return (
			<Scroller {...rest} className={`${css.scroller} ${this.props.className}`} direction="vertical" containerId={this.uniqueId} />
		);
	}
}

SettingsScroller.propTypes = {
	focusableScrollbar: PropTypes.bool
};

export default SettingsScroller;
