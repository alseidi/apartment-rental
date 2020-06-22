import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "connected-react-router";
import { createStore, compose, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { createBrowserHistory } from "history";
import storage from "redux-persist/lib/storage";
import createRootReducer from "./reducers";
import rootSaga from "./sagas";

const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const rootPersistConfig = {
  key: "root",
  storage,
  blacklist: [],
};

export default function configureStore(preloadedState = {}) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const persistedReducer = persistReducer(
    rootPersistConfig,
    createRootReducer(history)
  );
  const store = createStore(
    persistedReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware))
  );
  sagaMiddleware.run(rootSaga);
  let persistor = persistStore(store);
  return { store, persistor };
}
