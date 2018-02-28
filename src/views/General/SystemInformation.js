import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import $L from '@enact/i18n/$L';
import LabeledItem from '@enact/moonstone/LabeledItem';

import css from '../../style/main.less';
import {getInfo} from '../../actions/networkAction';

class SystemInformation extends React.Component {
	constructor (props) {
		super(props);
		this.props.getInfo();
	}

	render () {
		const spotlightValue = true;
		return (
			<div>
				<LabeledItem className={css.vspacingCMR} label={this.props.deviceName ? this.props.deviceName : $L('Loading...')} spotlightDisabled={spotlightValue} data-component-id="deviceName">{$L('Device Name')}</LabeledItem>
				<LabeledItem className={css.vspacingCMR} label={this.props && this.props.webOsVersion && this.props.webOsVersion.coreOSRelease ? this.props.webOsVersion.coreOSRelease : $L('Loading...')} spotlightDisabled={spotlightValue} data-component-id="softwareVersion">{$L('Software Version')}</LabeledItem>
				<LabeledItem className={css.vspacingCMR} label={this.props && this.props.wiredMac ? this.props.wiredMac : $L('Loading...')} spotlightDisabled={spotlightValue} data-component-id="macAddressWired">{$L('MAC Address (Wired)')}</LabeledItem>
				<LabeledItem className={css.vspacingCMR} label={this.props && this.props.wifiMac ? this.props.wifiMac : $L('Loading...')} spotlightDisabled={spotlightValue} data-component-id="macAddressWireless">{$L('MAC Address (Wireless)')}</LabeledItem>
			</div>
		);
	}
}

SystemInformation.propTypes = {
	deviceName: PropTypes.string,
	getInfo: PropTypes.func,
	webOsVersion: PropTypes.object,
	wifiMac: PropTypes.string,
	wiredMac: PropTypes.string
};

const mapStateToProps = ({general, network}) => {
	const {deviceName, webOsVersion} = general;
	const {wifiInfo, wiredInfo} = network;
	return {
		deviceName: deviceName,
		webOsVersion : webOsVersion,
		wifiMac: (wifiInfo && wifiInfo.macAddress) || '',
		wiredMac: (wiredInfo && wiredInfo.macAddress) || ''
	};
};

const mapDispatchToProps = (dispatch) => ({
	getInfo () {
		dispatch(getInfo());
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(SystemInformation);
