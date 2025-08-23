import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [items, setItems] = useState([]);
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setExpire(decoded.exp);
      console.log('Token refreshed:', response.data.accessToken);
    } catch (error) {
      console.error('Error refreshing token:', error);
      if (error.response) {
        navigate("/admin/login");
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    // Always use current token - no expiration check
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const fetchTransactions = async () => {
    try {
      const response = await axiosJWT.get('http://localhost:5000/transactions');
      console.log('Transactions response:', response.data);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      console.error('Error response:', error.response);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      console.log('Deleting transaction with ID:', id);
      
      const response = await axiosJWT.delete(`http://localhost:5000/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Transaction deleted:', response.data);
      await fetchTransactions(); // Refresh the list
    } catch (error) {
      console.error('Error deleting transaction:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error config:', error.config);
      alert('Error deleting transaction: ' + (error.response?.data?.msg || error.message));
    }
  };

  return (
    <div className='container mt-5'>
      <h2 className='title is-4'>Riwayat Transaksi</h2>
      <button onClick={fetchTransactions} className='button is-info mb-3'>Refresh</button>
      <table className='table is-striped is-fullwidth'>
        <thead>
          <tr>
            <th>Waktu</th>
            <th>Produk</th>
            <th>Qty</th>
            <th>Total Harga</th>
            <th>Bayar</th>
            <th>Kembalian</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.createdAt).toLocaleString()}</td>
              <td>{t.productName}</td>
              <td>{t.quantity}</td>
              <td>Rp{t.totalPrice}</td>
              <td>Rp{t.paidAmount}</td>
              <td>Rp{t.changeAmount}</td>
              <td>
                <button 
                  className='button is-small is-danger' 
                  onClick={() => deleteTransaction(t.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;


