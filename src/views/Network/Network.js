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
import { connect } from 'react-redux';

import $L from '@enact/i18n/$L';
// import LabeledItem from '@enact/moonstone/LabeledItem';
import LabeledItem from '@enact/sandstone/Item';

// import {ExpandableInput} from '@enact/moonstone/ExpandableInput';
// import {Expandable} from '@enact/moonstone/ExpandableItem';

import { addPath } from '../../actions';
import { setSystemSettings } from '../../actions';

import SettingsScroller from '../../components/SettingsScroller';
import css from './Network.module.less';
import mainCss from '../../style/main.module.less';
import Icon from '@enact/sandstone/Icon';
import Input from '@enact/sandstone/Input';

// const CustomExpandableInput = Expandable(ExpandableInputBase);

class Network extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			deviceName: props.deviceName
		};

		this.deviceNameInputChange = this.deviceNameInputChange.bind(this);
		this.deviceNameClosed = this.deviceNameClosed.bind(this);

		this.nameOpened = false;

		this.pushPathWiredConnection = props.addPath.bind(this, 'Wired Connection (Ethernet)');
		this.pushPathWifiConnection = props.addPath.bind(this, 'Wi-Fi Connection');
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.nameOpened) {
			this.setState({
				deviceName: nextProps.deviceName
			});
		}
	}

	deviceNameInputChange(e) {
		if (toString.call(e.value) !== '[object String]') {
			return true;
		}
		const value = e.value;
		if (unescape(encodeURI(value)).length < 31) {
			this.setState({
				deviceName: value
			});
		}
	}

	deviceNameClosed() {
		let param = {};
		let { deviceName: newValue } = this.state;
		newValue = newValue.trim();
		if (newValue === '') {
			newValue = this.props.deviceName;
		}
		this.setState({
			deviceName: newValue
		});
		param.category = 'network';
		param.settings = {};
		param.settings['deviceName'] = newValue;
		this.props.setSystemSettings(param);
		this.nameOpened = false;
	}

	deviceNameOpened = () => {
		this.nameOpened = true;
	};

	deviceNameClicked = () => {
		this.setState({ deviceNameOpened: !this.state.deviceNameOpened }
		)
	}

	setDeviceNameProps() {
		return {
			onClick: this.deviceNameClicked,
			placeholder: $L('Loading...')
		};
	}


	render() {
		const deviceNameProps = this.setDeviceNameProps();
		return (
			<SettingsScroller className={css.scroller}>
				<LabeledItem {...deviceNameProps} className={mainCss.vspacingCMR} label={this.state.deviceName ? this.state.deviceName : $L('Loading...')} slotAfter={this.state.deviceNameOpened ? <Icon>arrowsmallup</Icon> : <Icon>arrowsmalldown</Icon>}>{$L('Device Name')}</LabeledItem>
				{this.state.deviceNameOpened && <Input className={css.deviceNameInputField} length={30} size='small' popupType="overlay" dismissOnEnter onClose={this.deviceNameClosed} placeholder={$L('Loading...')} onChange={this.deviceNameInputChange} value={this.state.deviceName} />}
				<LabeledItem className={mainCss.vspacingCMR} onClick={this.pushPathWiredConnection} label={(this.props.wiredOnInternet === 'yes') ? $L('Connected to Internet') : $L('Not Connected')} data-component-id="wiredConnection">{$L('Wired Connection (Ethernet)')}</LabeledItem>
				<LabeledItem className={mainCss.vspacingCMR} onClick={this.pushPathWifiConnection} label={(this.props.wifiOnInternet === 'yes') ? $L('Connected to Internet') : $L('Not Connected')} data-component-id="WifiConnection">{$L('Wi-Fi Connection')}</LabeledItem>
			</SettingsScroller>
		);
	}
}

Network.propTypes = {
	addPath: PropTypes.func,
	deviceName: PropTypes.string,
	ipAddress: PropTypes.string,
	setSystemSettings: PropTypes.func,
	state: PropTypes.string,
	wifiOnInternet: PropTypes.string,
	wiredOnInternet: PropTypes.string
};

const mapStateToProps = ({ network, general }) => ({
	deviceName: general.deviceName,
	ipAddress: network.wired && network.wired.ipAddress,
	state: network.wifi && network.wifi.state,
	wifiOnInternet: network.wifi && network.wifi.onInternet,
	wiredOnInternet: network.wired && network.wired.onInternet
});

const mapDispatchToProps = (dispatch) => ({
	addPath(path) {
		dispatch(addPath(path));
	},
	setSystemSettings(params) {
		dispatch(setSystemSettings(params));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Network);
