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
import classNames from 'classnames';
import kind from '@enact/core/kind';
import Icon from '@enact/sandstone/Icon';
import Spinner from '@enact/sandstone/Spinner';
import css from './WirelessItem.module.less';
import Spottable from '@enact/spotlight/Spottable';
import {MarqueeController} from '@enact/sandstone/Marquee';
import Marquee from '@enact/sandstone/Marquee';
import {makeNetworkListArray} from '../utils/NetworkCommon';

const SpottableDiv = Spottable('div');

require.context('../../../../assets/images/internet/', false, /\.png$/);
require.context('../../../../assets/images', false, /\.png$/);

const signalIcons = {
	secure: [
		'assets/images/internet/ic_wifi_lock_1_n.png',
		'assets/images/internet/ic_wifi_lock_2_n.png',
		'assets/images/internet/ic_wifi_lock_3_n.png',
		'assets/images/internet/ic_wifi_lock_4_n.png'
	],
	secureFocus: [
		'assets/images/internet/ic_wifi_lock_1_f.png',
		'assets/images/internet/ic_wifi_lock_2_f.png',
		'assets/images/internet/ic_wifi_lock_3_f.png',
		'assets/images/internet/ic_wifi_lock_4_f.png'
	],
	secureFocusBno: [
		'assets/images/internet/ic_wifi_lock_1_f_bno.png',
		'assets/images/internet/ic_wifi_lock_2_f_bno.png',
		'assets/images/internet/ic_wifi_lock_3_f_bno.png',
		'assets/images/internet/ic_wifi_lock_4_f_bno.png'
	],
	insecure: [
		'assets/images/internet/ic_wifi_1_n.png',
		'assets/images/internet/ic_wifi_2_n.png',
		'assets/images/internet/ic_wifi_3_n.png',
		'assets/images/internet/ic_wifi_4_n.png'
	],
	insecureFocus: [
		'assets/images/internet/ic_wifi_1_f.png',
		'assets/images/internet/ic_wifi_2_f.png',
		'assets/images/internet/ic_wifi_3_f.png',
		'assets/images/internet/ic_wifi_4_f.png'
	],
	insecureFocusBno: [
		'assets/images/internet/ic_wifi_lock_1_f_bno.png',
		'assets/images/internet/ic_wifi_lock_2_f_bno.png',
		'assets/images/internet/ic_wifi_lock_3_f_bno.png',
		'assets/images/internet/ic_wifi_lock_4_f_bno.png'
	],
	disconnect: 'assets/images/ic_delete_f.png'
};

const BaseItem = kind({
	name: 'BaseItem',

	propTypes: {
		displayName: PropTypes.string.isRequired,
		iconStatus: PropTypes.string.isRequired,
		ssid: PropTypes.string.isRequired,
		status: PropTypes.string.isRequired,
		strength: PropTypes.number.isRequired,
		focused: PropTypes.bool,
		onClick: PropTypes.func,
		securityType: PropTypes.string
	},

	render: ({status, displayName, ssid, strength, focused, iconStatus, className, ...rest}) => {
		const classes = classNames(css.wirelessItem, className);
		return (
			<SpottableDiv aria-hidden className={classes} {...rest}>
				<Icon size={'small'} className={css.check} style={{opacity: status === 'CONNECTED' ? 1 : 0}}>
					check
				</Icon>
				<Marquee className={css.label}>{displayName || ssid}</Marquee>
				{!(status === 'CONNECTING') ? (
					<Icon
						className={css.icon + (status === 'CONNECTED' && focused ? ' ' + css.disconnect : '')}
					>
						{status === 'CONNECTED' && focused ?
							signalIcons.disconnect :
							signalIcons[iconStatus][strength]}
					</Icon>
				) : (
					<Spinner size='small' className={css.spinner} />
				)}
			</SpottableDiv>
		);
	}
});

const MarqueeWirelessItem = MarqueeController({marqueeOnFocus: true}, BaseItem);

class WirelessItemBase extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			focused: false
		};
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);

		this.status = null;
		this.ssid = null;
	}

	UNSAFE_componentWillReceiveProps ({status}) {
		if (!this.status) {
			this.status = status;
		}
	}

	onFocus = () => {
		this.setState({
			focused: true
		});
	};

	onBlur () {
		this.setState({
			focused: false
		});
	}

	clickedItem = () => {
		this.props.onClick(this.props);
	};

	defineIconStatus = () => {
		if (this.state.focused) {
			if (this.props.supportBNO) {
				return this.props.secure ? 'secureFocusBno' : 'insecureFocusBno';
			} else {
				return this.props.secure ? 'secureFocus' : 'insecureFocus';
			}
		} else {
			return this.props.secure ? 'secure' : 'insecure';
		}
	};

	render () {
		return (({dataIndex, ...rest}) => {
			delete rest.profileId;
			delete rest.secure;
			delete rest.securityType;
			delete rest.dataIndex;
			delete rest.dispatch;
			delete rest.bssInfo;
			const {focused} = this.state;
			const iconStatus = this.defineIconStatus();
			delete rest.supportBNO;

			return (
				<MarqueeWirelessItem
					{...rest}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					data-index={dataIndex}
					focused={focused}
					iconStatus={iconStatus}
					onClick={this.clickedItem}
				/>
			);
		})(this.props);
	}
}

const mapStateToProps = (state, ownProps) => {
	const obj = makeNetworkListArray(state.network.wifiNetworks).filter((v)=>{
		if(ownProps.type === 'mywifi'){
			return state.storedWifiNetwork.indexOf(v.ssid) >= 0
		}else {
			return state.storedWifiNetwork.indexOf(v.ssid) < 0;
		}		
	})[ownProps.dataIndex] || {};
	const supportBNO = (state.getConfigs && state.getConfigs.supportBNO) || false;
	const returnObj = {
		ssid: obj.ssid || '',
		secure: obj.secure || false,
		status: obj.status || 'NOT_CONNECTED',
		displayName: obj.displayName || '',
		strength: obj.strength,
		securityType: obj.securityType,
		supportBNO: supportBNO,
		...obj
	};
	if (obj.profileId) {
		returnObj.profileId = obj.profileId;
	}
	return returnObj;
};

WirelessItemBase.propTypes = {
	displayName: PropTypes.string.isRequired,
	secure: PropTypes.bool.isRequired,
	ssid: PropTypes.string.isRequired,
	status: PropTypes.string.isRequired,
	strength: PropTypes.number.isRequired,
	onClick: PropTypes.func,
	securityType: PropTypes.string,
	supportBNO: PropTypes.bool
};

const WirelessItem = connect(mapStateToProps)(WirelessItemBase);

export default WirelessItem;
