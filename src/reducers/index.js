import {combineReducers} from 'redux';
import {path, intl} from './reducer';
import {network} from './network';
import {general,uiMenuLanguage,error} from './general';

const rootReducer = combineReducers({
	path,
	intl,
	network,
	general,
	uiMenuLanguage,
	error
});

export default rootReducer;
