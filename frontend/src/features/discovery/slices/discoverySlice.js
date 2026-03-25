import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../shared/api/axiosInstance';

export const fetchResurfacedContent = createAsyncThunk(
  'discovery/fetchResurfaced',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/content/resurface');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch resurfaced content');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResurfacedContent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchResurfacedContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchResurfacedContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default discoverySlice.reducer;
