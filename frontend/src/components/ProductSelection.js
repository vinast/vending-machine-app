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
    <div className='container mt-5'>
      <div className='has-text-centered mb-6'>
        <h1 className='title is-1'>
          <span className='icon-text'>
            <span className='icon is-large'>
              <i className='fas fa-shopping-cart fa-2x'></i>
            </span>
            <span>Pilih Produk</span>
          </span>
        </h1>
        <p className='subtitle is-5'>Pilih produk yang ingin dibeli dan tentukan jumlahnya</p>
      </div>

      {/* Cart Summary */}
      {Object.keys(selectedProducts).length > 0 && (
        <div className='box has-background-primary-light mb-5'>
          <div className='is-flex is-justify-content-space-between is-align-items-center'>
            <div>
              <h3 className='title is-5 has-text-primary-dark'>Keranjang Belanja</h3>
              <p className='has-text-primary-dark'>
                Total: <strong>Rp{totalPrice.toLocaleString()}</strong>
              </p>
            </div>
            <button 
              className='button is-primary is-medium'
              onClick={proceedToCheckout}
            >
              Lanjut ke Pembayaran
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className='columns is-multiline'>
        {products.map(product => (
          <div key={product.id} className='column is-4'>
            <div className={`box ${isProductSelected(product.id) ? 'has-background-link-light' : ''}`}>
              <div className='has-text-centered mb-3'>
                <figure className='image is-128x128 mx-auto'>
                  <img 
                    src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://via.placeholder.com/128'} 
                    alt={product.name}
                    style={{objectFit: 'cover'}}
                  />
                </figure>
              </div>
              
              <div className='has-text-centered mb-3'>
                <h3 className='title is-5'>{product.name}</h3>
                <p className='title is-4 has-text-primary'>Rp{product.price.toLocaleString()}</p>
                <p className='subtitle is-6'>Stok: {product.stock}</p>
              </div>

              {isProductSelected(product.id) ? (
                <div className='has-text-centered'>
                  <div className='field has-addons has-addons-centered mb-3'>
                    <div className='control'>
                      <button 
                        className='button is-small'
                        onClick={() => handleQuantityChange(product.id, getSelectedQuantity(product.id) - 1)}
                        disabled={getSelectedQuantity(product.id) <= 1}
                      >
                        <span className='icon is-small'>
                          <i className='fas fa-minus'></i>
                        </span>
                      </button>
                    </div>
                    <div className='control'>
                      <input 
                        className='input is-small has-text-centered' 
                        type='number' 
                        value={getSelectedQuantity(product.id)}
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                        min='1'
                        max={product.stock}
                        style={{width: '60px'}}
                      />
                    </div>
                    <div className='control'>
                      <button 
                        className='button is-small'
                        onClick={() => handleQuantityChange(product.id, getSelectedQuantity(product.id) + 1)}
                        disabled={getSelectedQuantity(product.id) >= product.stock}
                      >
                        <span className='icon is-small'>
                          <i className='fas fa-plus'></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  <button 
                    className='button is-danger is-small'
                    onClick={() => removeFromCart(product.id)}
                  >
                    Hapus dari Keranjang
                  </button>
                </div>
              ) : (
                <div className='has-text-centered'>
                  <button 
                    className='button is-primary'
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {Object.keys(selectedProducts).length === 0 && (
        <div className='has-text-centered mt-6'>
          <div className='icon is-large has-text-grey-light mb-3'>
            <i className='fas fa-shopping-cart fa-3x'></i>
          </div>
          <p className='subtitle is-5 has-text-grey'>Belum ada produk yang dipilih</p>
          <p className='has-text-grey-light'>Pilih produk di atas untuk menambahkan ke keranjang</p>
        </div>
      )}
    </div>
  );
};

export default ProductSelection;


