import axiosInstance from '../../../shared/api/axiosInstance';

/**
 * fetchCollections
 * @returns {Promise}
 */
export const fetchCollections = async () => {
  const response = await axiosInstance.get('/collections');
  return response.data.data;
};

/**
 * createCollection
 * @param {Object} data - { title, description }
 * @returns {Promise}
 */
export const createCollection = async (data) => {
  const response = await axiosInstance.post('/collections', data);
  return response.data.data;
};

/**
 * deleteCollection
 * @param {string} id 
 * @returns {Promise}
 */
export const deleteCollection = async (id) => {
  const response = await axiosInstance.delete(`/collections/${id}`);
  return response.data.data;
};

/**
 * addContentToCollection
 * @param {string} collectionId 
 * @param {string} contentId 
 * @returns {Promise}
 */
export const addContentToCollection = async (collectionId, contentId) => {
  const response = await axiosInstance.post('/collections/add-content', { collectionId, contentId });
  return response.data.data;
};

/**
 * removeContentFromCollection
 * @param {string} collectionId 
 * @param {string} contentId 
 * @returns {Promise}
 */
export const removeContentFromCollection = async (collectionId, contentId) => {
  const response = await axiosInstance.post('/collections/remove-content', { collectionId, contentId });
  return response.data.data;
};

/**
 * updateCollection
 * @param {string} id 
 * @param {Object} data - { title, description }
 * @returns {Promise}
 */
export const updateCollection = async (id, data) => {
  const response = await axiosInstance.patch(`/collections/${id}`, data);
  return response.data.data;
};

/**
 * fetchCollectionDetails
 * @param {string} id 
 * @returns {Promise}
 */
export const fetchCollectionDetails = async (id) => {
  const response = await axiosInstance.get(`/collections/${id}`);
  return response.data.data;
};
