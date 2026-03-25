import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as collectionService from '../services/collectionService';

export const getCollections = createAsyncThunk(
  'collections/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await collectionService.fetchCollections();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch collections');
    }
  }
);

export const saveNewCollection = createAsyncThunk(
  'collections/add',
  async (data, { rejectWithValue }) => {
    try {
      return await collectionService.createCollection(data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create collection');
    }
  }
);

export const removeCollection = createAsyncThunk(
  'collections/delete',
  async (id, { rejectWithValue }) => {
    try {
      await collectionService.deleteCollection(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete collection');
    }
  }
);

export const getCollectionDetails = createAsyncThunk(
  'collections/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await collectionService.fetchCollectionDetails(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch collection details');
    }
  }
);

const initialState = {
  items: [],
  currentCollection: null,
  status: 'idle',
  error: null,
};

const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCollections.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCollections.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(getCollections.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(saveNewCollection.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(removeCollection.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(getCollectionDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCollectionDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCollection = action.payload;
      })
      .addCase(getCollectionDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default collectionSlice.reducer;
