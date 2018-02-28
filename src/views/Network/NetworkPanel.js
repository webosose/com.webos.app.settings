import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import MainPanel from '../../components/MainPanel';

import Network from './Network';
import WiredConnection from './WiredConnection';
import WiredEdit from './WiredEdit';
import WifiConnection from './WifiConnection';
import AddNetwork from './AddNetwork';
import WifiSecurity from './WifiSecurity';
import Advanced from './Advanced';
import WifiEdit from './WifiEdit';

import {getInfo, getStatus, enableWifi} from '../../actions/networkAction';

const panelMap = {
	'Network': <Network key="Network" />,
	'Wired Connection (Ethernet)': <WiredConnection key="WiredConnection" />,
	'Wired Edit': <WiredEdit key="WiredEdit" />,
	'Wi-Fi Connection': <WifiConnection key="WifiConnection" />,
	'Add Network': <AddNetwork key="AddNetwork" />,
	'Wi-Fi Security': <WifiSecurity key="WifiSecurity" />,
	'Advanced': <Advanced key="Advanced" />,
	'Edit' : <WifiEdit key="WifiEdit" />
};

class NetworkPanel extends React.Component {
	componentDidMount () {
		this.props.getInfo();
		this.props.getStatus();
		this.props.enableWifi();
	}
	render () {
		return (
			<MainPanel {...this.props}>
				{panelMap[this.props.path[this.props.path.length - 1]]}
			</MainPanel>
		);
	}
}

NetworkPanel.propTypes = {
	enableWifi: PropTypes.func,
	getInfo: PropTypes.func,
	getStatus: PropTypes.func,
	path: PropTypes.array
};

const mapDispatchToProps = (dispatch) => ({
	getInfo () {
		dispatch(getInfo());
	},
	getStatus () {
		dispatch(getStatus());
	},
	enableWifi () {
		dispatch(enableWifi());
	}
});

export default connect(null, mapDispatchToProps)(NetworkPanel);
