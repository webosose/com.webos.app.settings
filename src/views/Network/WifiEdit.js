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
import CheckboxItem from '@enact/sandstone/CheckboxItem';
import Button from '@enact/sandstone/Button';
import Divider from '@enact/sandstone/Heading';
import Spotlight from '@enact/spotlight';
import $L from '@enact/i18n/$L';
import css from '../../style/main.module.less';
import SplitInput from './controls/SplitInput';
import ConnectionStatus from './controls/ConnectionStatus';
import { setDns, setIpv4 } from '../../actions';

if (typeof window === 'object') {
	window.Spotlight = Spotlight;
}

class WifiEdit extends React.Component {
	constructor(props) {
		super(props);

		this.regExps = {
			ipv4: new RegExp('^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'),
			subnetMask: new RegExp('^(((128|192|224|240|248|252|254)\\.0\\.0\\.0)|(255\\.(0|128|192|224|240|248|252|254)\\.0\\.0)|(255\\.255\\.(0|128|192|224|240|248|252|254)\\.0)|(255\\.255\\.255\\.(0|128|192|224|240|248|252|254|255)))$'),
			ipv6: new RegExp('^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|::(ffff(:0{1,4}){0,1}:){0,1}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$'),
			subnetPrefixLength: new RegExp('^([1-9]|[1-9][0-9]|1[0-1][0-9]|12[0-7])$')
		};

		let state = { wifi: props.wifi, valid: true };

		let status = 'NOT_CONNECTED';
		if (props.wifi && props.wifi.state === 'connected') {
			status = (props.wifi.onInternet === 'yes' ? 'ON_INTERNET' : 'CONNECTED');
		}

		this.state = { ...state, status };

		this.onDHCPToggle = this.onDHCPToggle.bind(this);
		this.onIPAddressChange = this.onInputChange.bind(this, 'ipAddress');
		this.onSubnetMaskChange = this.onInputChange.bind(this, 'netmask');
		this.onGatewayChange = this.onInputChange.bind(this, 'gateway');
		this.onDNSServerChange = this.onInputChange.bind(this, 'dns1');

		this.onIPAddressKeyUp = this.keyUpHandler.bind(this, 'ipAddress');
		this.onSubnetMaskKeyUp = this.keyUpHandler.bind(this, 'subnet');
		this.onGatewayKeyUp = this.keyUpHandler.bind(this, 'gateway');
		this.onDNSServerKeyUp = this.keyUpHandler.bind(this, 'dnsserver');

		this.connectManual = this.connect.bind(this, true);
		this.connectAutomatic = this.connect.bind(this, false);
		// this.onEditClick = this.onEditClick.bind(this);
	}

	componentDidMount() {
		const currentContainer = Spotlight.getActiveContainer();
		if (currentContainer !== 'spotlightRootDecorator') {
			Spotlight.focus(Spotlight.getActiveContainer());
		}
	}

	UNSAFE_componentWillReceiveProps(props) {
		// TODO: How to handle incoming props while user is interacting with the form?
		let status = 'NOT_CONNECTED';
		if (props.wifi && props.wifi.state === 'connected') {
			status = (props.wifi.onInternet === 'yes' ? 'ON_INTERNET' : 'CONNECTED');
		}
		this.setState(this.validateState({
			wifi: {
				...props.wifi
			},
			method: props.wifi.method === 'dhcp' ? 'manual' : 'dhcp',
			status
		}));
	}

	onDHCPToggle() {
		if (this.state.wifi.method === 'manual') {
			this.connectAutomatic();
		}
		this.setState(prevState => ({
			wifi: {
				...prevState.wifi,
				method: this.props.wifi.method === 'dhcp' ? 'manual' : 'dhcp'
			}
		}));
	}

	connect(manual) {
		this.setState({
			status: 'CONNECTING'
		});
		let ipParams, dnsParams;
		if (manual) {
			ipParams = {
				method: 'manual',
				address: this.state.wifi.ipAddress,
				netmask: this.state.wifi.netmask,
				gateway: this.state.wifi.gateway
			};
			dnsParams = {
				dns: [
					this.state.wifi.dns1
				]
			};
		} else {
			ipParams = {
				method: 'dhcp'
			};
			dnsParams = {
				dns: []
			};
		}

		ipParams.ssid = this.state.wifi.ssid;
		dnsParams.ssid = this.state.wifi.ssid;

		this.props.setIpv4(ipParams);
		this.props.setDns(dnsParams);
	}
	onInputChange(inputName, event) {
		this.setState(prevState => (
			this.validateState({
				wifi: {
					...prevState.wifi,
					[inputName]: event.value
				}
			})));
	}

	validateState(state) {
		let newState = {
			...state,
			valid: true
		};
		if (!this.regExps.ipv4.test(newState.wifi.ipAddress)) {
			newState.valid = false;
			return newState;
		} else if (!this.regExps.subnetMask.test(newState.wifi.netmask)) {
			newState.valid = false;
			return newState;
		} else if (!this.regExps.ipv4.test(newState.wifi.gateway)) {
			newState.valid = false;
			return newState;
		} else if (!this.regExps.ipv4.test(newState.wifi.dns1)) {
			newState.valid = false;
			return newState;
		}
		return newState;
	}

	forceFocusToInput(element) {
		const node = document.querySelector(element);
		if (node) {
			const input = node.querySelector('INPUT');
			const eventObject = document.createEvent('MouseEvents');
			eventObject.initEvent('mousedown', true, false);
			input.dispatchEvent(eventObject);
		}
	}

	keyUpHandler(name, event) {
		if (event.keyCode === 13 && event.target.tagName === 'INPUT') {
			switch (name) {
				case 'ipAddress': {
					this.forceFocusToInput('[data-component-id=subnet]');
					break;
				}
				case 'subnet': {
					this.forceFocusToInput('[data-component-id=gateway]');
					break;
				}
				case 'gateway': {
					this.forceFocusToInput('[data-component-id=dnsserver]');
					break;
				}
				case 'dnsserver': {
					setTimeout(() => {
						Spotlight.focus('[data-component-id=connectButton]');
					}, 0);
					if (this.state.valid) {
						this.connectManual();
					}
				}
			}
		}
	}

	render() {
		const dismissOnEnter = true;
		let ipMode = $L('IP');

		if (this.props.wifi.method === 'manual') {
			ipMode = $L('IP (Manual)');
		} else if (this.props.wifi.method === 'dhcp') {
			ipMode = $L('IP (Automatic)');
		}
		return (
			<div>
				<ConnectionStatus mode="wifi" status={this.state.status} data-component-id="wifiConnectionStatus" />
				<Divider>{ipMode}</Divider>
				<CheckboxItem
					onClick={this.onDHCPToggle}
					selected={this.state.wifi.method === 'dhcp'}
					data-component-id="dhcpCheckBox"
				>
					{$L('Set Automatically')}
				</CheckboxItem>
				<div className={css.networkEditPosition}>
					<SplitInput
						label={$L('IP Address')}
						value={this.state.wifi.ipAddress}
						disabled={this.state.wifi.method === 'dhcp'}
						onChange={this.onIPAddressChange}
						onKeyUp={this.onIPAddressKeyUp}
						dismissOnEnter={dismissOnEnter}
						data-component-id="ipAddress"
					/>
					<SplitInput
						label={$L('Subnet Mask')}
						value={this.state.wifi.netmask}
						disabled={this.state.wifi.method === 'dhcp'}
						onChange={this.onSubnetMaskChange}
						onKeyUp={this.onSubnetMaskKeyUp}
						dismissOnEnter={dismissOnEnter}
						data-component-id="subnet"
					/>
					<SplitInput
						label={$L('Gateway')}
						value={this.state.wifi.gateway}
						disabled={this.state.wifi.method === 'dhcp'}
						onChange={this.onGatewayChange}
						onKeyUp={this.onGatewayKeyUp}
						dismissOnEnter={dismissOnEnter}
						data-component-id="gateway"
					/>
					<SplitInput
						label={$L('DNS Server')}
						value={this.state.wifi.dns1}
						disabled={this.state.wifi.method === 'dhcp'}
						onChange={this.onDNSServerChange}
						onKeyUp={this.onDNSServerKeyUp}
						dismissOnEnter={dismissOnEnter}
						data-component-id="dnsserver"
					/>
					<Button
						disabled={this.state.wifi.method === 'dhcp' || !this.state.valid}
						onClick={this.connectManual}
						data-component-id="connectButton"
						className={css.networkConnectButton}
						size="small"
					>
						{$L('Connect')}
					</Button>
				</div>
			</div>
		);
	}
}

WifiEdit.propTypes = {
	setDns: PropTypes.func,
	setIpv4: PropTypes.func,
	supportIPv6: PropTypes.bool,
	wifi: PropTypes.object,
	wifiMac: PropTypes.string
};

const mapStateToProps = ({ network, intl }) => {
	const { wifi, wifiInfo } = network;
	const { country } = intl;
	return {
		wifi: wifi,
		supportIPv6: country === 'JPN',
		wifiMac: (wifiInfo && wifiInfo.macAddress) || ''
	};
};

const mapDispatchToProps = (dispatch) => ({
	setIpv4(params) {
		dispatch(setIpv4(params));
	},
	setDns(params) {
		dispatch(setDns(params));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(WifiEdit);
