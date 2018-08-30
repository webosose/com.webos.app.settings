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
import React from 'react';
import $L from '@enact/i18n/$L';
import kind from '@enact/core/kind';

import css from './ConnectionStatus.less';

const ConnectionStatus = kind({
	name: 'ConnectionStatus',

	propTypes: {
		mode: PropTypes.oneOf(['wired', 'wifi', 'wan']).isRequired,
		status: PropTypes.oneOf(['NOT_CONNECTED', 'CONNECTING', 'CONNECTED', 'ON_INTERNET']).isRequired
	},

	computed: {
		connectionString: (props) => {
			let connectionString = '';
			switch (props.status) {
				case 'ON_INTERNET':
					connectionString = $L('Connected to Internet');
					break;
				case 'CONNECTED':
					if (props.mode === 'wifi') {
						connectionString = $L('No Internet via Wi-Fi');
					} else if (props.mode === 'wan') {
						connectionString = $L('No Internet via 3G/4G network');
					} else {
						connectionString = $L('No Internet via Ethernet');
					}
					break;
				case 'CONNECTING':
					connectionString = $L('Connecting...');
					break;
			}
			return connectionString;
		}
	},

	render: ({status, connectionString}) => (
		<div className={css.connectionStatus} data-status={status}>
			<div className={css.iconSize}>
				<div className={`${css.icon} ${css.tv}`} />
				<div className={`${css.spacer} ${css.tv2router}`} />
				<div className={`${css.icon} ${css.router}`} />
				<div className={`${css.spacer} ${css.router2dns}`} />
				<div className={`${css.icon} ${css.dns}`} />
				<div className={`${css.spacer} ${css.dns2internet}`} />
				<div className={`${css.icon} ${css.internet}`} />
			</div>
			<div className={css.label}>{connectionString}</div>
		</div>
	)
});

export default ConnectionStatus;
