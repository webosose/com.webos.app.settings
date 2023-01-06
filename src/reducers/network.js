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
export const storedWifiNetwork = (state = [], action) => {
	switch (action.type) {
		case 'ADD_STORED_NETWORK':
			return [...action.payload];
		default:
			return state;
	}
};

export const wifiUIState = (state = {showWifiHeaders:true,wifitype:''}, action) => {
	switch (action.type) {
		case 'CHANGE_WIFI_UI_STATE':
			return {...state,...action.payload};
		default:
			return state;
	}
};

