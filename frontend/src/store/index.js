import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/authSlice';
import contentReducer from '../features/content-management/slices/contentSlice';
import graphReducer from '../features/knowledge-graph/slices/graphSlice';
import collectionReducer from '../features/collections/slices/collectionSlice';
import discoveryReducer from '../features/discovery/slices/discoverySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
    graph: graphReducer,
    collections: collectionReducer,
    discovery: discoveryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
