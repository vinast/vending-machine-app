import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Create axios instance with interceptors
  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    // Get token from localStorage if available
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // Add response interceptor to handle 403 errors
  axiosJWT.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 403) {
        // Clear token and redirect to login
        localStorage.removeItem('adminToken');
        navigate("/admin/login");
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );

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
      
      const response = await axiosJWT.delete(`http://localhost:5000/transactions/${id}`);
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
    <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh" }}>
      <div className='container' style={{ paddingTop: "40px" }}>

        <div style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.6)",
          borderRadius: "24px",
          padding: "30px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px"
          }}>
            <h2 style={{
              color: "#1a202c",
              fontWeight: "700",
              fontSize: "1.8rem",
              margin: 0
            }}>📊 Riwayat Transaksi</h2>
            <button 
              onClick={fetchTransactions} 
              style={{
                background: "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "12px 24px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 16px rgba(49,130,206,0.3)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 24px rgba(49,130,206,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 16px rgba(49,130,206,0.3)";
              }}
            >
              🔄 Refresh
            </button>
          </div>
          
          <div style={{
            overflowX: "auto",
            borderRadius: "16px",
            border: "1px solid #e2e8f0"
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white"
            }}>
              <thead>
                <tr style={{
                  background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)"
                }}>
                  <th style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#1a202c",
                    borderBottom: "2px solid #e2e8f0"
                  }}>Waktu</th>
                  <th style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#1a202c",
                    borderBottom: "2px solid #e2e8f0"
                  }}>Produk</th>
                  <th style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#1a202c",
                    borderBottom: "2px solid #e2e8f0"
                  }}>Qty</th>
                  <th style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#1a202c",
                    borderBottom: "2px solid #e2e8f0"
                  }}>Total Harga</th>
                  <th style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#1a202c",
                    borderBottom: "2px solid #e2e8f0"
                  }}>Bayar</th>
                  <th style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#1a202c",
                    borderBottom: "2px solid #e2e8f0"
                  }}>Kembalian</th>
                  <th style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#1a202c",
                    borderBottom: "2px solid #e2e8f0"
                  }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t.id} style={{
                    borderBottom: "1px solid #f7fafc",
                    transition: "background 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.parentElement.style.background = "#f7fafc";
                  }}
                  onMouseLeave={(e) => {
                    e.target.parentElement.style.background = "white";
                  }}>
                    <td style={{
                      padding: "16px",
                      color: "#4a5568",
                      fontSize: "14px"
                    }}>{new Date(t.createdAt).toLocaleString()}</td>
                    <td style={{
                      padding: "16px",
                      fontWeight: "600",
                      color: "#1a202c"
                    }}>{t.productName}</td>
                    <td style={{
                      padding: "16px",
                      color: "#3182ce",
                      fontWeight: "600"
                    }}>{t.quantity}</td>
                    <td style={{
                      padding: "16px",
                      color: "#38a169",
                      fontWeight: "700"
                    }}>Rp{t.totalPrice.toLocaleString()}</td>
                    <td style={{
                      padding: "16px",
                      color: "#2b6cb0",
                      fontWeight: "600"
                    }}>Rp{t.paidAmount.toLocaleString()}</td>
                    <td style={{
                      padding: "16px",
                      color: "#e53e3e",
                      fontWeight: "600"
                    }}>Rp{t.changeAmount.toLocaleString()}</td>
                    <td style={{ padding: "16px" }}>
                      <button 
                        style={{
                          background: "rgba(229,62,62,0.1)",
                          color: "#e53e3e",
                          border: "2px solid rgba(229,62,62,0.3)",
                          borderRadius: "8px",
                          padding: "8px 16px",
                          fontWeight: "600",
                          fontSize: "12px",
                          cursor: "pointer",
                          transition: "all 0.3s ease"
                        }}
                        onClick={() => deleteTransaction(t.id)}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(229,62,62,0.2)";
                          e.target.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(229,62,62,0.1)";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        🗑️ Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {items.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{
                fontSize: "80px",
                color: "#cbd5e0",
                marginBottom: "20px"
              }}>
                📊
              </div>
              <p style={{
                color: "#4a5568",
                fontSize: "1.2rem",
                fontWeight: "600",
                marginBottom: "12px"
              }}>Belum ada transaksi</p>
              <p style={{
                color: "#a0aec0",
                fontSize: "1rem"
              }}>Transaksi akan muncul di sini setelah pembelian dilakukan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;


