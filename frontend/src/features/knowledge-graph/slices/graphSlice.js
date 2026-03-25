import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as graphService from '../services/graphService';

export const fetchGraph = createAsyncThunk(
  'graph/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await graphService.fetchGraphData();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch graph data');
    }
  }
);

const initialState = {
  nodes: [],
  links: [],
  selectedNodeId: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setSelectedNodeId: (state, action) => {
      state.selectedNodeId = action.payload;
    },
    clearSelectedNode: (state) => {
      state.selectedNodeId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGraph.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGraph.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.nodes = action.payload.nodes || [];
        state.links = action.payload.links || [];
      })
      .addCase(fetchGraph.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSelectedNodeId, clearSelectedNode } = graphSlice.actions;
export default graphSlice.reducer;
