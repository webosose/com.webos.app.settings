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

import CheckboxItem from '@enact/moonstone/CheckboxItem';
import Button from '@enact/moonstone/Button';
import Spotlight from '@enact/spotlight';
import $L from '@enact/i18n/$L';
import css from '../../style/main.less';
// import {getIpInformation} from './utils/NetworkCommon';
import SplitInput from './controls/SplitInput';

import {setDns, setIpv4} from '../../actions';

import ConnectionStatus from './controls/ConnectionStatus';

if (typeof window === 'object') {
	window.Spotlight = Spotlight;
}

class WiredEdit extends React.Component {
	constructor (props) {
		super(props);

		this.regExps = {
			ipv4: new RegExp(
				'^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'
			),
			subnetMask: new RegExp(
				'^(((128|192|224|240|248|252|254)\\.0\\.0\\.0)|(255\\.(0|128|192|224|240|248|252|254)\\.0\\.0)|(255\\.255\\.(0|128|192|224|240|248|252|254)\\.0)|(255\\.255\\.255\\.(0|128|192|224|240|248|252|254|255)))$'
			),
			ipv6: new RegExp(
				'^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|::(ffff(:0{1,4}){0,1}:){0,1}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$'
			),
			subnetPrefixLength: new RegExp('^([1-9]|[1-9][0-9]|1[0-1][0-9]|12[0-7])$')
		};

		let state = {wired: props.wired, valid: true};

		let status = 'NOT_CONNECTED';
		if (props.wired && props.wired.state === 'connected') {
			status = props.wired.onInternet === 'yes' ? 'ON_INTERNET' : 'CONNECTED';
		}

		this.state = {...state, status};

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

	componentDidMount () {
		const currentContainer = Spotlight.getActiveContainer();
		if (currentContainer !== 'spotlightRootDecorator') {
			Spotlight.focus(Spotlight.getActiveContainer());
		}
	}

	UNSAFE_componentWillReceiveProps (props) {
		// TODO: How to handle incoming props while user is interacting with the form?
		let status = 'NOT_CONNECTED';
		if (props.wired && props.wired.state === 'connected') {
			status = props.wired.onInternet === 'yes' ? 'ON_INTERNET' : 'CONNECTED';
		}
		this.setState(
			this.validateState({
				wired: {
					...props.wired
				},
				method: props.wired.method === 'dhcp' ? 'manual' : 'dhcp',
				status
			})
		);
	}

	onDHCPToggle () {
		if (this.state.wired.method === 'manual') {
			this.connectAutomatic();
		}
		this.setState((prevState => ({
			wired: {
				...prevState.wired,
				method: this.props.wired.method === 'dhcp' ? 'manual' : 'dhcp'
			}
		})));
	}

	connect (manual) {
		this.setState({
			status: 'CONNECTING'
		});
		let ipParams, dnsParams;
		if (manual) {
			ipParams = {
				method: 'manual',
				address: this.state.wired.ipAddress,
				netmask: this.state.wired.netmask,
				gateway: this.state.wired.gateway
			};
			dnsParams = {
				dns: [this.state.wired.dns1]
			};
		} else {
			ipParams = {
				method: 'dhcp'
			};
			dnsParams = {
				dns: []
			};
		}

		this.props.setIpv4(ipParams);
		this.props.setDns(dnsParams);
	}

	onInputChange (inputName, event) {
		this.setState(prevState => (
			this.validateState({
				wired: {
					...prevState.wired,
					[inputName]: event.value
				}
			})
		));
	}

	validateState (state) {
		let newState = {
			...state,
			valid: true
		};
		if (!this.regExps.ipv4.test(newState.wired.ipAddress)) {
			newState.valid = false;
			return newState;
		} else if (!this.regExps.subnetMask.test(newState.wired.netmask)) {
			newState.valid = false;
			return newState;
		} else if (!this.regExps.ipv4.test(newState.wired.gateway)) {
			newState.valid = false;
			return newState;
		} else if (!this.regExps.ipv4.test(newState.wired.dns1)) {
			newState.valid = false;
			return newState;
		}
		return newState;
	}

	forceFocusToInput (element) {
		const node = document.querySelector(element);
		if (node) {
			const input = node.querySelector('INPUT');
			const eventObject = document.createEvent('MouseEvents');
			eventObject.initEvent('mousedown', true, false);
			input.dispatchEvent(eventObject);
		}
	}

	keyUpHandler (name, event) {
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
	keyDown (event) {
		if (event.keyCode === 9) {
			event.preventDefault();
		}
	}

	render () {
		const dismissOnEnter = true;
		return (
			<div>
				<ConnectionStatus
					mode="wired"
					status={this.state.status}
					data-component-id="connectionStatus"
				/>
				<CheckboxItem
					onClick={this.onDHCPToggle}
					selected={this.state.wired.method === 'dhcp'}
					data-component-id="dhcpCheckBox"
				>
					{$L('Set Automatically')}
				</CheckboxItem>
				<div className={css.networkEditPosition}>
					<SplitInput
						label={$L('IP Address')}
						value={this.state.wired.ipAddress}
						disabled={this.state.wired.method === 'dhcp'}
						onChange={this.onIPAddressChange}
						onKeyUp={this.onIPAddressKeyUp}
						onKeyDown={this.keyDown}
						dismissOnEnter={dismissOnEnter}
						data-component-id="ipAddress"
					/>
					<SplitInput
						label={$L('Subnet Mask')}
						value={this.state.wired.netmask}
						disabled={this.state.wired.method === 'dhcp'}
						onChange={this.onSubnetMaskChange}
						onKeyUp={this.onSubnetMaskKeyUp}
						onKeyDown={this.keyDown}
						dismissOnEnter={dismissOnEnter}
						data-component-id="subnet"
					/>
					<SplitInput
						label={$L('Gateway')}
						value={this.state.wired.gateway}
						disabled={this.state.wired.method === 'dhcp'}
						onChange={this.onGatewayChange}
						onKeyUp={this.onGatewayKeyUp}
						onKeyDown={this.keyDown}
						dismissOnEnter={dismissOnEnter}
						data-component-id="gateway"
					/>
					<SplitInput
						label={$L('DNS Server')}
						value={this.state.wired.dns1}
						disabled={this.state.wired.method === 'dhcp'}
						onChange={this.onDNSServerChange}
						onKeyUp={this.onDNSServerKeyUp}
						onKeyDown={this.keyDown}
						dismissOnEnter={dismissOnEnter}
						data-component-id="dnsserver"
					/>
					<Button
						disabled={this.state.wired.method === 'dhcp' || !this.state.valid}
						onClick={this.connectManual}
						data-component-id="connectButton"
						className={css.networkEditButton}
					>
						{$L('Connect')}
					</Button>
				</div>
			</div>
		);
	}
}

WiredEdit.propTypes = {
	setDns: PropTypes.func,
	setIpv4: PropTypes.func,
	supportIPv6: PropTypes.bool,
	wired: PropTypes.object,
	wiredMac: PropTypes.string
};

const mapStateToProps = ({network, intl}) => {
	const {wired, wiredInfo} = network;
	const {country} = intl;
	return {
		wired: wired,
		supportIPv6: country === 'JPN',
		wiredMac: (wiredInfo && wiredInfo.macAddress) || ''
	};
};

const mapDispatchToProps = dispatch => ({
	setIpv4 (params) {
		dispatch(setIpv4(params));
	},
	setDns (params) {
		dispatch(setDns(params));
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WiredEdit);
