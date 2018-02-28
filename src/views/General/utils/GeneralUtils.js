import NameMapCity from '../../../constants/NameMapCity';
import NameMapCountry from '../../../constants/NameMapCountry';

export function getDefaultVkbLanguage (country, menuLanguage, vkbLanguages) {
	let hasOptional = (!country === 'KOR' && !country === 'JPN');
	let fixedLangs = ['en'];
	switch (country) {
		case 'KOR':
			fixedLangs.push('ko');
			break;
		case 'CHN':
			fixedLangs.push('zh-Hans');
			break;
		case 'HKG':
		case 'TWN':
			fixedLangs.push('zh-Hant');
			break;
		case 'JPN':
			fixedLangs.push('ja');
			break;
	}

	let menuLangCodes = menuLanguage.spec.split('-');
	if (menuLangCodes.length > 2) {
		menuLangCodes[1] = menuLangCodes[0] + '-' + menuLangCodes[1];
	} else {
		menuLangCodes.pop();
	}

	let optional = '', arr = [];
	for (let i = 0; i < fixedLangs.length; i++) {
		if (fixedLangs.indexOf(arr[i]) < 0 && vkbLanguages.find(x => x.spec === fixedLangs[i])) {
			optional = fixedLangs[i];
			break;
		}
	}

	return {
		hasOptional,
		fixedLangs,
		optional
	};
}

export const getTimeZoneList = ({timezone}) => {
	const retProps = {
		timezoneList: [],
		timezoneProps: {
			children: [],
			selected: 0
		}
	};

	if (timezone.selected.ZoneID) {
		let zone = timezone.selected.ZoneID.split('/')[0];
		for (let i = 0; i < timezone.values.length; i++) {
			if (zone === timezone.values[i].ZoneID.split('/')[0]) {
				if (timezone.values[i].City) {
					timezone.values[i].displayName = NameMapCity(timezone.values[i].City);
				} else {
					timezone.values[i].displayName = NameMapCountry(timezone.values[i].Country);
				}
				retProps.timezoneProps.children.push(timezone.values[i].displayName);
				retProps.timezoneList.push(timezone.values[i]);
			}
		}

		retProps.timezoneProps.children.sort();
		retProps.timezoneList.sort(function (a, b) {
			if (a.displayName < b.displayName) {
				return -1;
			} else if (a.displayName > b.displayName) {
				return 1;
			} else {
				return 0;
			}
		});

		if (retProps.timezoneProps.selected === 0) {
			for (let i = 0; i < retProps.timezoneList.length; i++) {
				if (retProps.timezoneList[i].ZoneID === timezone.selected.ZoneID) {
					retProps.timezoneProps.selected = i;
					break;
				}
			}
		}
	}

	return retProps;
};

export const debounce = (function () {
	let timer;

	return function	(fn, delay, context, args) {
		if (timer) {
			clearTimeout(timer);
		}

		timer = setTimeout(() => {
			fn.apply(context, args);
		}, delay);
	};
})();
