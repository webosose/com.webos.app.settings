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
import {getLanguageList, getAudioLanguageList, mapLocale, getVkbLaunguage} from './helper/parseLS2Responses';

export const getDeviceName = () => dispatch => {
	let params = {
		service: EndPoints.settingService,
		method: 'getSystemSettings',
		param: {
			category: 'network',
			subscribe: true,
			keys: [
				'deviceName'
			]
		},
		type: 'GENERAL_RECEIVE_SYSTEM_SETTINGS'
	};
	lunaRequest(params, dispatch);
};

export const getWebOsVersion = () => dispatch => {
	let params = {
		service: EndPoints.osInfo,
		method: 'query',
		param: {
			parameters: [
				'webos_release',
				'webos_build_id'
			]
		},
		type: 'GENERAL_RECEIVE_WEBOS_VERSION',
		handleLunaResponses:receiveWebOsVersion
	};
	lunaRequest(params, dispatch);
};

function receiveWebOsVersion (res) {
	let payload = {
		coreOSRelease: res.webos_release + '-' + res.webos_build_id
	};
	return payload;
}

const getLanguage = payload => dispatch => {
	let params = {
		service: EndPoints.settingService,
		method: 'getSystemSettings',
		param: {
			key: 'localeInfo',
			subscribe: true
		},
		type: 'GENERAL_GET_LANGUAGES',
		handleLunaResponses:receiveLanguage,
		args: payload
	};
	lunaRequest(params, dispatch);
};

function receiveLanguage (res, args) {
	let localPayload = {};
	localPayload.menuLanguages = args.menuLanguages;
	localPayload.vkbLanguages = args.vkbLanguages;
	localPayload.menuLanguage = mapLocale(res.settings.localeInfo.locales.UI, args.menuLanguages);
	localPayload.audioLanguage = mapLocale(res.settings.localeInfo.locales.AUD, args.audioLanguages);
	localPayload.audioLanguage2 = mapLocale(res.settings.localeInfo.locales.AUD2, args.audioLanguages);
	localPayload.sttLanguage = mapLocale(res.settings.localeInfo.locales.STT, args.sttLanguages);
	localPayload.vkbLanguage = getVkbLaunguage(res.settings.localeInfo, args.vkbLanguages);

	return localPayload;
}

export const getLanguages = () => dispatch => {
	let params = {
		service: EndPoints.settingService,
		method: 'getSystemSettingValues',
		param: {
			key: 'locale'
		},
		handleLunaResponses:receiveLanguageList,
		args: dispatch
	};
	lunaRequest(params, dispatch);
};
export const setUiMenuLanguage = language => ({
	type: 'SET_UI_MENU_LANGUAGE',
	payload:language
});

function receiveLanguageList (res, dispatch) {
	let payload = {};

	payload.menuLanguages = getLanguageList(res.locale);
	payload.vkbLanguages = getLanguageList(res.vkb);
	payload.audioLanguages = getAudioLanguageList(res.audio);
	payload.sttLanguages = getLanguageList(res.stt);

	getLanguage(payload)(dispatch);
}

export {receiveWebOsVersion};
