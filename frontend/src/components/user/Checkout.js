import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [inserted, setInserted] = useState(0);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (location.state) {
      setSelectedProducts(location.state.selectedProducts || []);
      setTotalPrice(location.state.totalPrice || 0);
    } else {
      // Redirect back if no products selected
      navigate('/');
    }
  }, [location.state, navigate]);

  const insertMoney = (amount) => setInserted(prev => prev + amount);
  const resetMoney = () => setInserted(0);

  const processPurchase = async () => {
    if (inserted < totalPrice) {
      setMessage('Uang tidak cukup! Masukkan lebih banyak uang.');
      return;
    }

    setIsProcessing(true);
    setMessage('Memproses pembelian...');

    try {
      console.log('🔄 Starting purchase process...', {
        selectedProducts,
        totalPrice,
        inserted
      });

      // Calculate proportional amounts for each product
      const purchasePromises = selectedProducts.map(product => {
        const productTotal = product.price * product.quantity;
        const proportionalAmount = Math.round((productTotal / totalPrice) * inserted);
        
        console.log('📦 Processing product:', {
          productId: product.id,
          productName: product.name,
          quantity: product.quantity,
          productTotal,
          proportionalAmount
        });
        
        return axios.post('http://localhost:5000/purchase', {
          productId: product.id,
          insertedAmount: proportionalAmount,
          quantity: product.quantity
        });
      });

      console.log('🚀 Sending purchase requests...');
      const results = await Promise.all(purchasePromises);
      
      console.log('✅ Purchase results:', results);
      
      // Check if all purchases were successful
      const allSuccessful = results.every(result => result.status === 200);
      
      if (allSuccessful) {
        const changeAmount = inserted - totalPrice;
        setMessage(`Pembelian berhasil! Kembalian: Rp${changeAmount.toLocaleString()}`);
        
        // Reset after successful purchase
        setTimeout(() => {
          setInserted(0);
          setMessage('');
          navigate('/');
        }, 3000);
      } else {
        setMessage('Beberapa produk gagal dibeli. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('❌ Purchase error:', error);
      
      let errorMsg = 'Gagal memproses pembelian';
      
      if (error.response) {
        // Server responded with error status
        console.log('Server error response:', error.response);
        errorMsg = error.response.data?.msg || errorMsg;
      } else if (error.request) {
        // Request was made but no response received
        console.log('No response received:', error.request);
        errorMsg = 'Tidak dapat terhubung ke server. Pastikan backend berjalan.';
      } else {
        // Something else happened
        console.log('Other error:', error.message);
        errorMsg = error.message || errorMsg;
      }
      
      setMessage(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  const goToProductSelection = () => {
    navigate("/products");
  };

  if (selectedProducts.length === 0) {
    return (
      <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh" }}>
        <div className='container mt-5'>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: isMobile ? "60px" : "80px",
              color: "#cbd5e0",
              marginBottom: "20px"
            }}>
              ❌
            </div>
            <p style={{
              color: "#4a5568",
              fontSize: isMobile ? "1.1rem" : "1.2rem",
              fontWeight: "600",
              marginBottom: "20px"
            }}>Tidak ada produk yang dipilih</p>
            <button 
              style={{
                background: "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)",
                color: "white",
                border: "none",
                borderRadius: "25px",
                padding: isMobile ? "12px 24px" : "16px 32px",
                fontWeight: "700",
                fontSize: isMobile ? "14px" : "16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 24px rgba(49,130,206,0.3)",
                width: isMobile ? "90%" : "auto"
              }}
              onClick={goBack}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 32px rgba(49,130,206,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 24px rgba(49,130,206,0.3)";
              }}
            >
              🔙 Kembali ke Pilihan Produk
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh" }}>
      <div className='container' style={{ paddingTop: "40px" }}>
        <div style={{ textAlign: isMobile ? "center" : "left", marginBottom: isMobile ? "40px" : "60px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(49,130,206,0.1)",
            padding: isMobile ? "8px 16px" : "12px 24px",
            borderRadius: "25px",
            marginBottom: "20px"
          }}>
            <span style={{ fontSize: isMobile ? "16px" : "20px" }}>💳</span>
            <span style={{
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "600",
              color: "#3182ce"
            }}>PEMBAYARAN</span>
          </div>
        </div>

        <div className={`columns ${isMobile ? 'is-mobile' : ''}`}>
          {/* Order Summary */}
          <div className={`column ${isMobile ? 'is-12' : 'is-two-thirds'}`}>
            <div style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: "24px",
              padding: isMobile ? "20px" : "30px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              marginBottom: isMobile ? "20px" : "0"
            }}>
              <h2 style={{
                color: "#1a202c",
                fontWeight: "700",
                fontSize: isMobile ? "1.5rem" : "1.8rem",
                marginBottom: "30px",
                textAlign: isMobile ? "center" : "left"
              }}>📋 Ringkasan Pesanan</h2>
              {selectedProducts.map((product, index) => (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid #f0f0f0",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "15px" : "0"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: isMobile ? "column" : "row",
                    textAlign: isMobile ? "center" : "left"
                  }}>
                    <figure style={{
                      width: isMobile ? "80px" : "60px",
                      height: isMobile ? "80px" : "60px",
                      marginRight: isMobile ? "0" : "20px",
                      marginBottom: isMobile ? "15px" : "0",
                      overflow: "hidden",
                      borderRadius: "15px"
                    }}>
                      <img 
                        src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://via.placeholder.com/60'} 
                        alt={product.name}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          display: "block"
                        }}
                      />
                    </figure>
                    <div>
                      <strong style={{
                        color: "#1a202c",
                        fontSize: isMobile ? "1rem" : "1.1rem",
                        fontWeight: "600"
                      }}>{product.name}</strong>
                      <p style={{
                        color: "#718096",
                        margin: "4px 0 0 0",
                        fontSize: isMobile ? "0.8rem" : "0.9rem"
                      }}>Qty: {product.quantity}</p>
                    </div>
                  </div>
                  <div style={{ 
                    textAlign: isMobile ? "center" : "right",
                    width: isMobile ? "100%" : "auto"
                  }}>
                    <p style={{
                      color: "#3182ce",
                      fontWeight: "700",
                      fontSize: isMobile ? "1.1rem" : "1.2rem",
                      margin: "0 0 4px 0"
                    }}>Rp{(product.price * product.quantity).toLocaleString()}</p>
                    <small style={{
                      color: "#a0aec0",
                      fontSize: isMobile ? "0.8rem" : "0.85rem"
                    }}>@Rp{product.price.toLocaleString()}</small>
                  </div>
                </div>
              ))}
              
              <div style={{
                textAlign: isMobile ? "center" : "right",
                marginTop: "30px",
                paddingTop: "20px",
                borderTop: "2px solid #f0f0f0"
              }}>
                <h3 style={{
                  color: "#1a202c",
                  fontWeight: "800",
                  fontSize: isMobile ? "1.6rem" : "2rem",
                  margin: 0
                }}>Total: Rp{totalPrice.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className={`column ${isMobile ? 'is-12' : 'is-one-third'}`}>
            <div style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: "24px",
              padding: isMobile ? "20px" : "30px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            }}>
              <h2 style={{
                color: "#1a202c",
                fontWeight: "700",
                fontSize: isMobile ? "1.5rem" : "1.8rem",
                marginBottom: "30px",
                textAlign: isMobile ? "center" : "left"
              }}>💳 Pembayaran</h2>
              
              {/* Money Input */}
              <div style={{ marginBottom: "30px" }}>
                <label style={{
                  color: "#1a202c",
                  fontWeight: "600",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  marginBottom: "15px",
                  display: "block",
                  textAlign: isMobile ? "center" : "left"
                }}>Masukkan Uang</label>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "20px",
                  justifyContent: isMobile ? "center" : "flex-start"
                }}>
                  {[2000, 5000, 10000, 20000, 50000].map(amount => (
                    <button
                      key={amount}
                      style={{
                        background: "rgba(49,130,206,0.1)",
                        color: "#3182ce",
                        border: "2px solid rgba(49,130,206,0.3)",
                        borderRadius: "15px",
                        padding: isMobile ? "10px 12px" : "12px 16px",
                        fontWeight: "600",
                        fontSize: isMobile ? "12px" : "14px",
                        cursor: isProcessing ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        opacity: isProcessing ? 0.6 : 1
                      }}
                      onClick={() => insertMoney(amount)}
                      disabled={isProcessing}
                      onMouseEnter={(e) => {
                        if (!isProcessing && !isMobile) {
                          e.target.style.background = "rgba(49,130,206,0.2)";
                          e.target.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(49,130,206,0.1)";
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      Rp{amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                <button
                  style={{
                    background: "linear-gradient(135deg, #718096 0%, #4a5568 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    padding: isMobile ? "10px 20px" : "12px 24px",
                    fontWeight: "600",
                    fontSize: isMobile ? "13px" : "14px",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    width: "100%",
                    marginBottom: "20px",
                    opacity: isProcessing ? 0.6 : 1
                  }}
                  onClick={resetMoney}
                  disabled={isProcessing}
                  onMouseEnter={(e) => {
                    if (!isProcessing && !isMobile) {
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  🔄 Kembalikan Uang
                </button>
              </div>

              {/* Payment Status */}
              <div style={{ marginBottom: "30px" }}>
                <p style={{
                  color: "#1a202c",
                  fontSize: isMobile ? "1rem" : "1.1rem",
                  margin: "0 0 8px 0",
                  textAlign: isMobile ? "center" : "left"
                }}>Total uang: <strong style={{ color: "#3182ce" }}>Rp{inserted.toLocaleString()}</strong></p>
                {inserted >= totalPrice ? (
                  <p style={{
                    color: "#38a169",
                    fontWeight: "600",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: isMobile ? "center" : "flex-start"
                  }}>
                    <span>✅</span> Uang cukup
                  </p>
                ) : (
                  <p style={{
                    color: "#e53e3e",
                    fontWeight: "600",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: isMobile ? "center" : "flex-start"
                  }}>
                    <span>⚠️</span> Kurang Rp{(totalPrice - inserted).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Purchase Button */}
              <button
                style={{
                  background: inserted >= totalPrice 
                    ? "linear-gradient(135deg, #38a169 0%, #2f855a 100%)"
                    : "linear-gradient(135deg, #a0aec0 0%, #718096 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  padding: isMobile ? "14px 28px" : "16px 32px",
                  fontWeight: "700",
                  fontSize: isMobile ? "15px" : "16px",
                  cursor: inserted >= totalPrice && !isProcessing ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  boxShadow: inserted >= totalPrice 
                    ? "0 8px 24px rgba(56,161,105,0.3)"
                    : "0 4px 16px rgba(160,174,192,0.3)",
                  width: "100%",
                  marginBottom: "20px",
                  opacity: inserted >= totalPrice && !isProcessing ? 1 : 0.6
                }}
                onClick={processPurchase}
                disabled={inserted < totalPrice || isProcessing}
                onMouseEnter={(e) => {
                  if (inserted >= totalPrice && !isProcessing && !isMobile) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 32px rgba(56,161,105,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = inserted >= totalPrice 
                    ? "0 8px 24px rgba(56,161,105,0.3)"
                    : "0 4px 16px rgba(160,174,192,0.3)";
                }}
              >
                {isProcessing ? (
                  <span style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}>
                    <span>⏳</span>
                    <span>Memproses...</span>
                  </span>
                ) : (
                  <span style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}>
                    <span>💳</span>
                    <span>Bayar (Rp{totalPrice.toLocaleString()})</span>
                  </span>
                )}
              </button>

              {/* Message */}
              {message && (
                <div style={{
                  background: message.includes('berhasil') 
                    ? "rgba(56,161,105,0.1)" 
                    : "rgba(229,62,62,0.1)",
                  border: message.includes('berhasil')
                    ? "1px solid rgba(56,161,105,0.3)"
                    : "1px solid rgba(229,62,62,0.3)",
                  borderRadius: "15px",
                  padding: "20px",
                  marginBottom: "20px",
                  position: "relative"
                }}>
                  <button 
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "none",
                      border: "none",
                      fontSize: "18px",
                      cursor: "pointer",
                      color: "#4a5568"
                    }}
                    onClick={() => setMessage('')}
                  >
                    ×
                  </button>
                  <p style={{
                    color: message.includes('berhasil') ? "#38a169" : "#e53e3e",
                    fontWeight: "600",
                    margin: 0,
                    fontSize: isMobile ? "0.9rem" : "0.95rem",
                    textAlign: isMobile ? "center" : "left"
                  }}>
                    {message}
                  </p>
                </div>
              )}

              {/* Back Buttons */}
              <div style={{
                display: "flex",
                gap: isMobile ? "10px" : "15px",
                flexDirection: isMobile ? "column" : "row"
              }}>
                <button
                  style={{
                    background: "rgba(49,130,206,0.1)",
                    color: "#3182ce",
                    border: "2px solid rgba(49,130,206,0.3)",
                    borderRadius: "20px",
                    padding: isMobile ? "10px 20px" : "12px 24px",
                    fontWeight: "600",
                    fontSize: isMobile ? "13px" : "14px",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    flex: 1,
                    opacity: isProcessing ? 0.6 : 1
                  }}
                  onClick={goToProductSelection}
                  disabled={isProcessing}
                  onMouseEnter={(e) => {
                    if (!isProcessing && !isMobile) {
                      e.target.style.background = "rgba(49,130,206,0.2)";
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(160,174,192,0.1)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  🔙 Kembali ke Pilihan Produk
                </button>
                <button
                  style={{
                    background: "rgba(160,174,192,0.1)",
                    color: "#4a5568",
                    border: "2px solid rgba(160,174,192,0.3)",
                    borderRadius: "20px",
                    padding: isMobile ? "10px 20px" : "12px 24px",
                    fontWeight: "600",
                    fontSize: isMobile ? "13px" : "14px",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    flex: 1,
                    opacity: isProcessing ? 0.6 : 1
                  }}
                  onClick={() => navigate('/')}
                  disabled={isProcessing}
                  onMouseEnter={(e) => {
                    if (!isProcessing && !isMobile) {
                      e.target.style.background = "rgba(160,174,192,0.2)";
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(49,130,206,0.1)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  🏠 Kembali ke Halaman Utama
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

