import { configureStore } from "@reduxjs/toolkit";
import loginReducer from './slices/login';
import searchReducer from './slices/search';
import userReducer from './slices/user';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    version: 1,
    storage
}

const persistSearchConfig = {
    key: 'search',
    version: 1,
    storage
}

const persistPlayConfig = {
    key: 'play',
    version: 1,
    storage
}

const store = configureStore({
    reducer: {
        login: persistReducer(persistConfig, loginReducer),
        search: persistReducer(persistSearchConfig, searchReducer),
        user: persistReducer(persistPlayConfig, userReducer)
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        },
    }),
})
persistStore(store);

export default store;