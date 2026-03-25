import axiosInstance from '../../../shared/api/axiosInstance';

/**
 * fetchContent
 * @param {number} page 
 * @param {number} limit 
 * @returns {Promise}
 */
export const fetchContent = async (page = 1, limit = 10) => {
  const response = await axiosInstance.get(`/content?page=${page}&limit=${limit}`);
  return response.data.data;
};

/**
 * searchContent (Semantic Search)
 * @param {string} query 
 * @returns {Promise}
 */
export const searchContent = async (query) => {
  const response = await axiosInstance.get(`/content/search?q=${encodeURIComponent(query)}`);
  return response.data.data;
};

/**
 * addContent
 * @param {Object} data - { link, tags }
 * @returns {Promise}
 */
export const addContent = async (data) => {
  const response = await axiosInstance.post('/content', data);
  return response.data.data;
};

/**
 * deleteContent
 * @param {string} id 
 * @returns {Promise}
 */
export const deleteContent = async (id) => {
  const response = await axiosInstance.delete(`/content/${id}`);
  return response.data.data;
};

/**
 * fetchStats
 * @returns {Promise}
 */
export const fetchStats = async () => {
  const response = await axiosInstance.get('/content/stats');
  return response.data.data;
};

/**
 * fetchResurfaced
 * @returns {Promise}
 */
export const fetchResurfaced = async () => {
  const response = await axiosInstance.get('/content/resurface');
  return response.data.data;
};
