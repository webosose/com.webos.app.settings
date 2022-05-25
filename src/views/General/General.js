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

import DateFmt from '@enact/i18n/ilib/lib/DateFmt';
import LabeledItem from '@enact/moonstone/LabeledItem';
import LS2Request from '@enact/webos/LS2Request';
import $L from '@enact/i18n/$L';

import {addPath} from '../../actions';

import css from '../../style/main.less';

class General extends React.Component {
	constructor (props) {
		super(props);

		this.pushPathSystemInformation = props.addPath.bind(this, 'System Information');
		this.pushPathLanguage = props.addPath.bind(this, 'Language');
		this.pushPathTimeDate = props.addPath.bind(this, 'Time & Date');
		this.getEffectiveBroadcastTime = null;
		this.timerObj = null;
		this.state = {
			currentDate: null
		};
	}

	componentDidMount () {
		this.getEffectiveBroadcastTime = new LS2Request().send({
			service: 'luna://com.palm.systemservice/time',
			method: 'getSystemTime',
			parameters: {subscribe: true},
			onSuccess: (res) => {
				const fmt = new DateFmt({
					type: 'datetime',
					length: 'full',
					date: 'dmwy'
				});
				this.setState({
					currentDate: fmt.format(new Date(res.utc * 1000))
				});
				this.updateTimeInterval(res.utc);
			}
		});
	}

	componentWillUnmount () {
		if (this.timerObj !== null) {
			clearInterval(this.timerObj);
			this.timerObj = null;
		}
		if (this.getEffectiveBroadcastTime !== null) {
			this.getEffectiveBroadcastTime.cancel();
		}
	}

	updateTimeInterval (utc) {
		const fmt = new DateFmt({
			type: 'datetime',
			length: 'full',
			date: 'dmwy'
		});
		if (this.timerObj === null) {
			const updateTime = 60000;
			const changedSeconds = 60;
			let currentTime = utc;
			const diffSeconds = changedSeconds - new Date(currentTime * 1000).getSeconds();
			this.timerObj = setTimeout(() => {
				currentTime = currentTime + diffSeconds;
				this.setState({
					currentDate: fmt.format(new Date((currentTime) * 1000))
				});
				this.timerObj = setInterval(() => {
					currentTime = currentTime + changedSeconds;
					this.setState({
						currentDate: fmt.format(new Date((currentTime) * 1000))
					});
				}, updateTime);
			}, diffSeconds * 1000);
		}
	}

	render () {
		return (
			<div>
				<LabeledItem className={css.vspacingCMR} onClick={this.pushPathLanguage} label={this.props && this.props.menuLanguage ? this.props.menuLanguage : $L('Loading...')} data-component-id="language">{$L('Language')}</LabeledItem>
				<LabeledItem className={css.vspacingCMR} disabled={!this.props.timeDataLoaded } onClick={this.pushPathTimeDate} label={this.state.currentDate ? this.state.currentDate : $L('Loading...')} data-component-id="timeDate">{$L('Time & Date')}</LabeledItem>
				<LabeledItem className={css.vspacingCMR} onClick={this.pushPathSystemInformation} label={this.props.deviceName ? this.props.deviceName : $L('Loading...')} data-component-id="systemInformation">{$L('System Information')}</LabeledItem>
			</div>
		);
	}
}

General.propTypes = {
	addPath: PropTypes.func,
	deviceName: PropTypes.string,
	menuLanguage: PropTypes.string
};

const mapStateToProps = (state) => {
	return {
		deviceName: state && state.general && state.general.deviceName,
		menuLanguage: state && state.general && state.general.menuLanguage && state.general.menuLanguage.displayValue,
		timeDataLoaded:  state.timeZoneData.loaded
	}
}
//);

const mapDispatchToProps = (dispatch) => ({
	addPath (path) {
		dispatch(addPath(path));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(General);
