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
