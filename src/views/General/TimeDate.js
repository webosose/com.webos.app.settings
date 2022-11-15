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
import Spotlight from '@enact/spotlight';
import LS2Request from '@enact/webos/LS2Request';
// import SwitchItem from '@enact/moonstone/SwitchItem';
import SwitchItem from '@enact/sandstone/SwitchItem';
// import TimePicker from '@enact/moonstone/TimePicker';
import TimePicker from '@enact/sandstone/TimePicker';
// import DatePicker from '@enact/moonstone/DatePicker';
import DatePicker from '@enact/sandstone/DatePicker';
// import ExpandableList from '@enact/moonstone/ExpandableList';
// import ExpandableList from '@enact/sandstone/ExpandableList';
import $L from '@enact/i18n/$L';

import css from '../../style/main.module.less';
import { setSystemSettings, setPreferences, setSystemTime } from '../../actions';

import { debounce } from './utils/GeneralUtils';
// import { Scroller } from '@enact/moonstone/Scroller';
import { Scroller } from '@enact/sandstone/Scroller';
import LabeledItem from '@enact/sandstone/Item';
import Icon from '@enact/sandstone/Icon';
import VirtualList from '@enact/sandstone/VirtualList';
import ri from '@enact/ui/resolution';
import RadioItem from '@enact/sandstone/RadioItem';

const
	maxYear = 2037,
	minYear = 2017,
	updateTime = 60000;

class RadioItemList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { data, dataIndex, selectedItem, onClick, ...rest } = this.props;
		delete rest.clickItem;

		return (
			<RadioItem
				{...rest}
				className={css['general-virtual-list-item-layout']}
				data-index={dataIndex}
				selected={dataIndex === selectedItem}
				onClick={onClick}
			>
				{data}
			</RadioItem>
		);
	}

}

class TimeDate extends React.Component {
	constructor(props) {
		super(props);

		// debouncer for pickers...
		this.onChangeDate = this.onChange.bind(this, 'date');
		this.onChangeTime = this.onChange.bind(this, 'time');

		this.timerObj = null;
		this.state = {
			currentUtc: null,
			currentDate: null,
			datePickerOpen: false,
			regionExpandableOpen: false,
			regionSelected: -1,
			timePickerOpen: false,
			timezoneExpandableOpen: false,
			timezoneSelected: this.props.timeZone.timezoneProps.selected,
			showDetails: null,
			timeOpen: false,
			dateOpen: false,
			regionOpen: false,
			timeZoneOpen: false
		};
	}

	componentDidMount() {
		const currentContainer = Spotlight.getActiveContainer();
		if (currentContainer !== 'spotlightRootDecorator') {
			Spotlight.focus(Spotlight.getActiveContainer());
		}
		this.regionList.sort();
		this.defaultRegion.sort(function (a, b) {
			if (a.displayName < b.displayName) {
				return -1;
			} else if (a.displayName > b.displayName) {
				return 1;
			} else {
				return 0;
			}
		});

		this.getEffectiveBroadcastTime = new LS2Request().send({
			service: 'luna://com.palm.systemservice/time',
			method: 'getSystemTime',
			parameters: { subscribe: false },
			onSuccess: (res) => {
				this.setState({
					currentUtc: res.utc * 1000,
					currentDate: new Date(res.utc * 1000)
				});

				if (this.timerObj === null) {
					this.timerObj = setInterval(() => {
						this.setClock(updateTime);
					}, updateTime);
				}

				let timeZone = this.props.timeZone;
				let zone = timeZone.timezoneList[timeZone.timezoneProps.selected].ZoneID.split('/')[0];

				for (let i = 0; i < this.defaultRegion.length; i++) {
					if (this.defaultRegion[i].ZoneID.split('/')[0] === zone) {
						this.setState({
							regionSelected: i
						});
					}
				}
			}
		});
		this.setDisplayTime()
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.state.timezoneSelected !== nextProps.timeZone.timezoneProps.selected) {
			this.setState({
				timezoneSelected: nextProps.timeZone.timezoneProps.selected
			});
			this.setDisplayTime()
		}
	}
	componentWillUnmount() {
		clearInterval(this.timerObj);
		this.timerObj = null;
		this.getEffectiveBroadcastTime.cancel();
	}

	defaultRegion = [
		{ // Africa
			City: 'Cairo',
			Country: 'Egypt',
			CountryCode: 'EG',
			Description: 'Eastern European Time',
			displayName: $L('Africa'),
			offsetFromUTC: 120,
			supportDST: 0,
			ZoneID: 'Africa/Cairo'
		},
		{ // America
			City: 'Los Angeles',
			Country: 'United States of America',
			CountryCode: 'US',
			Description: 'Pacific Time',
			displayName: $L('America'), // Americas
			offsetFromUTC: -480,
			preferred: true,
			supportDST: 0,
			ZoneID: 'America/Los_Angeles'
		},
		{ // Asia
			City: 'Seoul',
			Country: 'South Korea',
			CountryCode: 'KR',
			Description: 'Korea Time',
			displayName: $L('Asia'),
			offsetFromUTC: 540,
			preferred: true,
			supportDST: 0,
			ZoneID: 'Asia/Seoul'
		},
		{ // Atlantic
			City: 'Madeira',
			Country: 'Portugal',
			CountryCode: 'PT',
			Description: 'Western European Time',
			displayName: $L('Atlantic'), // The Atlantic Ocean
			offsetFromUTC: 0,
			supportDST: 0,
			ZoneID: 'Atlantic/Madeira'
		},
		{ // Australia
			City: 'Sydney',
			Country: 'Australia',
			CountryCode: 'AU',
			Description: 'Eastern Time (New South Wales)',
			displayName: $L('Australia'),
			offsetFromUTC: 600,
			preferred: true,
			supportDST: 0,
			ZoneID: 'Australia/Sydney'
		},
		{ // Europe
			City: 'London',
			Country: 'United Kingdom',
			CountryCode: 'GB',
			Description: 'Greenwich Mean Time',
			displayName: $L('Europe'),
			offsetFromUTC: 0,
			preferred: true,
			supportDST: 0,
			ZoneID: 'Europe/London'
		},
		{ // Indian
			Country: 'Maldives',
			CountryCode: 'MV',
			Description: 'Maldives Time',
			displayName: $L('Indian'), // The Indian Ocean
			offsetFromUTC: 300,
			preferred: true,
			supportDST: 0,
			ZoneID: 'Indian/Maldives'
		},
		{ // Pacific
			Country: 'Guam',
			CountryCode: 'GU',
			Description: 'Chamorro Time',
			displayName: $L('Pacific'), // The Pacific Ocean
			offsetFromUTC: 600,
			supportDST: 0,
			ZoneID: 'Pacific/Guam'
		}
	];

	regionList = [ // Region string is converted to the following string.
		$L('Africa'),
		$L('America'), // Americas
		$L('Asia'),
		$L('Atlantic'), // The Atlantic Ocean
		$L('Australia'),
		$L('Europe'),
		$L('Indian'), // The Indian Ocean
		$L('Pacific') // The Pacific Ocean
	];

	onChange(mode, event) {
		if (mode === 'date') {
			let myDate = new Date(event.value);
			this.setState({ currentDate: myDate });

			let obj = {};
			obj.val = event.value;
			obj.type = 'date';

			return debounce(this.updateTimeDate, 1000, this, [obj]);
		} else if (mode === 'time') {
			let myDate = new Date(event.value);
			this.setState({ currentDate: myDate });

			let obj = {};
			obj.val = event.value;
			obj.type = 'time';
			return debounce(this.updateTimeDate, 1000, this, [obj]);
		}
	}

	closeDatePicker = () => {
		this.setState({ datePickerOpen: false });
	};

	closeRegionExpandable = () => {
		this.setState({
			regionExpandableOpen: false
		});
	};

	closeTimePicker = () => {
		this.setState({
			timePickerOpen: false
		});
	};

	closeTimezoneExpandable = () => {
		this.setState({
			timezoneExpandableOpen: false
		});
	};

	openDatePicker = () => {
		this.setState({
			datePickerOpen: true,
			timePickerOpen: false
		});
	};

	openRegionExpandable = () => {
		this.setState({
			regionExpandableOpen: true,
			timezoneExpandableOpen: false
		});
	};

	openTimePicker = () => {
		this.setState({
			timePickerOpen: true,
			datePickerOpen: false
		});
	};

	openTimezoneExpandable = () => {
		this.setState({
			regionExpandableOpen: false,
			timezoneExpandableOpen: true
		});
	};

	selectRegion = (ev) => {
		this.setState({
			regionSelected: ev,
			regionOpen: false
		});
		this.setTimezone(this.defaultRegion[ev]);
	};

	selectTimezone = (ev) => {
		if (ev.selected === null) {
			return;
		}

		if (ev.data !== 'Custom') {
			this.setState({
				timezoneSelected: ev.selected,
				timeZoneOpen: false,
			});
			this.setTimezone(this.props.timeZone.timezoneList[ev.selected]);
		}
	};

	setAutomatic = () => {
		this.setState({
			timePickerOpen: false,
			datePickerOpen: false
		});

		let val = !this.props.useNetworkTime;

		this.props.setSystemSettings({ category: 'time', settings: { autoClock: val ? 'on' : 'off' } });
		this.props.setPreferences({ useNetworkTime: val });
	};

	setClock = (miliSeconds) => {
		let adjustedUtc = this.state.currentUtc + miliSeconds;
		let newDate = new Date(adjustedUtc);
		if (newDate.getFullYear() === 2038) {
			clearInterval(this.timerObj);
			this.timerObj = null;
		} else {
			this.setState({
				currentUtc: adjustedUtc,
				currentDate: new Date(adjustedUtc)
			});
		}
	};

	setTimezone(value) {
		this.props.setSystemSettings({
			category: 'time',
			settings: { timeZone: value },
			component: 'GENERAL'
		});

		this.props.setPreferences({ timeZone: value });
	}

	updateTimeDate({ val, type }) {
		let newTime = val;
		let newDate = val;
		let newTimeDate = new Date();

		// this.clearTimer();

		// because of linux 2038 problem(in 32bit)
		if (newDate) {
			if (newDate.getFullYear() > maxYear) {
				return;
			}
		}

		if (type === 'time') {
			newTimeDate.setHours(newTime.getHours(), newTime.getMinutes(), 0, 0);
		} else {
			newTimeDate.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
		}
		let param = {};
		param.utc = Math.floor(newTimeDate.getTime() / 1000);
		this.props.setSystemTime(param);
		this.props.setSystemSettings(param);
		this.setDisplayTime(newTime)
	}

	setDisplayTime = (newTime) => {
		let dt = newTime ? newTime : new Date();
		let hours = dt.getHours(); // gives the value in 24 hours format
		let AmOrPm = hours >= 12 ? 'pm' : 'am';
		hours = (hours % 12) || 12;
		let minutes = dt.getMinutes();
		let displayMinutes = minutes < 10 ? '0' + minutes : minutes;
		let finalTime = hours + ":" + displayMinutes + " " + AmOrPm;
		this.setState({
			displayTime: finalTime
		})
		this.setDisplayDate(newTime)
	}

	setDisplayDate = (newTime) => {
		let newDate = newTime ? newTime : new Date()
		return this.setState({
			displayDate: newDate
		})
	}

	toggleDetails = (data) => {
		if (data === "time") {
			this.setState({
				timeOpen: !this.state.timeOpen,   //eslint-disable-line react/no-access-state-in-setstate
				dateOpen: false,
			})
		} else if (data === "date") {
			this.setState({
				timeOpen: false,
				dateOpen: !this.state.dateOpen,   //eslint-disable-line react/no-access-state-in-setstate
			})
		} else if (data === "region") {
			this.setState({
				regionOpen: !this.state.regionOpen,   //eslint-disable-line react/no-access-state-in-setstate
				timeZoneOpen: false
			})
		} else if (data === "timeZone") {
			this.setState({
				regionOpen: false,
				timeZoneOpen: !this.state.timeZoneOpen    //eslint-disable-line react/no-access-state-in-setstate
			})
		}
	}

	RegionListRadioItemComponent = ({ index }) => {
		return (
			<RadioItemList
				key={index}
				data={this.regionList[index]}
				dataIndex={index}
				selectedItem={this.state.regionSelected}
				onClick={() => this.selectRegion(index)}   //eslint-disable-line react/jsx-no-bind
			/>
		);
	};

	TimeZoneListRadioItemComponent = ({ index }) => {
		return (
			<RadioItemList
				key={index}
				data={this.props.timeZone.timezoneProps.children[index]}
				dataIndex={index}
				selectedItem={this.state.timezoneSelected}
				onClick={this.selectTimezone}
			/>
		);
	};


	render() {
		return (
			<Scroller>
				<div>
					<SwitchItem
						className={css.vspacingCMR}
						disabled={false}
						onToggle={this.setAutomatic}
						selected={this.props.useNetworkTime}
					>
						{$L('Set Automatically')}
					</SwitchItem>

					<LabeledItem
						onClick={() => this.toggleDetails("time")}  //eslint-disable-line react/jsx-no-bind
						slotAfter={this.state.timeOpen ? <Icon data-testid={'nextPanelIcon'}>arrowsmallup</Icon> : <Icon data-testid={'nextPanelIcon'}>arrowsmalldown</Icon>}
						className={css.vspacingCMR}
						label={this.state.displayTime}
						disabled={this.props.useNetworkTime}>{$L('Time')}
					</LabeledItem>

					{this.state.timeOpen && <TimePicker
						className={css.vspacingCMR}
						title={$L('Time')}
						noneText={$L('Set the current time manually.')}
						disabled={this.props.useNetworkTime}
						value={this.state.currentDate}
						open={this.state.timePickerOpen}
						onOpen={this.openTimePicker}
						onClose={this.closeTimePicker}
						onChange={this.onChangeTime}
						noLabels
					/>}

					<LabeledItem
						onClick={() => this.toggleDetails("date")}   //eslint-disable-line react/jsx-no-bind
						slotAfter={this.state.dateOpen ? <Icon data-testid={'nextPanelIcon'}>arrowsmallup</Icon> : <Icon data-testid={'nextPanelIcon'}>arrowsmalldown</Icon>}
						className={css.vspacingCMR}
						label={this.state.displayDate && this.state.displayDate.toString().slice(0, 16)}
						disabled={this.props.useNetworkTime}>{$L('Date')}</LabeledItem>

					{this.state.dateOpen && <DatePicker
						className={css.vspacingCMR}
						title={$L('Date')}
						noneText={$L('Set the current date manually.')}
						minYear={minYear}
						maxYear={maxYear}
						disabled={this.props.useNetworkTime}
						value={this.state.currentDate}
						open={this.state.datePickerOpen}
						onOpen={this.openDatePicker}
						onClose={this.closeDatePicker}
						onChange={this.onChangeDate}
						noLabels
					/>
					}

					<LabeledItem
						onClick={() => this.toggleDetails("region")}   //eslint-disable-line react/jsx-no-bind
						slotAfter={this.state.regionOpen ? <Icon data-testid={'nextPanelIcon'}>arrowsmallup</Icon> : <Icon data-testid={'nextPanelIcon'}>arrowsmalldown</Icon>}
						className={css.vspacingCMR}
						label={this.defaultRegion[this.state.regionSelected] && this.defaultRegion[this.state.regionSelected].displayName}
					>{$L('Region')}</LabeledItem>

					{this.state.regionOpen && <VirtualList
						itemRenderer={this.RegionListRadioItemComponent}
						dataSize={this.regionList.length}
						itemSize={ri.scale(100)}
						focusableScrollbar
					/>}

					<LabeledItem
						onClick={() => this.toggleDetails("timeZone")}   //eslint-disable-line react/jsx-no-bind
						slotAfter={this.state.timeZoneOpen ? <Icon data-testid={'nextPanelIcon'}>arrowsmallup</Icon> : <Icon data-testid={'nextPanelIcon'}>arrowsmalldown</Icon>}
						className={css.vspacingCMR}
						label={this.props.timeZone.timezoneProps.children[this.state.timezoneSelected]}
					>{$L('TimeZone')}</LabeledItem>

					{this.state.timeZoneOpen && <VirtualList
						itemRenderer={this.TimeZoneListRadioItemComponent}
						dataSize={this.props.timeZone.timezoneProps.children.length}
						itemSize={ri.scale(100)}
						focusableScrollbar
					/>}
				</div>
			</Scroller>
		);
	}
}

TimeDate.propTypes = {
	setPreferences: PropTypes.func,
	setSystemSettings: PropTypes.func,
	setSystemTime: PropTypes.func,
	timeZone: PropTypes.object,
	useNetworkTime: PropTypes.bool
};

const mapStateToProps = ({ intl, error, timeZoneData }) => {
	let { useNetworkTime } = intl;
	return {
		useNetworkTime: useNetworkTime,
		timeZone: timeZoneData,
		error: error
	};
};

const mapDispatchToProps = (dispatch) => ({
	setSystemSettings(param) {
		dispatch(setSystemSettings(param));
	},
	setPreferences(param) {
		dispatch(setPreferences(param));
	},
	setSystemTime(param) {
		dispatch(setSystemTime(param));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeDate);
