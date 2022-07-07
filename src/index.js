/* global ENACT_PACK_ISOMORPHIC */
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import App from './App';

const store = configureStore();
let appElement = (
    <Provider store={store}>
        <App />
    </Provider>
);

// In a browser environment, render the app to the document.
if (typeof window !== 'undefined') {
    if (ENACT_PACK_ISOMORPHIC) {
        hydrateRoot(document.getElementById('root'), appElement);
    } else {
        createRoot(document.getElementById('root')).render(appElement);
    }
}

export default appElement;
