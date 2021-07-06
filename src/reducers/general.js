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

export const general = (state = {}, action) => {
	switch (action.type) {
		case 'GENERAL_GET_LANGUAGES':
			return {
				...state,
				menuLanguage: action.payload.menuLanguage,
				menuLanguages: action.payload.menuLanguages,
				vkbLanguage: action.payload.vkbLanguage,
				vkbLanguages: action.payload.vkbLanguages,
				audioLanguage: action.payload.audioLanguage,
				audioLanguage2: action.payload.audioLanguage2,
				sttLanguage: action.payload.sttLanguage
			};
		case 'RECEIVE_GET_VERSION':
			return {
				...state,
				version: action.payload
			};
		case 'GENERAL_RECEIVE_WEBOS_VERSION':
			return {
				...state,
				webOsVersion: action.payload
			};
		case 'GENERAL_RECEIVE_SYSTEM_SETTINGS':
			return Object.assign({}, state, action.payload.settings);
		default:
			return state;
	}
};
export const uiMenuLanguage = (state = {}, action) => {
	switch (action.type) {
		case 'SET_UI_MENU_LANGUAGE':
			return Object.assign({}, action.payload);
		default:
			return state;
	}
};
export const error = (state = {}, action) => {
	switch (action.type) {
		case 'TIMEZONE_UPDATE_FAILURE':
			return Object.assign({}, state, action.errorObj);
		default:
			return state;
	}
};
