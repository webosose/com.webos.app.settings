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
import LabeledItem from '@enact/sandstone/Item';
import Icon from '@enact/sandstone/Icon';
import {InputPopup} from '@enact/sandstone/Input';
import Button from "@enact/sandstone/Button";

import { addPath } from '../../actions';
import { setSystemSettings } from '../../actions';
import SettingsScroller from '../../components/SettingsScroller';
import css from './Network.module.less';
import mainCss from '../../style/main.module.less';
import { changeWifiUISate } from '../../actions/networkAction';

class Network extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			deviceName: props.deviceName,
			showPopupDeviceName: false,
			deviceNameOpened: false
		};

		this.deviceNameInputChange = this.deviceNameInputChange.bind(this);
		this.deviceNameClosed = this.deviceNameClosed.bind(this);

		this.nameOpened = false;

		this.pushPathWiredConnection = props.addPath.bind(this, 'Wired Connection (Ethernet)');
		// this.pushPathWifiConnection = props.addPath.bind(this, 'Wi-Fi Connection');
		document.addEventListener("keyboardStateChange",(ev)=>{
			if(!ev.visibility){
				console.log("keyboardStateChange::",ev)
				// this.setState({ deviceNameOpened: false })
				this.nameOpened = false;
				this.deviceNameClosed()
			}
		});
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
		if (Array.from(value).length < 31) {
			this.setState({
				deviceName: value
			});
		}
	}
	revertToPrevDeviceName = () => {
		this.setState({
			deviceName: this.props.deviceName
		})
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
		this.setState((prevState) => ({ deviceNameOpened: !prevState.deviceNameOpened }))
	}

	setDeviceNameProps() {
		return {
			onClick: this.deviceNameClicked,
			placeholder: $L('Loading...')
		};
	}

	wifieLinkClickHander = () => {
		this.props.addPath('Wi-Fi Connection')
		this.props.changeWifiUISate(true,'');
	}

	handleClickDeviceNameBtn() {
		this.setState({
			showPopupDeviceName: true
		})
	}

	handleCloseDeviceNamePopup() {
		this.setState({
			showPopupDeviceName: false,
			deviceNameOpened: false
		})
	}

	render() {
		const deviceNameProps = this.setDeviceNameProps();
		return (
			<SettingsScroller className={css.scroller}>
				<LabeledItem {...deviceNameProps} className={mainCss.vspacingCMR} label={this.state.deviceName ? this.state.deviceName : $L('Loading...')} slotAfter={this.state.deviceNameOpened ? <Icon>arrowsmallup</Icon> : <Icon>arrowsmalldown</Icon>}>{$L('Device Name')}</LabeledItem>
				{/*{this.state.deviceNameOpened && <Input className={css.deviceNameInputField} length={30} size='small' popupType="overlay" dismissOnEnter onBlur={this.deviceNameClosed} placeholder={$L('Loading...')} onChange={this.deviceNameInputChange} value={this.state.deviceName} />}*/}
				{this.state.deviceNameOpened && (
					<Button
						className={css.deviceNameInputField}
						onClick={this.handleClickDeviceNameBtn.bind(this)}
						size="small"
					>
						{this.state.deviceName || $L('Loading...')}
					</Button>
				)}
				<InputPopup
					open={this.state.showPopupDeviceName}
					className={css.deviceNameInputField}
					length={30}
					size="small"
					popupType="overlay"
					dismissOnEnter
					onBlur={this.deviceNameClosed}
					placeholder={$L('Loading...')}
					onChange={this.deviceNameInputChange}
					onClose={this.handleCloseDeviceNamePopup.bind(this)}
					value={this.state.deviceName}/>
				<LabeledItem className={mainCss.vspacingCMR} onClick={this.pushPathWiredConnection} label={(this.props.wiredOnInternet === 'yes') ? $L('Connected to Internet') : $L('Not Connected')} data-component-id="wiredConnection">{$L('Wired Connection (Ethernet)')}</LabeledItem>
				<LabeledItem className={mainCss.vspacingCMR} onClick={this.wifieLinkClickHander} label={(this.props.wifiOnInternet === 'yes') ? $L('Connected to Internet') : $L('Not Connected')} data-component-id="WifiConnection">{$L('Wi-Fi Connection')}</LabeledItem>
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
	},
	changeWifiUISate(showWifiHeaders,wifitype) {
		dispatch(changeWifiUISate(showWifiHeaders,wifitype))
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Network);
