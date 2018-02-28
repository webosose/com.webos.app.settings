import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import $L from '@enact/i18n/$L';
import LabeledItem from '@enact/moonstone/LabeledItem';

import {ExpandableInputBase} from '@enact/moonstone/ExpandableInput';
import {Expandable} from '@enact/moonstone/ExpandableItem';

import {addPath} from '../../actions';
import {setSystemSettings} from '../../actions';

import css from '../../style/main.less';

const CustomExpandableInput = Expandable(ExpandableInputBase);

class Network extends React.Component {
	constructor (props) {
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

	componentWillReceiveProps (nextProps) {
		if (this.nameOpened) {
			this.setState({
				deviceName: nextProps.deviceName
			});
		}
	}

	deviceNameInputChange (e) {
		if (toString.call(e.value) !== '[object String]') {
			return true;
		}
		const trimmedValue = e.value.trim();
		if (unescape(encodeURI(trimmedValue)).length < 31) {
			this.setState({
				deviceName: e.value
			});
		}
	}

	deviceNameClosed () {
		let param = {};
		let newValue = this.state.deviceName.trim();
		if (newValue === '') {
			newValue = this.props.deviceName;
			this.setState({
				deviceName: newValue
			});
		}
		param.category = 'network';
		param.settings = {};
		param.settings['deviceName'] = newValue;
		this.props.setSystemSettings(param);
		this.nameOpened = false;
	}

	deviceNameOpened = () => {
		this.nameOpened = true;
	}

	setDeviceNameProps () {
		return {
			title: $L('Device Name'),
			value: this.state.deviceName,
			onChange: this.deviceNameInputChange,
			onClose: this.deviceNameClosed,
			onOpen: this.deviceNameOpened,
			placeholder: $L('Loading...')
		};
	}


	render () {
		const deviceNameProps = this.setDeviceNameProps();
		return (
			<div>
				<CustomExpandableInput {...deviceNameProps} className={css.vspacingCMR} data-component-id="deviceName" />
				<LabeledItem className={css.vspacingCMR} onClick={this.pushPathWiredConnection} label={(this.props.wiredOnInternet === 'yes') ? $L('Connected to Internet') : $L('Not Connected')} data-component-id="wiredConnection">{$L('Wired Connection (Ethernet)')}</LabeledItem>
				<LabeledItem className={css.vspacingCMR} onClick={this.pushPathWifiConnection} label={(this.props.wifiOnInternet === 'yes') ? $L('Connected to Internet') : $L('Not Connected')} data-component-id="WifiConnection">{$L('Wi-Fi Connection')}</LabeledItem>
			</div>
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

const mapStateToProps = ({network, general}) => ({
	deviceName: general.deviceName,
	ipAddress: network.wired && network.wired.ipAddress,
	state: network.wifi && network.wifi.state,
	wifiOnInternet: network.wifi && network.wifi.onInternet,
	wiredOnInternet: network.wired && network.wired.onInternet
});

const mapDispatchToProps = (dispatch) => ({
	addPath (path) {
		dispatch(addPath(path));
	},
	setSystemSettings (params) {
		dispatch(setSystemSettings(params));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Network);
