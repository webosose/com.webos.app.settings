import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import Button from '@enact/moonstone/Button';
import Divider from '@enact/moonstone/Divider';
import $L from '@enact/i18n/$L';
import css from '../../style/main.less';
import {getIpInformation, getConnectionStatus} from './utils/NetworkCommon';
import ConnectionStatus from './controls/ConnectionStatus';
import SplitItem from './controls/SplitItem';
import {addPath, removePath} from '../../actions';

class Advanced extends React.Component {
	constructor (props) {
		super(props);
		this.onEditClick = this.onEditClick.bind(this);
		this.pushPathWifiEdit = props.addPath.bind(this, 'Edit');
		this.state = {
			ipSelection: 'ipv4',
			status: getConnectionStatus(this.props.wifi)
		};
		if (getConnectionStatus(this.props.wifi) === 'NOT_CONNECTED') {
			this.props.removePath();
		}
	}
	componentWillReceiveProps (nextProps) {
		this.setState({
			status: getConnectionStatus(nextProps.wifi)
		});
	}
	componentDidUpdate (prevProps, prevState) {
		if (prevState.status !== 'NOT_CONNECTED' && this.state.status === 'NOT_CONNECTED') {
			this.props.removePath();
		}
	}

	onEditClick () {
		/*
		const params = {
			interfaceName: 'wired',
			ipVersion: this.state.ipSelection
		};
		*/
		// this.props.editPanelSet(params);
		this.pushPathWifiEdit();
	}

	render () {
		const {ipAddress, subnet, gateway, dns} = getIpInformation(this.props.wifi, this.state.ipSelection, this.props.supportIPv6);
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
				<SplitItem label={$L('IP Address')} data-component-id="ipAddress">{ipAddress || ''}</SplitItem>
				<SplitItem label={this.state.ipSelection === 'ipv4' ? $L('Subnet Mask') : $L('Subnet prefix length')} data-component-id="subnetMask">{subnet || ''}</SplitItem>
				<SplitItem label={$L('Gateway')} data-component-id="gateway">{gateway || ''}</SplitItem>
				<SplitItem label={$L('DNS Server')} data-component-id="dnsServer">{dns || ''}</SplitItem>
				<SplitItem label={$L('MAC Address')} data-component-id="macAddress">{this.props.wifiMac}</SplitItem>
				{this.state.ipSelection === 'ipv4' && <Button small onClick={this.onEditClick} className={css.networkEditButton} data-component-id="edit">{$L('Edit')}</Button>}
			</div>
		);
	}
}

Advanced.propTypes = {
	addPath: PropTypes.func,
	removePath: PropTypes.func,
	supportIPv6: PropTypes.bool,
	wifi: PropTypes.object,
	wifiMac: PropTypes.string
};

const mapStateToProps = ({network, intl}) => {
	const {wifi, wifiInfo} = network;
	const {country} = intl;
	return {
		wifi: wifi,
		supportIPv6: country === 'JPN',
		wifiMac: (wifiInfo && wifiInfo.macAddress) || ''
	};
};

const mapDispatchToProps = (dispatch) => ({
	addPath (path) {
		dispatch(addPath(path));
	},
	removePath () {
		dispatch(removePath());
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Advanced);
