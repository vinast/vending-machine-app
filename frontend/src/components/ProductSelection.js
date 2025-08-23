import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductSelection = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Update total price when selected products change
  useEffect(() => {
    const total = Object.values(selectedProducts).reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setTotalPrice(total);
  }, [selectedProducts]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove product if quantity is 0 or negative
      const newSelected = { ...selectedProducts };
      delete newSelected[productId];
      setSelectedProducts(newSelected);
    } else {
      // Update quantity
      setSelectedProducts(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: newQuantity
        }
      }));
    }
  };

  const addToCart = (product) => {
    if (selectedProducts[product.id]) {
      // Increase quantity if already selected
      handleQuantityChange(product.id, selectedProducts[product.id].quantity + 1);
    } else {
      // Add new product
      setSelectedProducts(prev => ({
        ...prev,
        [product.id]: {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          quantity: 1
        }
      }));
    }
  };

  const removeFromCart = (productId) => {
    const newSelected = { ...selectedProducts };
    delete newSelected[productId];
    setSelectedProducts(newSelected);
  };

  const proceedToCheckout = () => {
    if (Object.keys(selectedProducts).length === 0) {
      alert('Pilih produk terlebih dahulu!');
      return;
    }
    
    // Navigate to checkout with selected products
    navigate('/checkout', { 
      state: { 
        selectedProducts: Object.values(selectedProducts),
        totalPrice 
      } 
    });
  };

  const getSelectedQuantity = (productId) => {
    return selectedProducts[productId]?.quantity || 0;
  };

  const isProductSelected = (productId) => {
    return selectedProducts[productId] !== undefined;
  };



  return (
    <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh" }}>
      <div className='container' style={{ paddingTop: "40px" }}>
        <div style={{ textAlign: "left", marginBottom: "60px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "left",
            gap: "12px",
            background: "rgba(49,130,206,0.1)",
            padding: "12px 24px",
            borderRadius: "25px",
            marginBottom: "20px"
          }}>
            <span style={{ fontSize: "20px" }}>🛒</span>
            <span style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#3182ce"
            }}>PILIH PRODUK</span>
          </div>
        </div>

        {/* Cart Summary */}
        {Object.keys(selectedProducts).length > 0 && (
          <div style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: "24px",
            padding: "30px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #3182ce",
            marginBottom: "40px"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{
                  color: "#1a202c",
                  fontWeight: "700",
                  fontSize: "1.5rem",
                  margin: "0 0 8px 0"
                }}>🛒 Keranjang Belanja</h3>
                <p style={{
                  color: "#3182ce",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  margin: 0
                }}>
                  Total: <strong>Rp{totalPrice.toLocaleString()}</strong>
                </p>
              </div>
              <button 
                style={{
                  background: "linear-gradient(135deg, #38a169 0%, #2f855a 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  padding: "16px 32px",
                  fontWeight: "700",
                  fontSize: "16px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 24px rgba(56,161,105,0.3)"
                }}
                onClick={proceedToCheckout}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 32px rgba(56,161,105,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 24px rgba(56,161,105,0.3)";
                }}
              >
                💳 Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className='columns is-multiline'>
          {products.map(product => (
            <div key={product.id} className='column is-4'>
              <div style={{
                background: isProductSelected(product.id) 
                  ? "rgba(49,130,206,0.05)" 
                  : "rgba(255,255,255,0.9)",
                backdropFilter: "blur(20px)",
                border: isProductSelected(product.id)
                  ? "2px solid rgba(49,130,206,0.3)"
                  : "1px solid rgba(255,255,255,0.6)",
                borderRadius: "24px",
                padding: "30px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                transform: isProductSelected(product.id) ? "translateY(-4px)" : "translateY(0)",
                borderLeft: isProductSelected(product.id) ? "4px solid #3182ce" : "none"
              }}>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{
                    width: "128px",
                    height: "128px",
                    margin: "0 auto",
                    overflow: "hidden",
                    borderRadius: "16px",
                    border: "2px solid #e2e8f0"
                  }}>
                    <img 
                      src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://via.placeholder.com/128'} 
                      alt={product.name}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        display: "block"
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <h3 style={{
                    color: "#1a202c",
                    fontWeight: "700",
                    fontSize: "1.3rem",
                    margin: "0 0 12px 0"
                  }}>{product.name}</h3>
                  <p style={{
                    color: "#3182ce",
                    fontWeight: "800",
                    fontSize: "1.5rem",
                    margin: "0 0 8px 0"
                  }}>Rp{product.price.toLocaleString()}</p>
                  <p style={{
                    color: product.stock > 0 ? "#38a169" : "#e53e3e",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    margin: 0
                  }}>Stok: {product.stock}</p>
                </div>

                {isProductSelected(product.id) ? (
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      marginBottom: "20px"
                    }}>
                      <button 
                        style={{
                          background: "rgba(49,130,206,0.1)",
                          color: "#3182ce",
                          border: "2px solid rgba(49,130,206,0.3)",
                          borderRadius: "12px",
                          padding: "8px 12px",
                          fontWeight: "600",
                          fontSize: "14px",
                          cursor: "pointer",
                          transition: "all 0.3s ease"
                        }}
                        onClick={() => handleQuantityChange(product.id, getSelectedQuantity(product.id) - 1)}
                        disabled={getSelectedQuantity(product.id) <= 1}
                        onMouseEnter={(e) => {
                          if (getSelectedQuantity(product.id) > 1) {
                            e.target.style.background = "rgba(49,130,206,0.2)";
                            e.target.style.transform = "scale(1.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(49,130,206,0.1)";
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        ➖
                      </button>
                      <input 
                        style={{
                          width: "60px",
                          padding: "8px",
                          border: "2px solid #e2e8f0",
                          borderRadius: "8px",
                          fontSize: "14px",
                          textAlign: "center",
                          fontWeight: "600"
                        }}
                        type='number' 
                        value={getSelectedQuantity(product.id)}
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                        min='1'
                        max={product.stock}
                      />
                      <button 
                        style={{
                          background: "rgba(49,130,206,0.1)",
                          color: "#3182ce",
                          border: "2px solid rgba(49,130,206,0.3)",
                          borderRadius: "12px",
                          padding: "8px 12px",
                          fontWeight: "600",
                          fontSize: "14px",
                          cursor: "pointer",
                          transition: "all 0.3s ease"
                        }}
                        onClick={() => handleQuantityChange(product.id, getSelectedQuantity(product.id) + 1)}
                        disabled={getSelectedQuantity(product.id) >= product.stock}
                        onMouseEnter={(e) => {
                          if (getSelectedQuantity(product.id) < product.stock) {
                            e.target.style.background = "rgba(49,130,206,0.2)";
                            e.target.style.transform = "scale(1.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(49,130,206,0.1)";
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        ➕
                      </button>
                    </div>
                    <button 
                      style={{
                        background: "rgba(229,62,62,0.1)",
                        color: "#e53e3e",
                        border: "2px solid rgba(229,62,62,0.3)",
                        borderRadius: "20px",
                        padding: "12px 24px",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        width: "100%"
                      }}
                      onClick={() => removeFromCart(product.id)}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(229,62,62,0.2)";
                        e.target.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(229,62,62,0.1)";
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      🗑️ Hapus dari Keranjang
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <button 
                      style={{
                        background: product.stock > 0 
                          ? "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)"
                          : "linear-gradient(135deg, #a0aec0 0%, #718096 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "20px",
                        padding: "16px 32px",
                        fontWeight: "700",
                        fontSize: "16px",
                        cursor: product.stock > 0 ? "pointer" : "not-allowed",
                        transition: "all 0.3s ease",
                        boxShadow: product.stock > 0 
                          ? "0 8px 24px rgba(49,130,206,0.3)"
                          : "0 4px 16px rgba(160,174,192,0.3)",
                        width: "100%",
                        opacity: product.stock > 0 ? 1 : 0.6
                      }}
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      onMouseEnter={(e) => {
                        if (product.stock > 0) {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 12px 32px rgba(49,130,206,0.4)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = product.stock > 0 
                          ? "0 8px 24px rgba(49,130,206,0.3)"
                          : "0 4px 16px rgba(160,174,192,0.3)";
                      }}
                    >
                      {product.stock > 0 ? '🛒 Tambah ke Keranjang' : '❌ Stok Habis'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {Object.keys(selectedProducts).length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{
              fontSize: "80px",
              color: "#cbd5e0",
              marginBottom: "20px"
            }}>
              🛒
            </div>
            <p style={{
              color: "#4a5568",
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "12px"
            }}>Belum ada produk yang dipilih</p>
            <p style={{
              color: "#a0aec0",
              fontSize: "1rem"
            }}>Pilih produk di atas untuk menambahkan ke keranjang</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSelection;


