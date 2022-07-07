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

import PropTypes from 'prop-types';
import React from 'react';
import {Panel, Header} from '@enact/moonstone/Panels';
import css from '../App/App.module.less';
import $L from '@enact/i18n/$L';

class MainPanel extends React.Component {
	updateBreadcrumb () {
		let ret = '';
		for (let i = 0; i < this.props.path.length - 1; i++) {
			ret += $L(this.props.path[i]) + ' / ';
		}
		return ret;
	}

	render () {
		let titleLabel = this.props.path[this.props.path.length - 1];
		if (titleLabel === 'Wired Edit') {
			titleLabel = 'Edit';
		}
		return (
			<Panel>
				<Header
					marqueeOn={'render'}
					className={css.header}
					title={$L(titleLabel).toUpperCase()}
					titleBelow={this.updateBreadcrumb()}
				>
					{this.props.headerChildren}
				</Header>
				{this.props.children}
			</Panel>
		);
	}
}

MainPanel.defaultProps = {
	path: []
};

MainPanel.propTypes = {
	headerChildren: PropTypes.object,
	path: PropTypes.any,
	title: PropTypes.string
};

export default MainPanel;
