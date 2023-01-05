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

import LS2Request from '@enact/webos/LS2Request';
import { EndPoints } from '../store/service';
import { lunaRequest } from './index';

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

export const connectWifi = ({ network }) => ({
	type: 'CONNECT_WIFI',
	network
});

export const deleteWifiProfile = (param) => (dispatch) => {
	console.log("Enter deleteWifiProfile");
	return new LS2Request().send({
		service: EndPoints.wifi,
		method: 'deleteprofile',
		parameters: param,
		onComplete: () => {
			console.log("deleteWifiProfile");
			dispatch(getStoredWifiNetwork());
		}
	});
};

function parseError(res) {
	return {
		type: 'PARSE_NETWORK_ERROR',
		payload: res
	};
}

export const connectingWifi = (params) => dispatch => {
	return new LS2Request().send({
		service: EndPoints.wifi,
		method: 'connect',
		parameters: params,
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
			dispatch(getStoredWifiNetwork(() => {
				if (res.returnValue) {
					dispatch(changeWifiUISate(false, 'mywifi'));
				}
			}));
		}
	});
};
export const getStoredWifiNetwork = (callback) => dispatch => {
	let params = {
		service: EndPoints.weboswifi,
		method: 'getprofilelist',
		type: 'ADD_STORED_NETWORK',
		handleLunaResponses: (res) => {
			console.log('getStoredWifiNetwork::', res);
			callback && callback();
			return res.profileList.map((v) => v.wifiProfile.ssid);
		}
	};

	lunaRequest(params, dispatch);
};

export const clearErrorStatus = () => {
	return {
		type: 'CLEAR_NETWORK_ERROR',
		payload: {}
	};
};


export const changeWifiUISate = (showWifiHeaders, wifitype) => {
	return {
		type: 'CHANGE_WIFI_UI_STATE',
		payload: {
			showWifiHeaders,
			wifitype
		}
	};
};
export { parseError };
