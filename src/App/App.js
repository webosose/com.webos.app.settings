import React from 'react';
import kind from '@enact/core/kind';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';

import MainPanels from '../views/MainPanels';
import Scrim from '../views/Scrim';
import css from './App.less';

const App = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: (props) => (
		<div {...props}>
			<Scrim />
			<MainPanels />
		</div>
	)
});

export default MoonstoneDecorator(App);
