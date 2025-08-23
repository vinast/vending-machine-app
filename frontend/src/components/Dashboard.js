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

    // Create axios instance with interceptors
    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        
        // Check if token is expired
        if (expire * 1000 < currentDate.getTime()) {
            try {
                // Refresh token if expired
                const response = await axios.get('http://localhost:5000/token');
                setToken(response.data.accessToken);
                const decoded = jwtDecode(response.data.accessToken);
                setExpire(decoded.exp);
                
                // Update the request with new token
                config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            } catch (error) {
                // If refresh fails, redirect to login
                navigate("/admin/login");
                return Promise.reject(error);
            }
        } else {
            // Use current token if still valid
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
                try {
                    // Try to refresh token
                    const response = await axios.get('http://localhost:5000/token');
                    setToken(response.data.accessToken);
                    const decoded = jwtDecode(response.data.accessToken);
                    setExpire(decoded.exp);
                    
                    // Retry the original request with new token
                    const originalRequest = error.config;
                    originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                    return axiosJWT(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, redirect to login
                    navigate("/admin/login");
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    const getUsers = async () => {
        try {
            const response = await axiosJWT.get('http://localhost:5000/users');
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
            // Ensure we have a valid token before proceeding
            if (!token) {
                await refreshToken();
            }

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
                        'Content-Type': 'multipart/form-data'
                    } 
                });
                console.log('Product updated:', response.data);
            } else {
                const response = await axiosJWT.post('http://localhost:5000/products', formDataToSend, { 
                    headers: { 
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
            
            if (e.response?.status === 403) {
                alert('Session expired. Please refresh the page and try again.');
                await refreshToken();
            } else {
                alert('Error saving product: ' + (e.response?.data?.msg || e.message));
            }
        }
    };

    const deleteProduct = async (id) => {
        try {
            // Ensure we have a valid token before proceeding
            if (!token) {
                await refreshToken();
            }

            console.log('Deleting product with ID:', id);
            const response = await axiosJWT.delete(`http://localhost:5000/products/${id}`);
            console.log('Product deleted:', response.data);
            await fetchProducts();
        } catch (e) {
            console.error('Error deleting product:', e);
            console.error('Error response:', e.response?.data);
            
            if (e.response?.status === 403) {
                alert('Session expired. Please refresh the page and try again.');
                await refreshToken();
            } else {
                alert('Error deleting product: ' + (e.response?.data?.msg || e.message));
            }
        }
    };

    return (
        <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh" }}>
            <div className='container' style={{ paddingTop: "40px" }}>
                {/* Produk CRUD */}
                <div style={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.6)",
                    borderRadius: "24px",
                    padding: "30px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                    marginBottom: "30px"
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
                        }}>📦 Produk</h2>
                        <button 
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
                            onClick={openCreateModal}
                            onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 8px 24px rgba(49,130,206,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 4px 16px rgba(49,130,206,0.3)";
                            }}
                        >
                            ➕ Tambah Produk
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
                                    }}>Gambar</th>
                                    <th style={{
                                        padding: "16px",
                                        textAlign: "left",
                                        fontWeight: "700",
                                        color: "#1a202c",
                                        borderBottom: "2px solid #e2e8f0"
                                    }}>Nama</th>
                                    <th style={{
                                        padding: "16px",
                                        textAlign: "left",
                                        fontWeight: "700",
                                        color: "#1a202c",
                                        borderBottom: "2px solid #e2e8f0"
                                    }}>Harga</th>
                                    <th style={{
                                        padding: "16px",
                                        textAlign: "left",
                                        fontWeight: "700",
                                        color: "#1a202c",
                                        borderBottom: "2px solid #e2e8f0"
                                    }}>Stok</th>
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
                                {products.map(p => (
                                    <tr key={p.id} style={{
                                        borderBottom: "1px solid #f7fafc",
                                        transition: "background 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.parentElement.style.background = "#f7fafc";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.parentElement.style.background = "white";
                                    }}>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{
                                                width: "60px",
                                                height: "60px",
                                                overflow: "hidden",
                                                borderRadius: "12px",
                                                border: "2px solid #e2e8f0"
                                            }}>
                                                <img 
                                                    src={(() => {
                                                        if (!p.imageUrl) return 'https://via.placeholder.com/60';
                                                        if (p.imageUrl.startsWith('http')) return p.imageUrl;
                                                        if (p.imageUrl.startsWith('/uploads/')) return `http://localhost:5000${p.imageUrl}`;
                                                        return `http://localhost:5000/uploads/${p.imageUrl}`;
                                                    })()}
                                                    alt={p.name}
                                                    style={{
                                                        objectFit: "cover",
                                                        width: "100%",
                                                        height: "100%"
                                                    }}
                                                    onError={(e) => {
                                                        console.error('Image failed to load:', p.imageUrl);
                                                        e.target.src = 'https://via.placeholder.com/60';
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td style={{
                                            padding: "16px",
                                            fontWeight: "600",
                                            color: "#1a202c"
                                        }}>{p.name}</td>
                                        <td style={{
                                            padding: "16px",
                                            color: "#3182ce",
                                            fontWeight: "700"
                                        }}>Rp{p.price.toLocaleString()}</td>
                                        <td style={{
                                            padding: "16px",
                                            color: p.stock > 0 ? "#38a169" : "#e53e3e",
                                            fontWeight: "600"
                                        }}>{p.stock}</td>
                                        <td style={{ padding: "16px" }}>
                                            <button 
                                                style={{
                                                    background: "rgba(49,130,206,0.1)",
                                                    color: "#3182ce",
                                                    border: "2px solid rgba(49,130,206,0.3)",
                                                    borderRadius: "8px",
                                                    padding: "8px 16px",
                                                    fontWeight: "600",
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                    marginRight: "8px",
                                                    transition: "all 0.3s ease"
                                                }}
                                                onClick={() => openEditModal(p)}
                                                onMouseEnter={(e) => {
                                                    e.target.style.background = "rgba(49,130,206,0.2)";
                                                    e.target.style.transform = "translateY(-1px)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = "rgba(49,130,206,0.1)";
                                                    e.target.style.transform = "translateY(0)";
                                                }}
                                            >
                                                ✏️ Edit
                                            </button>
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
                                                onClick={() => deleteProduct(p.id)}
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
                </div>

                {/* Modal Form */}
                <div className={`modal ${modalOpen ? 'is-active' : ''}`}>
                    <div className="modal-background" onClick={()=> setModalOpen(false)}></div>
                    <div className="modal-card" style={{
                        borderRadius: "24px",
                        overflow: "hidden"
                    }}>
                        <header className="modal-card-head" style={{
                            background: "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)",
                            color: "white"
                        }}>
                            <p className="modal-card-title" style={{
                                fontWeight: "700",
                                fontSize: "1.3rem"
                            }}>
                                {selectedProductId ? '✏️ Edit Produk' : '➕ Tambah Produk'}
                            </p>
                            <button className="delete" aria-label="close" onClick={()=> setModalOpen(false)}></button>
                        </header>
                        <section className="modal-card-body" style={{ padding: "30px" }}>
                            <div style={{ marginBottom: "24px" }}>
                                <label style={{
                                    color: "#1a202c",
                                    fontWeight: "600",
                                    fontSize: "1rem",
                                    marginBottom: "8px",
                                    display: "block"
                                }}>🖼️ Gambar Produk</label>
                                <input 
                                    type='file' 
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "2px solid #e2e8f0",
                                        borderRadius: "12px",
                                        fontSize: "14px",
                                        transition: "all 0.3s ease",
                                        boxSizing: "border-box"
                                    }}
                                    accept='image/*'
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <div style={{ marginTop: "16px" }}>
                                        <div style={{
                                            width: "128px",
                                            height: "128px",
                                            overflow: "hidden",
                                            borderRadius: "16px",
                                            border: "2px solid #e2e8f0"
                                        }}>
                                            <img 
                                                src={imagePreview}
                                                alt="Preview" 
                                                style={{
                                                    objectFit: "cover",
                                                    width: "100%",
                                                    height: "100%"
                                                }}
                                                onError={(e) => {
                                                    console.error('Preview image failed to load:', imagePreview);
                                                    e.target.src = 'https://via.placeholder.com/128';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{ marginBottom: "24px" }}>
                                <label style={{
                                    color: "#1a202c",
                                    fontWeight: "600",
                                    fontSize: "1rem",
                                    marginBottom: "8px",
                                    display: "block"
                                }}>📝 Nama</label>
                                <input 
                                    style={{
                                        width: "100%",
                                        padding: "16px",
                                        border: "2px solid #e2e8f0",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        transition: "all 0.3s ease",
                                        boxSizing: "border-box"
                                    }}
                                    value={formData.name} 
                                    onChange={e=> setFormData({...formData, name: e.target.value})} 
                                />
                            </div>
                            <div style={{ marginBottom: "24px" }}>
                                <label style={{
                                    color: "#1a202c",
                                    fontWeight: "600",
                                    fontSize: "1rem",
                                    marginBottom: "8px",
                                    display: "block"
                                }}>💰 Harga</label>
                                <input 
                                    type='number' 
                                    style={{
                                        width: "100%",
                                        padding: "16px",
                                        border: "2px solid #e2e8f0",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        transition: "all 0.3s ease",
                                        boxSizing: "border-box"
                                    }}
                                    value={formData.price} 
                                    onChange={e=> setFormData({...formData, price: parseInt(e.target.value||0,10)})} 
                                />
                            </div>
                            <div style={{ marginBottom: "24px" }}>
                                <label style={{
                                    color: "#1a202c",
                                    fontWeight: "600",
                                    fontSize: "1rem",
                                    marginBottom: "8px",
                                    display: "block"
                                }}>📦 Stok</label>
                                <input 
                                    type='number' 
                                    style={{
                                        width: "100%",
                                        padding: "16px",
                                        border: "2px solid #e2e8f0",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        transition: "all 0.3s ease",
                                        boxSizing: "border-box"
                                    }}
                                    value={formData.stock} 
                                    onChange={e=> setFormData({...formData, stock: parseInt(e.target.value||0,10)})} 
                                />
                            </div>
                        </section>
                        <footer className="modal-card-foot" style={{
                            background: "#f7fafc",
                            padding: "20px 30px",
                            borderTop: "1px solid #e2e8f0"
                        }}>
                            <button 
                                style={{
                                    background: "linear-gradient(135deg, #38a169 0%, #2f855a 100%)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "20px",
                                    padding: "12px 24px",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    boxShadow: "0 4px 16px rgba(56,161,105,0.3)"
                                }}
                                onClick={saveProduct}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 8px 24px rgba(56,161,105,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "0 4px 16px rgba(56,161,105,0.3)";
                                }}
                            >
                                💾 Simpan
                            </button>
                            <button 
                                style={{
                                    background: "rgba(160,174,192,0.1)",
                                    color: "#4a5568",
                                    border: "2px solid rgba(160,174,192,0.3)",
                                    borderRadius: "20px",
                                    padding: "12px 24px",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease"
                                }}
                                onClick={()=> setModalOpen(false)}
                                onMouseEnter={(e) => {
                                    e.target.style.background = "rgba(160,174,192,0.2)";
                                    e.target.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = "rgba(160,174,192,0.1)";
                                    e.target.style.transform = "translateY(0)";
                                }}
                            >
                                ❌ Batal
                            </button>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
