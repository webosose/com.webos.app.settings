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

import $L from '@enact/i18n/$L';
// import LabeledItem from '@enact/moonstone/LabeledItem';
import LabeledItem from '@enact/sandstone/Item';

import css from '../../style/main.module.less';
import {getInfo} from '../../actions/networkAction';

class SystemInformation extends React.Component {
	constructor (props) {
		super(props);
		this.props.getInfo();
	}

	render () {
		const spotlightValue = true;
		return (
			<div>
				<LabeledItem className={css.vspacingCMR} label={this.props.deviceName ? this.props.deviceName : $L('Loading...')} spotlightDisabled={spotlightValue} data-component-id="deviceName">{$L('Device Name')}</LabeledItem>
				<LabeledItem className={css.vspacingCMR} label={this.props && this.props.webOsVersion && this.props.webOsVersion.coreOSRelease ? this.props.webOsVersion.coreOSRelease : $L('Loading...')} spotlightDisabled={spotlightValue} data-component-id="softwareVersion">{$L('Software Version')}</LabeledItem>
				<LabeledItem className={css.vspacingCMR} label={this.props && this.props.wiredMac ? this.props.wiredMac : $L('Loading...')} spotlightDisabled={spotlightValue} data-component-id="macAddressWired">{$L('MAC Address (Wired)')}</LabeledItem>
				<LabeledItem className={css.vspacingCMR} label={this.props && this.props.wifiMac ? this.props.wifiMac : $L('Loading...')} spotlightDisabled={spotlightValue} data-component-id="macAddressWireless">{$L('MAC Address (Wireless)')}</LabeledItem>
			</div>
		);
	}
}

SystemInformation.propTypes = {
	deviceName: PropTypes.string,
	getInfo: PropTypes.func,
	webOsVersion: PropTypes.object,
	wifiMac: PropTypes.string,
	wiredMac: PropTypes.string
};

const mapStateToProps = ({general, network}) => {
	const {deviceName, webOsVersion} = general;
	const {wifiInfo, wiredInfo} = network;
	return {
		deviceName: deviceName,
		webOsVersion : webOsVersion,
		wifiMac: (wifiInfo && wifiInfo.macAddress) || '',
		wiredMac: (wiredInfo && wiredInfo.macAddress) || ''
	};
};

const mapDispatchToProps = (dispatch) => ({
	getInfo () {
		dispatch(getInfo());
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(SystemInformation);
