import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as contentService from '../services/contentService';

export const getContent = createAsyncThunk(
  'content/fetchAll',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await contentService.fetchContent(page, limit);
      return data; // { content: [], pagination: {} }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch content');
    }
  }
);

export const performSearch = createAsyncThunk(
  'content/search',
  async (query, { rejectWithValue }) => {
    try {
      return await contentService.searchContent(query);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const saveNewContent = createAsyncThunk(
  'content/add',
  async (contentData, { rejectWithValue }) => {
    try {
      return await contentService.addContent(contentData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add content');
    }
  }
);

export const removeContent = createAsyncThunk(
  'content/delete',
  async (id, { rejectWithValue }) => {
    try {
      await contentService.deleteContent(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  }
);

export const getStats = createAsyncThunk(
  'content/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await contentService.fetchStats();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const initialState = {
  items: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  },
  searchQuery: '',
  isSearching: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  stats: {
    totalContent: 0,
    totalCollections: 0,
    totalHighlights: 0,
    totalSearches: 0
  }
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      if (!action.payload) {
        state.isSearching = false;
      }
    },
    clearContentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Content
      .addCase(getContent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items || [];
        state.pagination = action.payload.pagination;
        state.isSearching = false;
      })
      .addCase(getContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Search Content
      .addCase(performSearch.pending, (state) => {
        state.status = 'loading';
        state.isSearching = true;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Search results are usually a flat array
        state.isSearching = false;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isSearching = false;
      })

      // Add Content (Optimistic addition not suitable for async enrichment, so we add to top)
      .addCase(saveNewContent.fulfilled, (state, action) => {
        if (!Array.isArray(state.items)) {
          state.items = [];
        }
        state.items.unshift(action.payload);
      })

      // Delete Content (Optimistic)
      .addCase(removeContent.pending, (state, action) => {
        const id = action.meta.arg;
        state.items = state.items.filter(item => item._id !== id);
      })
      .addCase(removeContent.rejected, (state, action) => {
        // Rollback on failure (in a real app we'd need the deleted item to restore it)
        state.error = action.payload;
        state.status = 'failed';
      })
      
      // Get Stats
      .addCase(getStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { setSearchQuery, clearContentError } = contentSlice.actions;
export default contentSlice.reducer;
