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

import MainPanel from '../../components/MainPanel';
import General from './General';
import SystemInformation from './SystemInformation';
import Language from './Language';
import LanguageList from './LanguageList';
import TimeDate from './TimeDate';

import {getLanguages, getDeviceName, getWebOsVersion} from '../../actions/generalAction';

const panelMap = {
	'General': <General key="General" />,
	'System Information': <SystemInformation key="SystemInformation" />,
	'Language': <Language key="Language" />,
	'Menu Language': <LanguageList mode="menuLanguage" />,
	'Keyboard Languages': <LanguageList mode="vkbLanguage" />,
	'Time & Date': <TimeDate  />
};

class GeneralPanel extends React.Component {
	componentDidMount () {
		this.props.getDeviceName ();
		this.props.getLanguages ();
		this.props.getWebOsVersion ();
	}
	render () {
		return (
			<MainPanel {...this.props}>
				{ panelMap[this.props.path[this.props.path.length - 1]]}
			</MainPanel>
		);
	}
}

GeneralPanel.propTypes = {
	getDeviceName:  PropTypes.func,
	getLanguages: PropTypes.func,
	getWebOsVersion: PropTypes.func,
	path: PropTypes.array
};

const mapStateToProps = (state) => ({
	path: state.path
});

const mapDispatchToProps = (dispatch) => ({
	getLanguages () {
		dispatch(getLanguages());
	},
	getDeviceName () {
		dispatch(getDeviceName());
	},
	getWebOsVersion () {
		dispatch(getWebOsVersion());
	}
});

export default connect(mapStateToProps,mapDispatchToProps)(GeneralPanel);
