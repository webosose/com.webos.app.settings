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
import {connect} from 'react-redux';
import Spotlight from '@enact/spotlight';
import $L from '@enact/i18n/$L';
import LabeledItem from '@enact/moonstone/LabeledItem';

import {addPath} from '../../actions';

import css from '../../style/main.module.less';

class Language extends React.Component {
	constructor (props) {
		super(props);

		this.pushPathMenuLanguage = props.addPath.bind(this, 'Menu Language');
		this.pushPathVKBLanguage = props.addPath.bind(this, 'Keyboard Languages');
	}
	componentDidMount () {
		const currentContainer = Spotlight.getActiveContainer();
		if ( currentContainer !== 'spotlightRootDecorator') {
			Spotlight.focus(Spotlight.getActiveContainer());
		}
	}
	setVkbLanguage (obj) {
		let displayVkbLanguage = $L('Loading...');
		if (obj) {
			if (obj.vkbLanguage) {
				if (Array.isArray(obj.vkbLanguage)) {
					displayVkbLanguage = obj.vkbLanguage.join();
				} else {
					displayVkbLanguage = obj.vkbLanguage;
				}
			}
		}
		return displayVkbLanguage;
	}
	render () {
		const displayVkbLanguage = this.setVkbLanguage(this.props);
		return (
			<div>
				<LabeledItem className={css.vspacingCMR} onClick={this.pushPathMenuLanguage} label={this.props && this.props.menuLanguage ? this.props.menuLanguage : $L('Loading...')} data-component-id="menuLanguage">{$L('Menu Language')}</LabeledItem>
				<LabeledItem className={css.vspacingCMR} onClick={this.pushPathVKBLanguage} label={displayVkbLanguage} data-component-id="vkbLanguage">{$L('Keyboard Languages')}</LabeledItem>
			</div>
		);
	}
}

Language.propTypes = {
	addPath: PropTypes.func,
	menuLanguage:  PropTypes.string
};

const mapStateToProps = (state) => ({
	menuLanguage: state && state.general && state.general.menuLanguage && state.general.menuLanguage.displayValue,
	vkbLanguage:  state && state.general && state.general.vkbLanguage && state.general.vkbLanguage.displayValue
});

const mapDispatchToProps = (dispatch) => ({
	addPath (path) {
		dispatch(addPath(path));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Language);
