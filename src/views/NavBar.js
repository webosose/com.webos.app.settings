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
import React, {useCallback} from 'react';
import {connect} from 'react-redux';

import $L from '@enact/i18n/$L';
import kind from '@enact/core/kind';

import {IconButton as IconButtonFactory} from '@enact/moonstone/IconButton';

import css from '../App/App.module.less';
import cssIcon from '../style/main.module.less';
import {setPath} from '../actions';

// const IconButtonBase = IconButtonFactory({ css: cssIcon });
const IconButton = kind({
	name: 'IconButton',
	render: props => <IconButtonFactory {...props} className={cssIcon.iconButton} />
});

const NavButton = props => {
	// const clickHandler = () => props.onSelect(props.target);
	const {target, onSelect} = props;
	const clickHandler = useCallback(() => {
		onSelect(target);
	}, [target, onSelect]);
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
			<div className={css.caption}>{props.children}</div>
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

const mapStateToProps = state => ({
	category: state.path[0]
});

const mapDispatchToProps = dispatch => ({
	setPath (path) {
		dispatch(setPath(path));
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavBar);
