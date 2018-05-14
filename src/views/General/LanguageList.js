import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import $L from '@enact/i18n/$L';
import IString from '@enact/i18n/ilib/lib/IString';
import ri from '@enact/ui/resolution';
import Spinner from '@enact/moonstone/Spinner';
import Notification from '@enact/moonstone/Notification';
import VirtualList from '@enact/moonstone/VirtualList';
import RadioItem from '@enact/moonstone/RadioItem';
import CheckboxItem from '@enact/moonstone/CheckboxItem';
import Button from '@enact/moonstone/Button';
import {Panel} from '@enact/moonstone/Panels';

import {setSystemSettings} from '../../actions';
import {getDefaultVkbLanguage} from './utils/GeneralUtils';

import css from '../../App/App.less';

class LanguageListCheckboxItem extends React.Component {
	constructor (props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick () {
		const language = {};
		language.displayValue = this.props.data.displayValue;
		language.spec = this.props.data.spec;

		this.props.clickItem(language);
	}

	render () {
		const {data, dataIndex, selectedLanguage, defaultLanguages, ...rest} = this.props;
		delete rest.clickItem;
		// delete rest.defaultLanguages;

		return (
			<CheckboxItem
				{...rest}
				className={css['general-virtual-list-item-layout']}
				data-index={dataIndex}
				selected={selectedLanguage.spec.indexOf(data.spec) > -1}
				disabled={defaultLanguages.indexOf(data.spec) > -1}
				onToggle={this.onClick}
			>
				{data.displayValue}
			</CheckboxItem>
		);
	}
}

class LanguageListRadioItem extends React.Component {
	constructor (props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick () {
		if (this.props.selectedLanguage.spec === this.props.data.spec) {
			return;
		}

		const language = {};
		language.displayValue = this.props.data.displayValue;
		language.spec = this.props.data.spec;

		this.props.clickItem(language);
	}

	render () {
		const {data, dataIndex, selectedLanguage, ...rest} = this.props;
		delete rest.clickItem;

		return (
			<RadioItem
				{...rest}
				className={css['general-virtual-list-item-layout']}
				data-index={dataIndex}
				selected={selectedLanguage.spec === data.spec}
				disabled={data.disabled}
				onToggle={this.onClick}
			>
				{data.displayValue}
			</RadioItem>
		);
	}

}

class LanguageList extends React.Component {
	constructor (props) {
		super(props);

		this.saveLanguages = this.saveLanguages.bind(this);

		this.confirmPopupClose = this.confirmPopupClose.bind(this);
		this.confirmPopupNo = this.confirmPopupNo.bind(this);
		this.confirmPopupYes = this.confirmPopupYes.bind(this);
		this.loadingPopupClose = this.loadingPopupClose.bind(this);
		this.removePopupClose = this.removePopupClose.bind(this);

		this.state = {
			confirmPopupShowing: false,
			loadingPopupShowing:false,
			removePopupShowing: false,
			selectedLanguage: this.props.mode === 'menuLanguage' ? this.props.menuLanguage : this.props.vkbLanguage,
			selectedLanguages: this.props.mode === 'menuLanguage' ? this.props.menuLanguages : this.props.vkbLanguages,
			selectedComponent: this.props.mode === 'menuLanguage' ? this.radioItemComponent : this.checkboxItemComponent,
			menu: this.props.menuLanguage.spec,
			stt: this.props.sttLanguage.spec,
			aud: this.props.audioLanguage.spec,
			aud2: this.props.audioLanguage2.spec,
			vkb: this.props.vkbLanguage.spec
		};
	}

	componentDidMount () {
	}

	saveLanguages (currentLanguage) {
		if (this.props.mode === 'menuLanguage') {
			this.setState({
				menu: currentLanguage.spec,
				confirmPopupShowing: true
			});
		} else if (this.props.mode === 'vkbLanguage') {
			let index = this.state.selectedLanguage.spec.indexOf(currentLanguage.spec);

			// Save vkb Language
			if (index === -1) {

				if (this.state.selectedLanguage.spec.length >= 5) {
					this.setState({
						removePopupShowing: true
					});
					return;
				}
				this.state.selectedLanguage.displayValue.push(currentLanguage.displayValue);
				this.state.selectedLanguage.spec.push(currentLanguage.spec);
			} else {
				this.state.selectedLanguage.displayValue.splice(index, 1);
				this.state.selectedLanguage.spec.splice(index, 1);
			}

			this.setState({vkb: this.state.selectedLanguage.spec});
			this.lunaSendSetSystemSettings();
		}
	}

	lunaSendSetSystemSettings = () => {
		let info = {
			'locales': {
				'UI': this.state.menu,
				'STT': this.state.stt,
				'FMT': this.state.menu,
				'NLP': this.state.stt,
				'TV': this.state.menu,
				'AUD': this.state.aud,
				'AUD2': this.state.aud2
			},
			'keyboards' : this.state.vkb
		};

		this.props.setSystemSettings({settings: {localeInfo: info}});
	}

	confirmPopupClose () {
		this.confirmPopupNo();
	}

	confirmPopupNo () {
		this.setState({
			confirmPopupShowing: false
		});
	}

	confirmPopupYes () {
		this.setState({
			confirmPopupShowing: false
		});

		this.setState({
			loadingPopupShowing: true
		});

		// get vkb languages for selected menu language
		if (this.state.vkb) {
			let defaultLang = this.state.menu.split('-');

			switch (defaultLang) {
				case 'as':	// keyboard does not support these languages. set it to Hindi
				case 'bn':
				case 'gu':
				case 'kn':
				case 'ml':
				case 'mr':
				case 'pa':
				case 'ta':
				case 'te':
				case 'ur':
					defaultLang = 'hi';
					break;
				case 'zh': // Chinese letters
					if (this.state.menu.spec.indexOf('Hans') >= 0) {
						defaultLang = 'zh-Hans';
					} else {
						defaultLang = 'zh-Hant';
					}
					break;
				case 'uz': // uzbek
					if (this.state.menu.spec.indexOf('Latn') >= 0) {
						defaultLang = 'uz-Latn';
					} else {
						defaultLang = 'uz-Cyrl';
					}
					break;
			}

			if (this.props.vkbInit.hasOptional) {
				let idx = 0;

				if (defaultLang !== this.props.vkbInit.optional) {
					idx = this.state.vkb.indexOf(this.props.vkbInit.optional);
					this.state.vkb.splice(idx, 1);
				}
			}
			if (this.props.vkbInit.fixedLangs.indexOf(defaultLang) < 0) {
				if (this.state.vkb.indexOf(defaultLang) < 0 && this.props.vkbLanguages.find(x => x.spec === defaultLang)) {
					this.state.vkb.splice(this.props.vkbInit.fixedLangs.length, 0, defaultLang); // add second default lang @ index{1}
				}
			}
		}

		this.lunaSendSetSystemSettings();
	}

	loadingPopupClose () {
		this.setState({
			loadingPopupShowing: false
		});
	}

	removePopupClose () {
		this.setState({
			removePopupShowing: false
		});
	}

	checkboxItemComponent = ({data, index, key}) => {
		return (
			<LanguageListCheckboxItem
				key={key}
				data={data[index]}
				dataIndex={index}
				selectedLanguage={this.state.selectedLanguage}
				defaultLanguages={this.props.vkbInit.fixedLangs}
				clickItem={this.saveLanguages}
			/>
		);
	}

	radioItemComponent = ({data, index, key}) => {
		return (
			<LanguageListRadioItem
				key={key}
				data={data[index]}
				dataIndex={index}
				selectedLanguage={this.state.selectedLanguage}
				clickItem={this.saveLanguages}
			/>
		);
	}

	render () {
		return (
			<Panel>
				<VirtualList
					data={this.state.selectedLanguages}
					dataSize={this.state.selectedLanguages.length}
					itemSize={ri.scale(60)}
					component={this.state.selectedComponent}
					focusableScrollbar
				/>
				<Notification
					open={this.state.confirmPopupShowing}
					onClose={this.confirmPopupClose}
				>
					<span>
						{$L('The Settings application must reload to change the menu language. Do you want to continue?')}
					</span>
					<buttons>
						<Button onClick={this.confirmPopupNo}>
							{$L('No')}
						</Button>
						<Button onClick={this.confirmPopupYes}>
							{$L('Yes')}
						</Button>
					</buttons>
				</Notification>
				<Notification
					open={this.state.loadingPopupShowing}
					onClose={this.loadingPopupClose}
				>
					<span>
						{$L('Please wait while the Settings application reloads.')}
					</span>
					<div className={css.notificationSpinner}>
						<Spinner />
					</div>
					<buttons>
						<Button style={{display: 'none'}} />
					</buttons>
				</Notification>
				<Notification
					open={this.state.removePopupShowing}
					onClose={this.removePopupClose}
				>
					<span>
						{new IString($L('You can select upto {n} keyboard languages only. De-select selected languages to add more langauge.')).format({n: (5)})}
					</span>
					<buttons>
						<Button onClick={this.removePopupClose}>
							{$L('OK')}
						</Button>
					</buttons>
				</Notification>
			</Panel>
		);
	}
}

LanguageList.propTypes = {
	audioLanguage: PropTypes.object,
	audioLanguage2: PropTypes.object,
	key: PropTypes.string,
	menuLanguage: PropTypes.object,
	menuLanguages: PropTypes.array,
	mode: PropTypes.string,
	setSystemSettings: PropTypes.func,
	sttLanguage: PropTypes.object,
	vkbInit: PropTypes.object,
	vkbLanguage: PropTypes.object,
	vkbLanguages: PropTypes.array
};

LanguageListRadioItem.propTypes = {
	clickItem: React.PropTypes.func,
	data: PropTypes.object,
	dataIndex: PropTypes.number,
	selectedLanguage: PropTypes.object,
	style: PropTypes.object
};

LanguageListCheckboxItem.propTypes = {
	clickItem: React.PropTypes.func,
	data: PropTypes.object,
	dataIndex: PropTypes.number,
	defaultLanguages: PropTypes.array,
	selectedLanguage: PropTypes.object,
	style: PropTypes.object
};

const mapStateToProps = ({intl, general}, ownProps) => {
	return {
		country: intl.getSystemSettings && intl.getSystemSettings.country,
		menuLanguage: general.menuLanguage,
		menuLanguages: general.menuLanguages,
		vkbLanguage: general.vkbLanguage,
		vkbLanguages: general.vkbLanguages,
		audioLanguage: general.audioLanguage,
		audioLanguage2: general.audioLanguage2,
		sttLanguage: general.sttLanguage,
		vkbInit: getDefaultVkbLanguage(ownProps.country, general.menuLanguage, general.vkbLanguages)
	};
};

const mapDispatchToProps = (dispatch) => ({
	setSystemSettings (param) {
		dispatch(setSystemSettings(param));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageList);
