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

import {EndPoints} from '../store/service';
import {lunaRequest} from './index';
import {getTimeZoneList} from '../views/General/utils/GeneralUtils';

export const getTimeZone = (dispatch,getState) => {
	let params = {
		service: EndPoints.systemService,
		method: 'getPreferences',
		param: {
			subscribe: true,
			keys: ['useNetworkTime', 'timeZone']
		},
		type: 'GLOBAL_RECEIVE_PREFERENCES'
	};
	// lunaRequest(params, dispatch);
	lunaRequest(params, dispatch,(payload)=>{
		if(payload.timeZone){
			let timezoneParam = {
				timezone: {
					selected: payload.timeZone,
					values: getState().intl.timeZoneList
				}
			};
			dispatch({
				type:"UPDATE_ZONE_VALUE",
				payload:getTimeZoneList(timezoneParam)
			});
		}
	});
};

export const getCountry = () => dispatch => {
	let params = {
		service: EndPoints.settingService,
		method: 'getSystemSettings',
		param: {
			category: 'option',
			keys: ['country', 'countryRegion'],
			subscribe: true
		},
		type: 'GLOBAL_RECEIVE_SYSTEM_SETTINGS'
	};
	lunaRequest(params, dispatch);
};

export const getCountryValues = () => dispatch => {
	let params = {
		service: EndPoints.settingService,
		method: 'getSystemSettingValues',
		param: {
			category: 'option',
			key: 'country'
		},
		type: 'GLOBAL_RECEIVE_SYSTEM_SETTING_VALUES'
	};
	lunaRequest(params, dispatch);
};

export const getCountryRegionValues = () => dispatch => {
	let params = {
		service: EndPoints.settingService,
		method: 'getSystemSettingValues',
		param: {
			category: 'option',
			key: 'countryRegion'
		},
		type: 'GLOBAL_RECEIVE_SYSTEM_SETTING_VALUES'
	};
	lunaRequest(params, dispatch);
};

export const getTimeZoneValues = ()=> (dispatch,getState) => {
	let params = {
		service: EndPoints.systemService,
		method: 'getPreferenceValues',
		param: {
			key: 'timeZone'
		},
		type: 'GLOBAL_RECEIVE_PREFERENCE_VALUES'
	};
	// lunaRequest(params, dispatch);
	lunaRequest(params, dispatch,()=>{
		getTimeZone(dispatch,getState)
	})
};

