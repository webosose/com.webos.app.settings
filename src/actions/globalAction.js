import {EndPoints} from '../store/service';
import {lunaRequest} from './index';

export const getTimeZone = () => dispatch => {
	let params = {
		service: EndPoints.systemService,
		method: 'getPreferences',
		param: {
			subscribe: true,
			keys: ['useNetworkTime', 'timeZone']
		},
		type: 'GLOBAL_RECEIVE_PREFERENCES'
	};
	lunaRequest(params, dispatch);
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

export const getTimeZoneValues = () => dispatch => {
	let params = {
		service: EndPoints.systemService,
		method: 'getPreferenceValues',
		param: {
			key: 'timeZone'
		},
		type: 'GLOBAL_RECEIVE_PREFERENCE_VALUES'
	};
	lunaRequest(params, dispatch);
};
