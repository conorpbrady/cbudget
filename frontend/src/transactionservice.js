import axiosInstance from './axiosApi';

const API_URL = 'http://localhost:8000';

export default class TransactionService {
  getTransactions() {
    const url = `${API_URL}/api/transaction`;
    return axiosInstance.get(url).then((response) => response.data);
  }
}
