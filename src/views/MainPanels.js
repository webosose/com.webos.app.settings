import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import Panels from '@enact/moonstone/Panels';
import IconButton from '@enact/moonstone/IconButton';

import css from '../App/App.less';
import GeneralPanel from '../views/General/GeneralPanel';
import NetworkPanel from '../views/Network/NetworkPanel';
import NavBar from './NavBar';

import {removePath} from '../actions';
import {getTimeZone, getCountry, getCountryValues, getCountryRegionValues, getTimeZoneValues} from '../actions/globalAction';

const panelMap = ['General', 'Network'];

class MainPanels extends React.Component {
	constructor (props) {
		super(props);

		if (typeof document !== 'undefined') {
			document.addEventListener('webOSLocaleChange', function () {
				if (typeof window === 'object') {
					let newPath = '';
					const originalPath = window.location.href;

					if (typeof originalPath.split('?')[1] !== 'undefined' && originalPath.split('?')[1] === 'isUpdated') {
						newPath = originalPath;
					} else {
						newPath = originalPath + '?isUpdated';
					}
					window.location.href = newPath;
				}
			}, false);
		}
	}

	componentDidMount () {
		this.props.getTimeZone();
		this.props.getCountry();
		this.props.getCountryValues();
		this.props.getCountryRegionValues();
		this.props.getTimeZoneValues();
	}

	render () {
		return (
			<div className={css.chrome}>
				<NavBar className={css.nav} />
				<Panels className={css.panels} noCloseButton index={panelMap.indexOf(this.props.category)}>
					<GeneralPanel path={this.props.path} data-component-id="general" />
					<NetworkPanel path={this.props.path} data-component-id="network" />
				</Panels>
				<IconButton
					backgroundOpacity={'transparent'}
					aria-label={'Back'}
					className={css.backButton}
					onClick={this.props.removePath}
					id="backButton"
				>
					arrowhookleft
				</IconButton>
			</div>
		);
	}
}

MainPanels.propTypes = {
	category: PropTypes.string,
	getCountry: PropTypes.func,
	getCountryRegionValues: PropTypes.func,
	getCountryValues: PropTypes.func,
	getTimeZone: PropTypes.func,
	getTimeZoneValues: PropTypes.func,
	path: PropTypes.array,
	removePath: PropTypes.func
};

const mapStateToProps = ({path}) => ({
	category: path[0],
	path: path
});

const mapDispatchToProps = (dispatch) => ({
	removePath () {
		dispatch(removePath());
	},
	getTimeZone () {
		dispatch(getTimeZone());
	},
	getCountry () {
		dispatch(getCountry());
	},
	getCountryValues () {
		dispatch(getCountryValues());
	},
	getCountryRegionValues () {
		dispatch(getCountryRegionValues());
	},
	getTimeZoneValues () {
		dispatch(getTimeZoneValues());
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPanels);
