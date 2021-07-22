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

// import React from 'react';
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
