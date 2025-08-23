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
      // Calculate proportional amounts for each product
      const purchasePromises = selectedProducts.map(product => {
        const productTotal = product.price * product.quantity;
        const proportionalAmount = Math.round((productTotal / totalPrice) * inserted);
        
        return axios.post('http://localhost:5000/purchase', {
          productId: product.id,
          insertedAmount: proportionalAmount,
          quantity: product.quantity
        });
      });

      const results = await Promise.all(purchasePromises);
      
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
      const errorMsg = error?.response?.data?.msg || 'Gagal memproses pembelian';
      setMessage(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  if (selectedProducts.length === 0) {
    return (
      <div className='container mt-5'>
        <div className='has-text-centered'>
          <p>Tidak ada produk yang dipilih</p>
          <button className='button is-primary mt-3' onClick={goBack}>
            Kembali ke Pilihan Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mt-5'>
      <div className='has-text-centered mb-6'>
        <h1 className='title is-1'>
          <span className='icon-text'>
            <span className='icon is-large'>
              <i className='fas fa-credit-card fa-2x'></i>
            </span>
            <span>Checkout</span>
          </span>
        </h1>
        <p className='subtitle is-5'>Lengkapi pembayaran untuk produk yang dipilih</p>
      </div>

      <div className='columns'>
        {/* Order Summary */}
        <div className='column is-two-thirds'>
          <div className='box'>
            <h2 className='title is-4 mb-4'>Ringkasan Pesanan</h2>
            {selectedProducts.map((product, index) => (
              <div key={index} className='is-flex is-justify-content-space-between is-align-items-center mb-3 pb-3' style={{borderBottom: '1px solid #f0f0f0'}}>
                <div className='is-flex is-align-items-center'>
                  <figure className='image is-48x48 mr-3'>
                    <img 
                      src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://via.placeholder.com/48'} 
                      alt={product.name}
                      style={{objectFit: 'cover'}}
                    />
                  </figure>
                  <div>
                    <strong>{product.name}</strong>
                    <p className='has-text-grey-light'>Qty: {product.quantity}</p>
                  </div>
                </div>
                <div className='has-text-right'>
                  <p className='has-text-primary'>Rp{(product.price * product.quantity).toLocaleString()}</p>
                  <small className='has-text-grey-light'>@Rp{product.price.toLocaleString()}</small>
                </div>
              </div>
            ))}
            
            <div className='has-text-right mt-4 pt-3' style={{borderTop: '2px solid #f0f0f0'}}>
              <h3 className='title is-4'>Total: Rp{totalPrice.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className='column is-one-third'>
          <div className='box'>
            <h2 className='title is-4 mb-4'>Pembayaran</h2>
            
            {/* Money Input */}
            <div className='mb-4'>
              <label className='label'>Masukkan Uang</label>
              <div className='buttons mb-3'>
                {[2000, 5000, 10000, 20000, 50000].map(amount => (
                  <button
                    key={amount}
                    className='button is-light'
                    onClick={() => insertMoney(amount)}
                    disabled={isProcessing}
                  >
                    Rp{amount.toLocaleString()}
                  </button>
                ))}
              </div>
              <button
                className='button is-fullwidth mb-3'
                onClick={resetMoney}
                disabled={isProcessing}
              >
                Kembalikan Uang
              </button>
            </div>

            {/* Payment Status */}
            <div className='mb-4'>
              <p>Total uang: <strong>Rp{inserted.toLocaleString()}</strong></p>
              {inserted >= totalPrice ? (
                <p className='has-text-success'>
                  <i className='fas fa-check-circle'></i> Uang cukup
                </p>
              ) : (
                <p className='has-text-danger'>
                  <i className='fas fa-exclamation-circle'></i> Kurang Rp{(totalPrice - inserted).toLocaleString()}
                </p>
              )}
            </div>

            {/* Purchase Button */}
            <button
              className='button is-primary is-fullwidth is-medium'
              onClick={processPurchase}
              disabled={inserted < totalPrice || isProcessing}
            >
              {isProcessing ? (
                <span>
                  <span className='icon'>
                    <i className='fas fa-spinner fa-spin'></i>
                  </span>
                  <span>Memproses...</span>
                </span>
              ) : (
                `Bayar (Rp${totalPrice.toLocaleString()})`
              )}
            </button>

            {/* Message */}
            {message && (
              <div className={`notification mt-4 ${message.includes('berhasil') ? 'is-success' : 'is-danger'}`}>
                <button className='delete' onClick={() => setMessage('')}></button>
                {message}
              </div>
            )}

            {/* Back Button */}
            <button
              className='button is-light is-fullwidth mt-3'
              onClick={goBack}
              disabled={isProcessing}
            >
              Kembali ke Pilihan Produk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

