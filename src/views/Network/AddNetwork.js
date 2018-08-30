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

import CheckboxItem from '@enact/moonstone/CheckboxItem';
import Button from '@enact/moonstone/Button';
import Input from '@enact/moonstone/Input';
import ExpandableList from '@enact/moonstone/ExpandableList';
import {MarqueeText} from '@enact/moonstone/Marquee';

import {connectingWifi, connectingAp} from '../../actions/networkAction';
import {removePath} from '../../actions';

import css from './AddNetwork.less';
import SecurityValidate from './SecurityValidate';

class AddNetwork extends React.Component {
	constructor (props) {
		super(props);
		if (props.network && props.network.retry) {
			this.state = {
				name: props.network.ssid,
				securityType: props.network.securityType,
				password: '',
				showPassword: false,
				valid: SecurityValidate.isValidSSID(props.network.ssid) &&
					SecurityValidate.isValidPasskey(props.network.securityType, '')
			};
		} else {
			this.state = {
				securityType: 'none',
				name: '',
				password: '',
				showPassword: false,
				valid: false
			};
		}

		this.securityTypes = {
			none: $L('Open'),
			wep: $L('WEP'),
			psk: $L('WPA/WPA2 PSK')
		};

		this.securityIndex = {
			none: 0,
			wep: 1,
			psk: 2
		};

		this.onNameChange = this.onInputChange.bind(this, 'name');
		this.onPasswordChange = this.onInputChange.bind(this, 'password');
		this.onShowPasswordToggle = this.onShowPasswordToggle.bind(this);
		this.onConnectClick = this.onConnectClick.bind(this);
		this.onSecuritySelect = this.onSecuritySelect.bind(this);
		this.makeSecurityList = this.makeSecurityList.bind(this);
	}

	componentDidMount () {
		const node = document.querySelector('[data-component-id=namefield]');
		if (node) {
			const input = node.querySelector('input');
			if (input) {
				const eventObject = document.createEvent('MouseEvents');
				eventObject.initEvent('mousedown', true, false);
				input.dispatchEvent(eventObject);
			}
		}
	}

	onShowPasswordToggle () {
		this.setState({
			showPassword: !this.state.showPassword
		});
	}

	onInputChange (input, event) {
		if (!(input === 'name' && event.value.length > 32)) {
			const state = {
				name: this.state.name,
				password: this.state.password,
				securityType: this.state.securityType
			};
			state[input] = event.value;
			this.validateState(state);
		}
	}

	makeSecurityList () {
		const array = [];
		for (let item in this.securityTypes) {
			array.push(this.securityTypes[item]);
		}
		return array;
	}

	validateState (newState) {
		const state = {
			...newState,
			valid: SecurityValidate.isValidSSID(newState.name) &&
					SecurityValidate.isValidPasskey(newState.securityType, newState.password)
		};
		this.setState(state);
	}

	onConnectClick () {
		let params = {
			ssid: this.state.name,
			wasCreatedWithJoinOther: true
		};
		if (this.state.securityType !== 'none') {
			params.security = {
				securityType: this.state.securityType,
				simpleSecurity: {
					passKey: this.state.password
				}
			};
		}
		const addHidden = {
			ssid: params.ssid,
			wasCreatedWithJoinOther: params.wasCreatedWithJoinOther,
			hidden: true,
			...params.security
		};
		this.props.connectingAp(addHidden);
		this.props.connectingWifi(params);
		this.props.removePath();
	}

	onSecuritySelect (event) {
		if (event.selected === null) {
			return;
		}
		this.validateState({
			name: this.state.name || '',
			password: '',
			securityType: Object.keys(this.securityTypes)[event.selected] || ''
		});
	}

	securityTypeProps () {
		const list = this.makeSecurityList();
		return {
			title: $L('Security'),
			noneText: $L('Loading...'),
			select: 'single',
			selected: this.securityIndex[this.state.securityType],
			onSelect: this.onSecuritySelect,
			closeOnSelect: true,
			children: list
		};
	}

	handleOnkeyUp = (ev) => {
		if (ev.keyCode === 13 && ev.target.tagName === 'INPUT' && this.state.valid) {
			ev.target.blur();
			this.onConnectClick();
		}
	}

	showPasswordProps () {
		return {
			onClick: this.onShowPasswordToggle,
			selected: this.state.showPassword,
			children: $L('Show Password')
		};
	}

	nameInputProps () {
		return {
			onChange: this.onNameChange,
			dismissOnEnter: true,
			onKeyUp: this.handleOnkeyUp,
			value: this.state.name
		};
	}

	passwordInputProps () {
		return {
			onChange: this.onPasswordChange,
			dismissOnEnter: true,
			onKeyUp: this.handleOnkeyUp,
			type: this.state.showPassword ? 'text' : 'password',
			value: this.state.password
		};
	}

	connectButtonProps () {
		return {
			onClick: this.onConnectClick,
			disabled: !this.state.valid,
			children: $L('Connect'),
			small: true
		};
	}

	render () {
		const nameInputProps = this.nameInputProps();
		const securityTypeProps = this.securityTypeProps();
		const passwordInputProps = this.passwordInputProps();
		const showPasswordProps = this.showPasswordProps();
		const connectButtonProps = this.connectButtonProps();

		return (
			<div>
				<div className={css.row}>
					<MarqueeText className={css.label}>
						{$L('Network Name')}
					</MarqueeText>
					<div className={css.item}>
						<Input {...nameInputProps} data-component-id="namefield" />
					</div>
				</div>
				<ExpandableList {...securityTypeProps} />
				{this.state.securityType !== 'none' &&
				<div className={css.row}>
					<div className={css.label}>
						{$L('Password')}
					</div>
					<div className={css.item}>
						<Input {...passwordInputProps} />
					</div>
				</div>}
				{this.state.securityType !== 'none' && <CheckboxItem {...showPasswordProps} />}
				<div className={css.center}>
					<Button {...connectButtonProps} />
				</div>
			</div>
		);
	}
}

AddNetwork.propTypes = {
	connectingAp: PropTypes.func,
	connectingWifi: PropTypes.func,
	removePath: PropTypes.func
};

const mapStateToProps = (state) => ({
	network: state.network.connectingWifiNetwork
});

const mapDispatchToProps = (dispatch) => ({
	connectingWifi (params) {
		dispatch(connectingWifi(params));
	},
	removePath () {
		dispatch(removePath());
	},
	connectingAp (params) {
		dispatch(connectingAp(params));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNetwork);
