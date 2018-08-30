// Copyright (c) 2016-2018 LG Electronics, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0

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
