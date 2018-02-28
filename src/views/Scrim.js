import React from 'react';

import css from '../App/App.less';

class Scrim extends React.Component {
	constructor (props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick () {
		if (typeof window === 'object') {
			window.close();
		}
	}

	render () {
		return (
			<div
				className={css.scrim}
				onClick={this.onClick}
			/>
		);
	}
}

export default Scrim;
