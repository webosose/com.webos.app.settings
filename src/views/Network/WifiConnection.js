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
import IString from '@enact/i18n/ilib/lib/IString';
import Button from '@enact/sandstone/Button';
import Alert from '@enact/sandstone/Alert';
import Item from '@enact/sandstone/Item';
import VirtualList from '@enact/sandstone/VirtualList';
import Spinner from '@enact/sandstone/Spinner';
import ri from '@enact/ui/resolution';
import BodyText from '@enact/sandstone/BodyText';
import LS2Request from '@enact/webos/LS2Request';
import css from './WifiConnection.module.less';
import mainCss from '../../style/main.module.less';
import isNumeric from '../../utils/isNumeric';
import { addPath } from '../../actions';
import {
	findWifiNetworks,
	connectingWifi,
	connectingAp,
	releaseAp,
	connectWifi,
	deleteWifiProfile,
	clearErrorStatus,
	changeWifiUISate
} from '../../actions/networkAction';
import { makeNetworkListArray, findMsgByErrorCode } from './utils/NetworkCommon';
import WirelessItem from './controls/WirelessItem';
import { SpotlightContainerDecorator } from '@enact/spotlight/SpotlightContainerDecorator';
import Icon from '@enact/sandstone/Icon';

const SpotlightContainer = SpotlightContainerDecorator(
	{ preserveId: true, enterTo: 'last-focused' },
	'div'
);
let _foundNetworks = false;
const wpsTimeout = 120000;

class TimerNotification extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showNotification: false,
		};
		this.Timertime = null;
	}

	UNSAFE_componentWillReceiveProps({ open }) {
		if (open) {
			this.setState({
				showNotification: true
			});
			if (this.Timertime === null) {
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

	componentWillUnmount() {
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

	render() {
		return (({ ...rest }) => {
			delete rest.remainTime;
			delete rest.open;
			delete rest.time;
			return <Alert {...rest} open={this.state.showNotification} type="overlay" />
		})(this.props);
	}
}

TimerNotification.propTypes = {
	onClose: PropTypes.func,
	time: PropTypes.number
};

class WifiConnection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wifiEnabled: 'not_yet',
			// wifiNetworks: [],
			myWifiNetworks: [],
			otherWifiNetworks:[],
			wifiNetworksLength: [],
			wpsPBCShowing: false,
			wpsPinShowing: false,
			showErrorDialog: false,
			errorPopupStatus: {},
			showWifiHeaders: props.wifiUIState.showWifiHeaders,
			wifitype: props.wifiUIState.wifitype,
			loading:true
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

	UNSAFE_componentWillReceiveProps(nextProps) {
		const wifiNetworks = nextProps.wifiNetworks;
		const newNetworkList = [];
		let newState = {};
		let connectingConnectedNetwork = null;
		for (let i = 0; i < wifiNetworks.length; i++) {
			if (connectingConnectedNetwork === null && wifiNetworks[i].status !== 'NOT_CONNECTED') {
				if (this.firstClicked) {
					this.scrollTo({ index: 0, animate: false, focus: true });
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
		// console.log('nextProps.wifiUIState:  ',nextProps.wifiUIState);
		// console.log('this.props.storedWifiNetwork:  ',this.props.storedWifiNetwork);
		// console.log('wifiNetworks:  ',wifiNetworks);
		// console.log('myWifiNetworks:  ',wifiNetworks.filter((v)=>this.props.storedWifiNetwork.indexOf(v.ssid) >= 0))
		// console.log('otherWifiNetworks:  ',wifiNetworks.filter((v)=>this.props.storedWifiNetwork.indexOf(v.ssid) < 0))
		newState = {
			...newState,
			wifiNetworksLength: newNetworkList.length,
			...nextProps.wifiUIState,
			myWifiNetworks: wifiNetworks.filter((v)=>this.props.storedWifiNetwork.indexOf(v.ssid) >= 0),
			otherWifiNetworks: wifiNetworks.filter((v)=>this.props.storedWifiNetwork.indexOf(v.ssid) < 0),
			showSpinner: wifiNetworks.length === 0,
			loading:false
		};

		this.setState(newState);
	}

	componentWillUnmount() {
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
				this.props.connectWifi({ network });
				this.props.addPath('Wi-Fi Security');
				this.props.changeWifiUISate(this.state.showWifiHeaders,this.state.wifitype);
			} else {
				this.connectNetwork(network);
			}
		}
	};

	setMyWirelessItem = ({ index }) => {
		return (
			<WirelessItem
				type="mywifi"
				key={index}
				dataIndex={index}
				onClick={this.wirelessItemClicked}
				data-component-id="wirelessItem"
			/>
		);
	};

	setOtherWirelessItem = ({ index }) => {
		return (
			<WirelessItem
				type="otherwifi"
				key={index}
				dataIndex={index}
				onClick={this.wirelessItemClicked}
				data-component-id="wirelessItem"
			/>
		);
	};

	spinnerProps() {
		return {
			children: $L('Searching...'),
			centered: true,
			className: css.wirelessSpinner
		};
	}
	otherWifiNetworksProps() {
		return {
			dataSize: this.state.otherWifiNetworks.length,
			itemSize: ri.scale(120),
			itemRenderer: this.setOtherWirelessItem,
			cbScrollTo: this.getScrollTo
		};
	}
	myWifiNetworksProps() {
		return {
			dataSize: this.state.myWifiNetworks.length,
			itemSize: ri.scale(120),
			itemRenderer: this.setMyWirelessItem,
			cbScrollTo: this.getScrollTo
		};
	}

	wpsPBCClicked() {
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

	wpsPINClicked() {
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

	cancelWPS() {
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
	handleErrorPopupAction(action) {
		if (action === 'retry') {
			const { connectingNetwork } = this.props;
			if (connectingNetwork !== null) {
				let viewModel = null;
				if (connectingNetwork.hidden) {
					viewModel = {
						ssid: connectingNetwork.ssid,
						securityType: connectingNetwork.securityType || 'none',
						retry: true
					};
					this.props.connectWifi({ network: viewModel });
					this.props.addPath('Add Network');
				} else if (connectingNetwork.securityType !== 'none') {
					viewModel = {
						ssid: connectingNetwork.ssid,
						securityType: connectingNetwork.securityType,
						retry: true
					};
					this.props.connectWifi({ network: viewModel });
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

	wifiConnectedProps() {
		if (this.props.wifiState === 'connected') {
			return true;
		} else {
			return false;
		}
	}

	addHiddenNetwork() {
		this.props.connectWifi({ network: {} });
		this.pushPathAddNetwork();
	}
	myWifiClickHander = () => {
		this.setState({
			showWifiHeaders: false,
			wifitype:'mywifi',
		});
		this.props.changeWifiUISate(false,'mywifi');
	};
	otherWifiClickHander = () => {
		this.setState({
			showWifiHeaders: false,
			wifitype:'otherwifi',
		});
		this.props.changeWifiUISate(false,'otherwifi');
	};
	backClickHander = () => {
		this.setState({
			showWifiHeaders: true,
			wifitype:'',
		});
		this.props.changeWifiUISate(true,'');
	};
	showMyWifiList = () =>{
		if(this.state.showSpinner){
			return <Spinner {...this.spinnerProps()} />
		}else if(this.state.myWifiNetworks.length > 0){
			return <VirtualList data-component-id="wifiList" {...this.myWifiNetworksProps()} focusableScrollbar />
		}else {
			return <BodyText centered>{this.state.loading ? 'Loading...' : 'No Data' }</BodyText>
		}
	}
	showOtherWifiList = () =>{
		if(this.state.showSpinner){
			return <Spinner {...this.spinnerProps()} />
		}else if(this.state.otherWifiNetworks.length > 0){
			return <VirtualList data-component-id="wifiList" {...this.otherWifiNetworksProps()} focusableScrollbar />
		}else {
			return <BodyText centered>{this.state.loading ? 'Loading...' : 'No Data' }</BodyText>
		}
	}
	render() {
		console.log("this.state.showWifiHeaders: ",this.state.showWifiHeaders)
		console.log("this.state.wifitype: ",this.state.wifitype)
		this.initAction();
		const wifiConnected = this.wifiConnectedProps();
		const errorMessage = this.parseErrorMessage();
		return (
			<div>
				<div className={this.state.showWifiHeaders ? css.showheader : css.hideheader} direction="left">
					{/* <div className={css.wifilistheader} onClick={this.myWifiClickHander}>
						<BodyText className={css.wifilisttitle} >My Wifi</BodyText>
						<Button size='small' className={css.buttonicon} icon="arrowlargeright"/>
						
					</div> */}
					<Item
						className={mainCss.vspacingCMR}
						onClick={this.myWifiClickHander}
						data-component-id="mywifilist"
						slotAfter={(<Icon size="small">arrowlargeright</Icon>)}
					>
						{$L('My Wi-Fi')}
					</Item>
					<Item
						className={mainCss.vspacingCMR}
						onClick={this.otherWifiClickHander}
						data-component-id="otherwifilist"
						slotAfter={(<Icon size="small">arrowlargeright</Icon>)}
					>
						{$L('Other Wi-Fi')}
					</Item>
					{/* <div className={css.wifilistheader} onClick={this.otherWifiClickHander}>
						<BodyText className={css.wifilisttitle}>Other Wifi</BodyText>
						<Button size='small' className={css.buttonicon} icon="arrowlargeright"/>
					</div> */}
				</div>
				<div className={this.state.showWifiHeaders ? css.hideheader : css.showheader} direction="right">
					<div className={css.wifilistheader1}>
							<Button size='small' onClick={this.backClickHander} icon="arrowhookleft"/>
							<BodyText className={css.wifilisttitle1} >{this.state.wifitype === 'mywifi' ? 'My Wi-Fi List' : 'Other Wi-Fi List'}</BodyText>
					</div>
					<div className={css.wifilistcnt}>
						{this.state.wifitype === 'mywifi' ? this.showMyWifiList() :	this.showOtherWifiList() }
					</div>
				</div>
				<SpotlightContainer containerId="networkStatic" className={this.state.showWifiHeaders ? css.showheader : css.hideheader}>
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
							new IString($L('PIN: {pin}')).format({ pin: this.state.wpsPin }) :
							$L('PIN: ')}
					</span>
					<br />
					<span>{$L("Enter the PIN in your router's settings.")}</span>
					<buttons>
						<Button onClick={this.cancelWPS}>{$L('Cancel')}</Button>
					</buttons>
				</TimerNotification>
				<Alert open={this.state.showErrorDialog} onClose={this.onErrorNotiClosed} type="overlay">
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
							<Button onClick={this.retryError}>{$L('Retry')}</Button>
							<Button onClick={this.cancelError}>{$L('Cancel')}</Button>
						</buttons>
					) : (
						<buttons>
							<Button onClick={this.cancelError}>{$L('Cancel')}</Button>
						</buttons>
					)}
				</Alert>
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

const mapStateToProps = ({ network,storedWifiNetwork,wifiUIState }) => ({
	wifiNetworks: makeNetworkListArray(network.wifiNetworks) || [],
	wifiState: network.wifi && network.wifi.state,
	parseNetworkError: network.parseNetworkError,
	connectingNetwork: network.connectingAP,
	storedWifiNetwork,
	wifiUIState
});

const mapDispatchToProps = dispatch => ({
	addPath(path) {
		dispatch(addPath(path));
	},
	findWifiNetworks() {
		dispatch(findWifiNetworks());
	},
	connectingWifi(params) {
		dispatch(connectingWifi(params));
	},
	connectingAp(params) {
		dispatch(connectingAp(params));
	},
	releaseAp() {
		dispatch(releaseAp());
	},
	connectWifi(params) {
		dispatch(connectWifi(params));
	},
	deleteWifiProfile(params) {
		dispatch(deleteWifiProfile(params));
	},
	clearErrorStatus() {
		dispatch(clearErrorStatus());
	},
	changeWifiUISate(showWifiHeaders,wifitype) {
		dispatch(changeWifiUISate(showWifiHeaders,wifitype));
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WifiConnection);
