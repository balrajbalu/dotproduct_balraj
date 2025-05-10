import API from '../api/axios';

export const getCategories = async (data) => {
  const response = await API.post('category/getCategories', data);
  return response.data;
};
export const createCategory = async (data) => {
  const response = await API.post('category/createCategory', data);
  return response.data;
};
export const getCategoriesList = async (data) => {
  const response = await API.get('category/getCategoriesList', data);
  return response.data;
};
