import API from '../api/axios';

export const loginUser = async (credentials) => {
  const response = await API.post('user/login', credentials);
  return response.data;
};
export const checkUserRole = async () => {
  const response = await API.get('user/checkUserRole');
  return response.data;
};
