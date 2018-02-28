import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import configureStore from './store/configureStore';
import App from './App';

const store = configureStore();
let appElement = (
	<Provider store={store}>
		<App />
	</Provider>
);

if (typeof window === 'object') {
	render(
		appElement,
		document.getElementById('root')
	);

	appElement = null;
}

export default appElement;
