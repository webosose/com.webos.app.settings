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
				this.updateTimeInterval(res.utc)
			}
		});
	}
	updateTimeInterval(utc){
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
				this.timerObj = setInterval(()=>{
					currentTime = currentTime + changedSeconds;
					this.setState({
						currentDate: fmt.format(new Date((currentTime) * 1000))
					});
				},updateTime);
			}, diffSeconds*1000);
		}
	}
	componentWillUnmount () {
		if(this.timerObj !== null){
			clearInterval(this.timerObj);
			this.timerObj = null;
		}
		if (this.getEffectiveBroadcastTime !== null) {
			this.getEffectiveBroadcastTime.cancel();
		}
	}

	render () {
		return (
			<div>
				<LabeledItem className={css.vspacingCMR} onClick={this.pushPathLanguage} label={this.props && this.props.menuLanguage ? this.props.menuLanguage : $L('Loading...')} data-component-id="language">{$L('Language')}</LabeledItem>
				<LabeledItem className={css.vspacingCMR} onClick={this.pushPathTimeDate} label={this.state.currentDate ? this.state.currentDate : $L('Loading...')} data-component-id="timeDate">{$L('Time & Date')}</LabeledItem>
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

const mapStateToProps = (state) => ({
	deviceName: state && state.general && state.general.deviceName,
	menuLanguage: state && state.general && state.general.menuLanguage && state.general.menuLanguage.displayValue
});

const mapDispatchToProps = (dispatch) => ({
	addPath (path) {
		dispatch(addPath(path));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(General);
