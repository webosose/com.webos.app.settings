export const network = (state = {}, action) => {
	switch (action.type) {
		case 'NETWORK_GET_INFO':
			return Object.assign({}, state, action.payload);
		case 'NETWORK_GET_STATUS':
			return Object.assign({}, state, action.payload);
		case 'GET_WIFI_NETWORKS':
			return {...state, wifiNetworks: action.payload};
		case 'PARSE_NETWORK_ERROR':
			return {...state, parseNetworkError: action.payload};
		case 'CONNECTING_AP':
			return {...state, connectingAP: {...action.payload}};
		case 'RELEASE_CONNECTING_AP':
			return {...state, connectingAP: {}};
		case 'CONNECT_WIFI':
			return {...state, connectingWifiNetwork: action.network};
		case 'CLEAR_NETWORK_ERROR':
			return {...state, parseNetworkError: {errorText: 'NO_ERROR', errorCode: -1}};
		default:
			return state;
	}
};
