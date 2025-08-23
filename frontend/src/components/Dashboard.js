import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]); // ✅ simpan list users
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: 0, stock: 0 });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        getUsers();
        fetchProducts();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
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

    const getUsers = async () => {
        try {
            const response = await axiosJWT.get('http://localhost:5000/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data); // ✅ simpan user ke state
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/products');
            console.log('Products received from backend:', res.data);
            setProducts(res.data);
        } catch (e) {
            console.error('Error fetching products:', e);
            console.error('Error response:', e.response?.data);
        }
    };

    const selectedProduct = useMemo(
        () => products.find(p => p.id === selectedProductId) || null,
        [products, selectedProductId]
    );

    const openCreateModal = () => {
        setSelectedProductId(null);
        setFormData({ name: '', price: 0, stock: 0 });
        setSelectedImage(null);
        setImagePreview('');
        setModalOpen(true);
    };

    const openEditModal = (product) => {
        setSelectedProductId(product.id);
        setFormData({ name: product.name, price: product.price, stock: product.stock });
        setSelectedImage(null);
        // Fix image preview for existing images
        if (product.imageUrl) {
            if (product.imageUrl.startsWith('http')) {
                setImagePreview(product.imageUrl);
            } else {
                setImagePreview(`http://localhost:5000${product.imageUrl}`);
            }
        } else {
            setImagePreview('');
        }
        setModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveProduct = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('stock', formData.stock);
            
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            }

            if (selectedProductId) {
                const response = await axiosJWT.put(`http://localhost:5000/products/${selectedProductId}`, formDataToSend, { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    } 
                });
                console.log('Product updated:', response.data);
            } else {
                const response = await axiosJWT.post('http://localhost:5000/products', formDataToSend, { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    } 
                });
                console.log('Product created:', response.data);
            }
            setModalOpen(false);
            await fetchProducts();
        } catch (e) {
            console.error('Error saving product:', e);
            console.error('Error response:', e.response?.data);
            alert('Error saving product: ' + (e.response?.data?.msg || e.message));
        }
    };

    const deleteProduct = async (id) => {
        try {
            console.log('Deleting product with ID:', id);
            const response = await axiosJWT.delete(`http://localhost:5000/products/${id}`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            console.log('Product deleted:', response.data);
            await fetchProducts();
        } catch (e) {
            console.error('Error deleting product:', e);
            console.error('Error response:', e.response?.data);
            alert('Error deleting product: ' + (e.response?.data?.msg || e.message));
        }
    };

    return (
        <div className='container mt-5'>
            <div className='has-text-centered mb-6'>
                <h1 className='title is-1'>
                    <span className='icon-text'>
                        <span className='icon is-large'>
                            <i className='fas fa-cog fa-2x'></i>
                        </span>
                        <span>Admin Panel</span>
                    </span>
                </h1>
                <p className='subtitle is-5'>Kelola produk vending dan lihat histori pembelian</p>
            </div>

            {/* Produk CRUD */}
            <div className='box'>
                <div className='is-flex is-justify-content-space-between is-align-items-center'>
                    <h2 className='title is-5'>Produk</h2>
                    <button className='button is-primary' onClick={openCreateModal}>Tambah Produk</button>
                </div>
                <table className="table is-striped is-fullwidth">
                    <thead>
                        <tr>
                            <th>Gambar</th>
                            <th>Nama</th>
                            <th>Harga</th>
                            <th>Stok</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <figure className="image is-48x48">
                                        <img 
                                            src={(() => {
                                                if (!p.imageUrl) return 'https://via.placeholder.com/48';
                                                if (p.imageUrl.startsWith('http')) return p.imageUrl;
                                                if (p.imageUrl.startsWith('/uploads/')) return `http://localhost:5000${p.imageUrl}`;
                                                return `http://localhost:5000/uploads/${p.imageUrl}`;
                                            })()}
                                            alt={p.name}
                                            style={{objectFit: 'cover'}}
                                            onError={(e) => {
                                                console.error('Image failed to load:', p.imageUrl);
                                                e.target.src = 'https://via.placeholder.com/48';
                                            }}
                                        />
                                    </figure>
                                </td>
                                <td>{p.name}</td>
                                <td>Rp{p.price}</td>
                                <td>{p.stock}</td>
                                <td>
                                    <button className='button is-small mr-2' onClick={() => openEditModal(p)}>Edit</button>
                                    <button className='button is-small is-danger' onClick={() => deleteProduct(p.id)}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            <div className={`modal ${modalOpen ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={()=> setModalOpen(false)}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{selectedProductId ? 'Edit Produk' : 'Tambah Produk'}</p>
                        <button className="delete" aria-label="close" onClick={()=> setModalOpen(false)}></button>
                    </header>
                    <section className="modal-card-body">
                        <div className='field'>
                            <label className='label'>Gambar Produk</label>
                            <div className='control'>
                                <input 
                                    type='file' 
                                    className='input' 
                                    accept='image/*'
                                    onChange={handleImageChange}
                                />
                            </div>
                            {imagePreview && (
                                <div className='mt-2'>
                                    <figure className="image is-128x128">
                                        <img 
                                            src={imagePreview}
                                            alt="Preview" 
                                            style={{objectFit: 'cover'}}
                                            onError={(e) => {
                                                console.error('Preview image failed to load:', imagePreview);
                                                e.target.src = 'https://via.placeholder.com/128';
                                            }}
                                        />
                                    </figure>
                                </div>
                            )}
                        </div>
                        <div className='field'>
                            <label className='label'>Nama</label>
                            <div className='control'>
                                <input 
                                    className='input' 
                                    value={formData.name} 
                                    onChange={e=> setFormData({...formData, name: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className='field'>
                            <label className='label'>Harga</label>
                            <div className='control'>
                                <input 
                                    type='number' 
                                    className='input' 
                                    value={formData.price} 
                                    onChange={e=> setFormData({...formData, price: parseInt(e.target.value||0,10)})} 
                                />
                            </div>
                        </div>
                        <div className='field'>
                            <label className='label'>Stok</label>
                            <div className='control'>
                                <input 
                                    type='number' 
                                    className='input' 
                                    value={formData.stock} 
                                    onChange={e=> setFormData({...formData, stock: parseInt(e.target.value||0,10)})} 
                                />
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success" onClick={saveProduct}>Simpan</button>
                        <button className="button" onClick={()=> setModalOpen(false)}>Batal</button>
                    </footer>
                </div>
            </div>

            {/* Tautan ke history */}
            <div className='mt-4'>
                <a className='button is-link' href='/admin/history'>Lihat Histori Pembelian</a>
            </div>
        </div>
    );
}

export default Dashboard;
