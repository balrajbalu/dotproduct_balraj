import API from '../api/axios';

export const getSummary = async () => {
  const response = await API.get('summary/getSummary');
  return response.data;
};
export const getOverview = async () => {
  const response = await API.get('summary/getOverview');
  return response.data;
};
export const getCategory = async () => {
  const response = await API.get('summary/getCategory');
  return response.data;
};