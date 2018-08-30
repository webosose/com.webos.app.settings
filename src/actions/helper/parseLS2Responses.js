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

import {LanguageRenameMap} from '../../constants/LanguageRenameMap';

export const getLanguageList = item => {
	let list = [], i, j;

	if (item) {
		for (i = 0; i < item.length; i++) {
			if (item[i].countries) {
				const country = item[i].countries;
				for (j = 0; j < country.length; j++) {
					list.push({displayValue: item[i].name + ' - ' + country[j].name, spec: country[j].spec});
				}
			} else if (item[i].keyboards) {
				for (let langName in item[i].keyboards) {
					list.push({displayValue:langName, spec:item[i].keyboards[langName]});
				}
			} else {
				list.push({displayValue:item[i].name, spec:item[i].languageCode});
			}
		}
	}
	return list;
};

export const getAudioLanguageList = item => {
	let list = [];

	if (item) {
		for (let i = 0; i < item.length; i++) {
			let country = item[i].countries;
			for (let j = 0; j < country.length; j++) {
				if (typeof LanguageRenameMap('alpha2')[item[i].languageCode] !== 'undefined') {
					list.push({displayValue: LanguageRenameMap('alpha2')[item[i].languageCode], spec: country[j].spec, ignoreSpec: true});
				} else {
					list.push({displayValue: item[i].name, spec: country[j].spec, ignoreSpec: true});
				}
			}
		}
	}
	return list;
};

export const mapLocale = (inCode, list) => {
	if (!list || !inCode) {
		return null;
	}

	let result = null;

	for (let i = 0; i < list.length; i++) {
		if (list[i].spec === inCode) {
			result = list[i];
			return result;
		}
	}

	if (!result) {
		result = {displayValue:'', spec: inCode};
	}
	return result;
};

export const getVkbLaunguage = (localeInfo, vkbLanguages) => {
	if (vkbLanguages) {
		let tmpVKBLanguage;

		if (!localeInfo.keyboards || localeInfo.keyboards.length === 0) {
			// default
			tmpVKBLanguage = {spec:['en']};
		} else {
			tmpVKBLanguage = {spec:localeInfo.keyboards};

			if (typeof tmpVKBLanguage.spec === 'string') {
				tmpVKBLanguage.spec = [tmpVKBLanguage.spec];
			}
		}

		tmpVKBLanguage.displayValue = mapVKLanguage(tmpVKBLanguage.spec, vkbLanguages);
		return tmpVKBLanguage;
	}
};

function isValidVKLanguage (code, vkbLanguages) {
	for (let i = 0; i < vkbLanguages.length; i++) {
		if (vkbLanguages[i].spec === code) {
			return true;
		}
	}
	return false;
}

function mapVKLanguage (specList, vkbLanguages) {
	let result = [];
	for (let i = 0; i < specList.length; i++) {
		if (!isValidVKLanguage(specList[i], vkbLanguages)) {
			continue;
		}
		result.push(mapLocale(specList[i], vkbLanguages).displayValue);
	}
	return result;
}
