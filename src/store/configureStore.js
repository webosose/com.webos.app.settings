import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';

const composeEnhancers = (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export default function configureStore (initialState) {
	const store = createStore(
		rootReducer,
		initialState,
		composeEnhancers(
			applyMiddleware(thunkMiddleware)
		)
	);

	return store;
}
