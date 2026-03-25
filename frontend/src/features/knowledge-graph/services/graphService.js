import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const fetchGraphData = async () => {
  const response = await axios.get(`${API_URL}/content/graph`, {
    withCredentials: true,
  });
  return response.data.data;
};
