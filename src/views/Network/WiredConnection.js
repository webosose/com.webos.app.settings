import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import Button from '@enact/moonstone/Button';
import BodyText from '@enact/moonstone/BodyText';
import Divider from '@enact/moonstone/Divider';

import $L from '@enact/i18n/$L';

import css from '../../style/main.less';
import {getIpInformation, getConnectionStatus} from './utils/NetworkCommon';
import SplitItem from './controls/SplitItem';
import {addPath, removePath} from '../../actions';
import ConnectionStatus from './controls/ConnectionStatus';

class WiredConnection extends React.Component {
	constructor (props) {
		super(props);
		this.onEditClick = this.onEditClick.bind(this);
		// this.pushEditPanel = props.pushPath.bind(this, 'Edit');
		this.pushPathWiredEdit = props.addPath.bind(this, 'Wired Edit');
		this.state = {
			ipSelection: 'ipv4'
		};
	}
	onEditClick () {
		/*
		const params = {
			interfaceName: 'wired',
			ipVersion: this.state.ipSelection
		};
		*/
		// this.props.editPanelSet(params);
		this.pushPathWiredEdit();
	}

	render () {
		const status = getConnectionStatus(this.props.wired);

		let ipMode = $L('IP');
		if (this.props.wired && this.props.wired.method) {
			const method = this.props.wired.method;
			if (method === 'manual') {
				ipMode = $L('IP (Manual)');
			} else if (method === 'dhcp') {
				ipMode = $L('IP (Automatic)');
			}
		}

		const {ipAddress, subnet, gateway, dns} = getIpInformation(this.props.wired, this.state.ipSelection, this.props.supportIPv6);
		if (this.props.wired.state === 'disconnected') {
			return (
				<div >
					<Button small onClick={this.props.removePath} className={css.doneButton} data-component-id="done">{$L('Done')}</Button>
					<BodyText>{$L('Connect your TV to your router or modem with an Ethernet cable to activate your wired network connection.')}</BodyText>
				</div>
			);
		}	else if (this.props.wired.state !== 'disconnected') {
			return (
				<div>
					<ConnectionStatus mode="wired" status={status} data-component-id="connectionStatus" />
					<Divider>{ipMode}</Divider>
					<SplitItem label={$L('IP Address')} data-component-id="ipAddress">{ipAddress || ''}</SplitItem>
					<SplitItem label={this.state.ipSelection === 'ipv4' ? $L('Subnet Mask') : $L('Subnet prefix length')} data-component-id="subnetMask">{subnet || ''}</SplitItem>
					<SplitItem label={$L('Gateway')} data-component-id="gateway">{gateway || ''}</SplitItem>
					<SplitItem label={$L('DNS Server')} data-component-id="dnsServer">{dns || ''}</SplitItem>
					<SplitItem label={$L('MAC Address')} data-component-id="macAddress">{this.props.wiredMac}</SplitItem>
					{this.state.ipSelection === 'ipv4' && <Button small onClick={this.onEditClick} className={css.networkEditButton} data-component-id="edit">{$L('Edit')}</Button>}
				</div>
			);
		}
	}
}

WiredConnection.propTypes = {
	addPath: PropTypes.func,
	removePath: PropTypes.func,
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

const mapDispatchToProps = (dispatch) => ({
	addPath (path) {
		dispatch(addPath(path));
	},
	removePath () {
		dispatch(removePath());
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(WiredConnection);
