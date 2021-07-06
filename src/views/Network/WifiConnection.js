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
import IString from '@enact/i18n/ilib/lib/IString';

import Button from '@enact/moonstone/Button';
import Notification from '@enact/moonstone/Notification';
import Divider from '@enact/moonstone/Heading';
import Item from '@enact/moonstone/Item';
import VirtualList from '@enact/moonstone/VirtualList';
import Spinner from '@enact/moonstone/Spinner';

import ri from '@enact/ui/resolution';
import LS2Request from '@enact/webos/LS2Request';

import css from './WifiConnection.less';
import mainCss from '../../style/main.less';

import isNumeric from '../../utils/isNumeric';

import {addPath} from '../../actions';
import {
	findWifiNetworks,
	connectingWifi,
	connectingAp,
	releaseAp,
	connectWifi,
	deleteWifiProfile,
	clearErrorStatus
} from '../../actions/networkAction';
import {makeNetworkListArray, findMsgByErrorCode} from './utils/NetworkCommon';
import WirelessItem from './controls/WirelessItem';
import {SpotlightContainerDecorator} from '@enact/spotlight/SpotlightContainerDecorator';

const SpotlightContainer = SpotlightContainerDecorator(
	{preserveId: true, enterTo: 'last-focused'},
	'div'
);
let _foundNetworks = false;
const wpsTimeout = 120000;

class TimerNotification extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			showNotification: false
		};
		this.Timertime = null;
	}

	UNSAFE_componentWillReceiveProps ({open}) {
		if (open) {
			this.setState({
				showNotification: true
			});
			if (this.Timertime === null)  {
				this.Timertime = setTimeout(() => this.closeNotification(), this.props.time);
			}
		} else if (this.Timertime) {
			clearTimeout(this.Timertime);
			this.Timertime = null;
			this.setState({
				showNotification: false
			});
		}
	}

	componentWillUnmount () {
		if (this.Timertime) {
			clearTimeout(this.Timertime);
			this.Timertime = null;
		}
	}

	closeNotification = () => {
		if (this.Timertime) {
			clearTimeout(this.Timertime);
			this.Timertime = null;
			this.setState({
				showNotification: false
			});
			if (this.props.onClose) this.props.onClose();
		}
	};

	render () {
		return (({...rest}) => {
			delete rest.remainTime;
			delete rest.open;
			delete rest.time;
			return <Notification {...rest} open={this.state.showNotification} />;
		})(this.props);
	}
}

TimerNotification.propTypes = {
	onClose: PropTypes.func,
	time: PropTypes.number
};

class WifiConnection extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			wifiEnabled: 'not_yet',
			wifiNetworks: [],
			wifiNetworksLength: [],
			wpsPBCShowing: false,
			wpsPinShowing: false,
			showErrorDialog: false,
			errorPopupStatus: {}
		};
		this.addHiddenNetwork = this.addHiddenNetwork.bind(this);
		this.pushPathAddNetwork = props.addPath.bind(this, 'Add Network');
		this.pushPathAdvanced = props.addPath.bind(this, 'Advanced');
		this.wpsPBCClicked = this.wpsPBCClicked.bind(this);
		this.wpsPINClicked = this.wpsPINClicked.bind(this);
		this.cancelWPS = this.cancelWPS.bind(this);

		this.cancelError = this.handleErrorPopupAction.bind(this, 'cancel');
		this.retryError = this.handleErrorPopupAction.bind(this, 'retry');

		this.firstClicked = false;
	}

	UNSAFE_componentWillReceiveProps (nextProps) {
		const wifiNetworks = nextProps.wifiNetworks;
		const newNetworkList = [];
		let newState = {};
		let connectingConnectedNetwork = null;
		for (let i = 0; i < wifiNetworks.length; i++) {
			if (connectingConnectedNetwork === null && wifiNetworks[i].status !== 'NOT_CONNECTED') {
				if (this.firstClicked) {
					this.scrollTo({index: 0, animate: false, focus: true});
					this.firstClicked = false;
				}
				connectingConnectedNetwork = wifiNetworks[i].networkInfo;
			}
			newNetworkList.push(i);
		}
		if (this.state.wpsPBCShowing || this.state.wpsPinShowing) {
			for (let i = 0; i < wifiNetworks.length; i++) {
				if (
					typeof wifiNetworks[i].status !== 'undefined' &&
					wifiNetworks[i].status === 'CONNECTED'
				) {
					// Hide WPS dialog
					newState = {
						...newState,
						wpsPBCShowing: false,
						wpsPinShowing: false
					};
					this.wpsConnected = true;
				}
			}
		}

		const parseNetworkError = nextProps.parseNetworkError;
		if (parseNetworkError) {
			if (
				typeof parseNetworkError.errorText === 'string' &&
				parseNetworkError.errorText.length > 0
			) {
				if (parseNetworkError.errorText !== 'NO_ERROR') {
					const connectingNetwork = nextProps.connectingNetwork;
					if (connectingNetwork) {
						if (connectingNetwork.ssid) {
							let showRetry = true;
							if (connectingNetwork.securityType === 'none') {
								showRetry = false;
							}
							newState = {
								...newState,
								errorPopupStatus: {
									showRetry: showRetry,
									errorCode: parseNetworkError.errorCode
								},
								showErrorDialog: true
							};
						}
						this.props.clearErrorStatus();
					}
				}
			}
		}

		newState = {
			...newState,
			wifiNetworksLength: newNetworkList,
			wifiNetworks: wifiNetworks,
			showSpinner: wifiNetworks.length === 0
		};

		this.setState(newState);
	}

	componentWillUnmount () {
		_foundNetworks = false;
		this.firstClicked = false;
	}

	initAction = () => {
		if (!_foundNetworks) {
			this.props.findWifiNetworks();
			_foundNetworks = true;
		}
	};

	getScrollTo = scrollTo => {
		this.scrollTo = scrollTo;
	};

	connectNetwork = network => {
		if (!network) {
			return true;
		}
		this.props.connectingAp({
			ssid: network.ssid,
			securityType: network.securityType
		});
		const param = {};
		if (isNumeric(network.profileId)) {
			param.profileId = network.profileId;
		} else {
			param.ssid = network.ssid;
		}
		this.props.connectingWifi(param);
	};

	wirelessItemClicked = network => {
		if (network.status === 'CONNECTING') {
			return true;
		}
		this.firstClicked = true;
		if (network.status === 'CONNECTED' && isNumeric(network.profileId)) {
			this.props.deleteWifiProfile({
				profileId: network.profileId
			});
		} else if (network.status === 'NOT_CONNECTED') {
			if (!network.profileId && network.securityType !== 'none') {
				this.props.connectWifi({network});
				this.props.addPath('Wi-Fi Security');
			} else {
				this.connectNetwork(network);
			}
		}
	};

	setWirelessItem = ({index}) => {
		return (
			<WirelessItem
				key={index}
				dataIndex={index}
				onClick={this.wirelessItemClicked}
				data-component-id="wirelessItem"
			/>
		);
	};

	spinnerProps () {
		return {
			children: $L('Searching...'),
			centered: true,
			className: css.wirelessSpinner
		};
	}

	wifiNetworksProps () {
		return {
			className: css.wifiList,
			dataSize: this.state.wifiNetworksLength.length,
			itemSize: ri.scale(78),
			itemRenderer: this.setWirelessItem,
			cbScrollTo: this.getScrollTo
		};
	}

	wpsPBCClicked () {
		new LS2Request().send({
			service: 'palm://com.palm.wifi',
			method: 'startwps',
			parameters: {},
			onComplete: res => {
				if (res && res.returnValue) {
					this.setState({
						wpsPBCShowing: true,
						wpsPinShowing: false
					});
				}
			}
		});
	}

	wpsPINClicked () {
		new LS2Request().send({
			service: 'palm://com.palm.wifi',
			method: 'createwpspin',
			parameters: {},
			onComplete: pinRes => {
				if (pinRes && pinRes.returnValue && pinRes.wpspin) {
					new LS2Request().send({
						service: 'palm://com.palm.wifi',
						method: 'startwps',
						parameters: {
							wpsPin: pinRes.wpspin
						},
						onComplete: res => {
							if (res && res.returnValue) {
								this.setState({
									wpsPBCShowing: false,
									wpsPinShowing: true,
									wpsPin: pinRes.wpspin
								});
							}
						}
					});
				}
			}
		});
	}

	cancelWPS () {
		new LS2Request().send({
			service: 'palm://com.palm.wifi',
			method: 'cancelwps',
			parameters: {}
		});
		this.setState({
			wpsPBCShowing: false,
			wpsPinShowing: false
		});
	}

	handleErrorPopupAction (action) {
		if (action === 'retry') {
			const {connectingNetwork} = this.props;
			if (connectingNetwork !== null) {
				let viewModel = null;
				if (connectingNetwork.hidden) {
					viewModel = {
						ssid: connectingNetwork.ssid,
						securityType: connectingNetwork.securityType || 'none',
						retry: true
					};
					this.props.connectWifi({network: viewModel});
					this.props.addPath('Add Network');
				} else if (connectingNetwork.securityType !== 'none') {
					viewModel = {
						ssid: connectingNetwork.ssid,
						securityType: connectingNetwork.securityType,
						retry: true
					};
					this.props.connectWifi({network: viewModel});
					this.props.addPath('Wi-Fi Security');
				}
			}
		}
		this.props.releaseAp();
		this.setState({
			showErrorDialog: false
		});
	}

	parseErrorMessage = () => {
		let msg;
		if (this.state.errorPopupStatus) {
			msg = findMsgByErrorCode(this.state.errorPopupStatus.errorCode);
		}
		return msg;
	};

	onErrorNotiClosed = () => {
		this.setState({
			showErrorDialog: false
		});
	};

	wifiConnectedProps () {
		if (this.props.wifiState === 'connected') {
			return true;
		} else {
			return false;
		}
	}

	addHiddenNetwork () {
		this.props.connectWifi({network: {}});
		this.pushPathAddNetwork();
	}

	render () {
		this.initAction();
		const wifiNetworksProps = this.wifiNetworksProps();
		const spinnerProps = this.spinnerProps();
		const wifiConnected = this.wifiConnectedProps();
		const errorMessage = this.parseErrorMessage();
		return (
			<div>
				{this.state.showSpinner && <Spinner {...spinnerProps} />}
				<VirtualList data-component-id="wifiList" {...wifiNetworksProps} focusableScrollbar />
				<Divider className={css.wifiDivder} />
				<SpotlightContainer containerId="networkStatic">
					<Item
						className={mainCss.vspacingCMR}
						onClick={this.addHiddenNetwork}
						data-component-id="addNetwork"
					>
						{$L('Add a hidden wireless network')}
					</Item>
					<Item
						className={mainCss.vspacingCMR}
						onClick={this.wpsPBCClicked}
						data-component-id="connectWPSPBC"
					>
						{$L('Connect via WPS PBC')}
					</Item>
					<Item
						className={mainCss.vspacingCMR}
						onClick={this.wpsPINClicked}
						data-component-id="connectWPSPin"
					>
						{$L('Connect via WPS PIN')}
					</Item>
					<Item
						className={mainCss.vspacingCMR}
						disabled={!wifiConnected}
						onClick={this.pushPathAdvanced}
						data-component-id="advancedWifiSettings"
					>
						{$L('Advanced Wi-Fi Settings')}
					</Item>
				</SpotlightContainer>
				<TimerNotification
					open={this.state.wpsPBCShowing}
					onClose={this.cancelWPS}
					time={wpsTimeout}
				>
					<span>{$L('Press the WPS button on your wireless router now.')}</span>
					<buttons>
						<Button onClick={this.cancelWPS}>{$L('Cancel')}</Button>
					</buttons>
				</TimerNotification>
				<TimerNotification
					open={this.state.wpsPinShowing}
					onClose={this.cancelWPS}
					time={wpsTimeout}
				>
					<span
						aria-label={
							this.state.wpsPin ?
								new IString($L('PIN: {pin}')).format({
									pin: this.state.wpsPin
										.split('')
										.toString()
										.replace(/,/g, ' ')
								}) + '\u0020' :
								$L('PIN: ')
						}
					>
						{this.state.wpsPin ?
							new IString($L('PIN: {pin}')).format({pin: this.state.wpsPin}) :
							$L('PIN: ')}
					</span>
					<br />
					<span>{$L("Enter the PIN in your router's settings.")}</span>
					<buttons>
						<Button onClick={this.cancelWPS}>{$L('Cancel')}</Button>
					</buttons>
				</TimerNotification>
				<Notification open={this.state.showErrorDialog} onClose={this.onErrorNotiClosed}>
					<span>
						{errorMessage.map((line, index) => {
							return (
								<span key={index}>
									{line}
									<br />
								</span>
							);
						})}
					</span>
					{this.state.errorPopupStatus.showRetry ? (
						<buttons>
							<Button onClick={this.cancelError}>{$L('Cancel')}</Button>
							<Button onClick={this.retryError}>{$L('Retry')}</Button>
						</buttons>
					) : (
						<buttons>
							<Button onClick={this.cancelError}>{$L('Cancel')}</Button>
						</buttons>
					)}
				</Notification>
			</div>
		);
	}
}

WifiConnection.propTypes = {
	addPath: PropTypes.func,
	clearErrorStatus: PropTypes.func,
	connectingAp: PropTypes.func,
	connectingNetwork: PropTypes.object,
	connectingWifi: PropTypes.func,
	connectWifi: PropTypes.func,
	deleteWifiProfile: PropTypes.func,
	findWifiNetworks: PropTypes.func,
	releaseAp: PropTypes.func,
	wifiState: PropTypes.string
};

const mapStateToProps = ({network}) => ({
	wifiNetworks: makeNetworkListArray(network.wifiNetworks) || [],
	wifiState: network.wifi && network.wifi.state,
	parseNetworkError: network.parseNetworkError,
	connectingNetwork: network.connectingAP
});

const mapDispatchToProps = dispatch => ({
	addPath (path) {
		dispatch(addPath(path));
	},
	findWifiNetworks () {
		dispatch(findWifiNetworks());
	},
	connectingWifi (params) {
		dispatch(connectingWifi(params));
	},
	connectingAp (params) {
		dispatch(connectingAp(params));
	},
	releaseAp () {
		dispatch(releaseAp());
	},
	connectWifi (params) {
		dispatch(connectWifi(params));
	},
	deleteWifiProfile (params) {
		dispatch(deleteWifiProfile(params));
	},
	clearErrorStatus () {
		dispatch(clearErrorStatus());
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WifiConnection);
