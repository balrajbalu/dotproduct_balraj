import API from '../api/axios';

export const getBudgets = async () => {
  const response = await API.get('budget/getBudgets');
  return response.data;
};
export const createBudget = async (data) => {
  const response = await API.post('budget/createBudget', data);
  return response.data;
};
