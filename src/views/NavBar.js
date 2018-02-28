import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import $L from '@enact/i18n/$L';
import kind from '@enact/core/kind';

import {IconButtonFactory} from '@enact/moonstone/IconButton';

import css from '../App/App.less';
import cssIcon from '../style/main.less';
import {setPath} from '../actions';

const IconButtonBase = IconButtonFactory({css: cssIcon});
const IconButton = kind({
	name: 'IconButton',
	render: (props) => (
		<IconButtonBase {...props} className={cssIcon.iconButton} />
	)
});

const NavButton = props => {
	const clickHandler = () => props.onSelect(props.target);
	return (
		<div className={css.navButton} data-component-id={props.id}>
			<div className={css.icon}>
				<IconButton
					onClick={clickHandler}
					backgroundOpacity="transparent"
					selected={props.selected}
				>
					{props.icon}
				</IconButton>
			</div>
			<div className={css.caption}>
				{props.children}
			</div>
		</div>
	);
};
class NavBar extends React.Component {
	render () {
		return (
			<div className={this.props.className}>
				<NavButton
					icon="gear"
					target="General"
					selected={this.props.category === 'General'}
					onSelect={this.props.setPath}
					id="general"
				>
					{$L('General')}
				</NavButton>
				<NavButton
					icon="ellipsis"
					target="Network"
					selected={this.props.category === 'Network'}
					onSelect={this.props.setPath}
					id="network"
				>
					{$L('Network')}
				</NavButton>
			</div>
		);
	}
}

NavBar.propTypes = {
	category: PropTypes.string,
	className: PropTypes.string,
	setPath: PropTypes.func
};

NavButton.propTypes = {
	children: PropTypes.string,
	icon: PropTypes.string,
	id: PropTypes.string,
	onSelect: PropTypes.func,
	selected: PropTypes.bool,
	target: PropTypes.string
};

const mapStateToProps = (state) => ({
	category: state.path[0]
});

const mapDispatchToProps = (dispatch) => ({
	setPath (path) {
		dispatch(setPath(path));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
