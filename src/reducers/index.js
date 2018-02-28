import {combineReducers} from 'redux';
import {path, intl} from './reducer';
import {network} from './network';
import {general} from './general';

const rootReducer = combineReducers({
	path,
	intl,
	network,
	general
});

export default rootReducer;
