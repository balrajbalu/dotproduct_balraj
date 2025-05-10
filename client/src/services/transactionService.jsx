import API from '../api/axios';

export const getTransaction = async (body) => {
  const response = await API.post('transaction/getTransaction', body);
  return response.data;
};
export const createTransaction = async (data) => {
  const response = await API.post('transaction/createTransaction', data);
  return response.data;
};
