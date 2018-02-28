import LS2Request from '@enact/webos/LS2Request';
import {EndPoints} from '../store/service';
import {lunaRequest} from './index';

export const getInfo = () => dispatch => {
	let params = {
		service: EndPoints.connectionManager,
		method: 'getinfo',
		param: {
			subscribe: true
		},
		type: 'NETWORK_GET_INFO'
	};

	lunaRequest(params, dispatch);
};

export const getStatus = () => dispatch => {
	let params = {
		service: EndPoints.connectionManager,
		method: 'getstatus',
		param: {
			subscribe: true
		},
		type: 'NETWORK_GET_STATUS'
	};
	lunaRequest(params, dispatch);
};

export const enableWifi = () => dispatch => {
	let params = {
		service: EndPoints.wifiConnectionManager,
		method: 'setstate',
		param: {
			wifi: 'enabled'
		},
		type: 'ENABLE_WIFI'
	};
	lunaRequest(params, dispatch);
};

export const findWifiNetworks = () => dispatch => {
	let params = {
		service: EndPoints.wifi,
		method: 'findnetworks',
		param: {
			subscribe: true
		},
		type: 'GET_WIFI_NETWORKS'
	};
	lunaRequest(params, dispatch);
};

export const connectingAp = (params) => {
	return {
		type: 'CONNECTING_AP',
		payload: params
	};
};

export const releaseAp = () => {
	return {
		type: 'RELEASE_CONNECTING_AP',
		payload: null
	};
};

export const connectWifi = ({network}) => ({
	type: 'CONNECT_WIFI',
	network
});

export const deleteWifiProfile = (param) => () => {
	return new LS2Request().send({
		service: EndPoints.wifi,
		method: 'deleteprofile',
		parameters:  param
	});
};

function parseError (res) {
	return {
		type: 'PARSE_NETWORK_ERROR',
		payload: res
	};
}

export const connectingWifi = (params) => dispatch => {
	return new LS2Request().send({
		service: EndPoints.wifi,
		method: 'connect',
		parameters:  params,
		onComplete: (res) => {
			const obj = {};
			if (res.returnValue) {
				obj.errorText = 'NO_ERROR';
			} else if (res.errorText) {
				obj.errorText = res.errorText;
			} else {
				obj.errorText = '';
			}
			obj.errorCode = res.errorCode || -1;
			dispatch(parseError(res));
		}
	});
};

export const clearErrorStatus = () => {
	return {
		type: 'CLEAR_NETWORK_ERROR',
		payload: {}
	};
};

export {parseError};
