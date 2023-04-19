import { configureStore } from "@reduxjs/toolkit";
import loginReducer from './slices/login';
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

const store = configureStore({
    reducer: {
        login: persistReducer(persistConfig, loginReducer),
        user: persistReducer(persistConfig, userReducer)
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        },
    }),
})
persistStore(store);

export default store;