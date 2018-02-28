export const  path = (state = ['General'], action) => {
	switch (action.type) {
		case 'SET_PATH':
			return [
				action.path
			];
		case 'PUSH_PATH':
			if (state[state.length - 1] === action.path) {
				return state;
			} else {
				return [
					...state,
					action.path
				];
			}
		case 'POP_PATH':
			return [
				...state.slice(0, state.length - 1)
			];
		default:
			return state;
	}
};

export const intl = (state = {}, action) => {
	switch (action.type) {
		case 'GLOBAL_RECEIVE_SYSTEM_SETTINGS':
			return Object.assign({}, state, action.payload.settings);
			/*
			return {
				...state,
				getSystemSettings: action.payload.settings
			};
			*/
		case 'GLOBAL_RECEIVE_SYSTEM_SETTING_VALUES':
			return Object.assign({}, state, action.payload);
			/*
			return {
				...state,
				[action.key]: action.payload
			};
			*/
		case 'GLOBAL_RECEIVE_PREFERENCES':
			return Object.assign({}, state, action.payload);
		case 'GLOBAL_RECEIVE_PREFERENCE_VALUES':
			return {
				...state,
				timeZoneList: action.payload.timeZone
			};
		default:
			return state;
	}
};
