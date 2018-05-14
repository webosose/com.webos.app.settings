import {combineReducers} from 'redux';
import {path, intl} from './reducer';
import {network} from './network';
import {general,uiMenuLanguage} from './general';

const rootReducer = combineReducers({
	path,
	intl,
	network,
	general,
	uiMenuLanguage
});

export default rootReducer;
