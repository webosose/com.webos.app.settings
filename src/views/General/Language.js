import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import Spotlight from '@enact/spotlight';
import $L from '@enact/i18n/$L';
import LabeledItem from '@enact/moonstone/LabeledItem';

import {addPath} from '../../actions';

import css from '../../style/main.less';

class Language extends React.Component {
	constructor (props) {
		super(props);

		this.pushPathMenuLanguage = props.addPath.bind(this, 'Menu Language');
		this.pushPathVKBLanguage = props.addPath.bind(this, 'Keyboard Languages');
	}
	componentDidMount () {
		const currentContainer = Spotlight.getActiveContainer();
		if ( currentContainer !== 'spotlightRootDecorator') {
			Spotlight.focus(Spotlight.getActiveContainer());
		}
	}
	setVkbLanguage (obj) {
		let displayVkbLanguage = $L('Loading...');
		if (obj) {
			if (obj.vkbLanguage) {
				if (Array.isArray(obj.vkbLanguage)) {
					displayVkbLanguage = obj.vkbLanguage.join();
				} else {
					displayVkbLanguage = obj.vkbLanguage;
				}
			}
		}
		return displayVkbLanguage;
	}
	render () {
		const displayVkbLanguage = this.setVkbLanguage(this.props);
		return (
			<div>
				<LabeledItem className={css.vspacingCMR} onClick={this.pushPathMenuLanguage} label={this.props && this.props.menuLanguage ? this.props.menuLanguage : $L('Loading...')} data-component-id="menuLanguage">{$L('Menu Language')}</LabeledItem>
				<LabeledItem className={css.vspacingCMR} onClick={this.pushPathVKBLanguage} label={displayVkbLanguage} data-component-id="vkbLanguage">{$L('Keyboard Languages')}</LabeledItem>
			</div>
		);
	}
}

Language.propTypes = {
	addPath: PropTypes.func,
	menuLanguage:  PropTypes.string
};

const mapStateToProps = (state) => ({
	menuLanguage: state && state.general && state.general.menuLanguage && state.general.menuLanguage.displayValue,
	vkbLanguage:  state && state.general && state.general.vkbLanguage && state.general.vkbLanguage.displayValue
});

const mapDispatchToProps = (dispatch) => ({
	addPath (path) {
		dispatch(addPath(path));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Language);
