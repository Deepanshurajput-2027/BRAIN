import { useSelector, useDispatch } from 'react-redux';
import { 
  getContent, 
  performSearch, 
  saveNewContent, 
  removeContent, 
  getStats,
  setSearchQuery,
  clearContentError 
} from '../slices/contentSlice';
import { useCallback } from 'react';

export const useContent = () => {
  const dispatch = useDispatch();
  const { items, pagination, searchQuery, isSearching, status, error, stats } = useSelector(
    (state) => state.content
  );

  const fetchItems = useCallback((page = 1, limit = 10) => {
    dispatch(getContent({ page, limit }));
  }, [dispatch]);

  const handleSearch = useCallback((query) => {
    dispatch(setSearchQuery(query));
    if (query.trim()) {
      dispatch(performSearch(query));
    } else {
      fetchItems();
    }
  }, [dispatch, fetchItems]);

  const handleAdd = async (link, tags = []) => {
    return dispatch(saveNewContent({ link, tags })).unwrap();
  };

  const handleDelete = (id) => {
    dispatch(removeContent(id));
  };

  const resetError = () => {
    dispatch(clearContentError());
  };

  const fetchStats = useCallback(() => {
    dispatch(getStats());
  }, [dispatch]);

  return {
    items,
    pagination,
    searchQuery,
    isSearching,
    isLoading: status === 'loading',
    error,
    stats,
    fetchItems,
    handleSearch,
    handleAdd,
    handleDelete,
    resetError,
    fetchStats,
  };
};

export default useContent;
