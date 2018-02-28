import PropTypes from 'prop-types';
import React from 'react';
import {Panel, Header} from '@enact/moonstone/Panels';
import css from '../App/App.less';
import $L from '@enact/i18n/$L';

class MainPanel extends React.Component {
	updateBreadcrumb () {
		let ret = '';
		for (let i = 0; i < this.props.path.length - 1; i++) {
			ret += $L(this.props.path[i]) + ' / ';
		}
		return ret;
	}

	render () {
		let titleLabel = this.props.path[this.props.path.length - 1];
		if (titleLabel === 'Wired Edit') {
			titleLabel = 'Edit';
		}
		return (
			<Panel>
				<Header
					marqueeOn={'render'}
					className={css.header}
					title={$L(titleLabel).toUpperCase()}
					titleBelow={this.updateBreadcrumb()}
				>
					{this.props.headerChildren}
				</Header>
				{this.props.children}
			</Panel>
		);
	}
}

MainPanel.defaultProps = {
	path: []
};

MainPanel.propTypes = {
	headerChildren: PropTypes.object,
	path: PropTypes.any,
	title: PropTypes.string
};

export default MainPanel;
