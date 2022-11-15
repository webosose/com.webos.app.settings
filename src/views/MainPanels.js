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

import LS2Request from '@enact/webos/LS2Request';
import Panels from '@enact/sandstone/Panels';
import IconButton from '@enact/sandstone/Icon';

import css from '../App/App.module.less';
import GeneralPanel from '../views/General/GeneralPanel';
import NetworkPanel from '../views/Network/NetworkPanel';
import NavBar from './NavBar';

import { removePath } from '../actions';
import { getTimeZone, getCountry, getCountryValues, getCountryRegionValues, getTimeZoneValues } from '../actions/globalAction';
const panelMap = ['General', 'Network'];


class MainPanels extends React.Component {
	constructor(props) {
		super(props);

		if (typeof window === 'object' && window.PalmSystem) {
			window.PalmSystem.onclose = this.handleOnClose.bind(this);
		}

		if (typeof document !== 'undefined') {
			const that = this;
			document.addEventListener('webOSLocaleChange', function () {
				if (typeof window === 'object') {

					that.reloadForCountry = true;
					window.close();
				}
			}, false);
		}
	}

	componentDidMount() {
		// this.props.getTimeZone();
		this.props.getCountry();
		this.props.getCountryValues();
		this.props.getCountryRegionValues();
		this.props.getTimeZoneValues();
	}

	handleOnClose() {

		const displayAffinity = JSON.parse(window.PalmSystem.launchParams).displayAffinity

		console.log("displayAffinity is =========> ", displayAffinity)
		if (this.reloadForCountry) {
			new LS2Request().send({
				service: 'luna://com.webos.applicationManager/',
				method: 'launch',
				parameters: {
					id: 'com.palm.app.settings',
					params: { displayAffinity: displayAffinity }
				},
				onSuccess: function (inResponse) {
					console.log('Successfully launched ======>', inResponse);
				},
				onFailure: function (inError) {
					console.log('Failed to launch ======>', inError);
				},
			});
		}
	}

	render() {
		return (
			<div className={css.chrome}>
				<NavBar className={css.nav} />
				<Panels className={css.panels} noCloseButton index={panelMap.indexOf(this.props.category)} noAnimation>
					<GeneralPanel path={this.props.path} data-component-id="general" />
					<NetworkPanel path={this.props.path} data-component-id="network"/>
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

const mapStateToProps = ({ path }) => ({
	category: path[0],
	path: path
});

const mapDispatchToProps = (dispatch) => ({
	removePath() {
		dispatch(removePath());
	},
	getTimeZone() {
		dispatch(getTimeZone());
	},
	getCountry() {
		dispatch(getCountry());
	},
	getCountryValues() {
		dispatch(getCountryValues());
	},
	getCountryRegionValues() {
		dispatch(getCountryRegionValues());
	},
	getTimeZoneValues() {
		dispatch(getTimeZoneValues());
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPanels);
