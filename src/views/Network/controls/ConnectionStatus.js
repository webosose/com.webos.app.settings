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
