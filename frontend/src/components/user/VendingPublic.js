import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const VendingPublic = () => {
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const run = async () => {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data);
    };
    run();
  }, []);

  const goToProductSelection = () => {
    navigate("/products");
  };

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    fade: true,
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh" }}>
      {/* Modern Header with Logo */}
      <header style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        padding: isMobile ? "15px 0" : "20px 0",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
      }}>
        <div className="container">
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "15px" : "0"
          }}>
            {/* Modern Logo */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <div style={{
                width: isMobile ? "40px" : "48px",
                height: isMobile ? "40px" : "48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <img 
                  src="/logo.png" 
                  alt="SmartVend Logo" 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover" 
                  }} 
                />
              </div>
              <div>
                <h1 style={{
                  fontSize: isMobile ? "20px" : "24px",
                  fontWeight: "800",
                  margin: 0,
                  background: "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  SmartVend
                </h1>
                <p style={{
                  fontSize: isMobile ? "10px" : "12px",
                  color: "#4a5568",
                  margin: 0,
                  fontWeight: "500"
                }}>
                  Solusi Vending Generasi Baru
                </p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav style={{
              display: "flex",
              gap: isMobile ? "20px" : "32px",
              alignItems: "center",
              flexWrap: isMobile ? "wrap" : "nowrap",
              justifyContent: isMobile ? "center" : "flex-end"
            }}>
              {!isMobile && (
                <>
                  <a href="#home" style={{
                    color: "#4a5568",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "16px",
                    transition: "color 0.3s ease"
                  }}>Beranda</a>
                  <a href="#about" style={{
                    color: "#4a5568",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "16px",
                    transition: "color 0.3s ease"
                  }}>Tentang</a>
                </>
              )}
              <button
                className="button"
                style={{
                  background: "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  padding: isMobile ? "10px 20px" : "12px 24px",
                  fontWeight: "600",
                  fontSize: isMobile ? "12px" : "14px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 16px rgba(49,130,206,0.3)",
                  width: isMobile ? "100%" : "auto"
                }}
                onClick={goToProductSelection}
              >
                🛒 Belanja Sekarang
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <section id="home" className="hero is-fullheight" style={{ position: "relative", paddingTop: isMobile ? "20px" : "40px" }}>
        <Slider {...settings}>
          {[
            {
              img: "https://images.unsplash.com/photo-1564998115952-368e7d4969ea?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              title: "Teknologi Vending Pintar",
              subtitle: "Rasakan masa depan kenyamanan dengan mesin vending berbasis AI",
              badge: "🚀 Inovasi"
            },
            {
              img: "https://images.unsplash.com/photo-1692128559152-ec9df74a955c?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              title: "Produk Premium",
              subtitle: "Minuman segar, camilan sehat, dan produk berkualitas di ujung jari Anda",
              badge: "⭐ Premium"
            },
            {
              img: "https://plus.unsplash.com/premium_photo-1745208226635-271389eda838?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              title: "Pembayaran Digital",
              subtitle: "Transaksi aman dengan berbagai metode pembayaran dan pelacakan real-time",
              badge: "💳 Aman"
            },
          ].map((slide, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={slide.img}
                alt={slide.title}
                style={{
                  width: "100%",
                  height: isMobile ? "60vh" : "80vh",
                  objectFit: "cover",
                  borderRadius: isMobile ? "15px" : "20px",
                  margin: isMobile ? "0 10px" : "0 20px"
                }}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1607082349566-1873428f2a3e?q=80&w=1600&h=900&fit=crop";
                }}
              />
              
              {/* Modern Badge */}
              <div style={{
                position: "absolute",
                top: isMobile ? "20px" : "40px",
                left: isMobile ? "20px" : "40px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
              }}>
                <span style={{
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "600",
                  color: "#3182ce"
                }}>{slide.badge}</span>
              </div>

              {/* Enhanced overlay with modern design */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: isMobile ? "60vh" : "80vh",
                  background: "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%)",
                  borderRadius: isMobile ? "15px" : "20px",
                  margin: isMobile ? "0 10px" : "0 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  textAlign: "center",
                  padding: isMobile ? "20px" : "40px",
                }}
              >
                <h1
                  className="title is-1"
                  style={{ 
                    color: "white",
                    textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                    fontWeight: "800",
                    marginBottom: "20px",
                    fontSize: isMobile ? "2rem" : "3.5rem",
                    lineHeight: "1.2"
                  }}
                >
                  {slide.title}
                </h1>
                <p className="subtitle is-4 mb-5" style={{ 
                  color: "rgba(255,255,255,0.9)",
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                  fontWeight: "400",
                  fontSize: isMobile ? "1rem" : "1.3rem",
                  maxWidth: "600px",
                  lineHeight: "1.6"
                }}>
                  {slide.subtitle}
                </p>
                <button
                  className="button is-large"
                  style={{ 
                    borderRadius: "30px", 
                    padding: isMobile ? "15px 30px" : "20px 40px",
                    fontSize: isMobile ? "1rem" : "1.2rem",
                    fontWeight: "700",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    border: "none",
                    background: "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)",
                    color: "white",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    width: isMobile ? "90%" : "auto"
                  }}
                  onClick={goToProductSelection}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
                  }}
                >
                  🛒 Belanja Sekarang
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Enhanced Products Section */}
      <section id="products" className="section" style={{ padding: isMobile ? "40px 0" : "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: isMobile ? "40px" : "60px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(49,130,206,0.1)",
              padding: isMobile ? "8px 16px" : "12px 24px",
              borderRadius: "25px",
              marginBottom: "20px"
            }}>
              <span style={{ fontSize: isMobile ? "16px" : "20px" }}>✨</span>
              <span style={{
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: "600",
                color: "#3182ce"
              }}>PRODUK UNGGULAN</span>
            </div>
            <h2 className="title is-2" style={{ 
              color: "#1a202c", 
              fontWeight: "800",
              fontSize: isMobile ? "2rem" : "3rem",
              marginBottom: "16px"
            }}>
              Pilihan Terbaik
            </h2>
            <p className="subtitle is-5" style={{ 
              color: "#4a5568",
              fontSize: isMobile ? "1rem" : "1.2rem",
              maxWidth: "600px",
              margin: "0 auto"
            }}>
              Temukan koleksi produk berkualitas tinggi yang kami pilih khusus untuk Anda
            </p>
          </div>
          
          <div className="columns is-multiline">
            {products.slice(0, isMobile ? 2 : 3).map((product) => (
              <div onClick={goToProductSelection} key={product.id} className={`column ${isMobile ? 'is-6' : 'is-4'}`}>
                <div
                  className="box has-text-centered"
                  style={{
                    borderRadius: "24px",
                    backdropFilter: "blur(25px)",
                    background: "rgba(255,255,255,0.8)",
                    border: "1px solid rgba(255,255,255,0.6)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    cursor: "pointer",
                    padding: isMobile ? "20px 15px" : "30px 25px",
                    position: "relative",
                    overflow: "hidden",
                    height: "100%"
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateY(-12px) scale(1.03)";
                      e.currentTarget.style.boxShadow = "0 30px 80px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.8)";
                    }
                  }}
                >
                  {/* Product badge */}
                  <div style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "15px",
                    fontSize: isMobile ? "10px" : "12px",
                    fontWeight: "600",
                    zIndex: 2
                  }}>
                    Hot 🔥
                  </div>
                  
                  <figure
                    className="image is-160x160 mx-auto mb-5"
                    style={{ 
                      overflow: "hidden", 
                      borderRadius: "20px",
                      position: "relative",
                      zIndex: 1,
                      width: isMobile ? "200px" : "280px",
                      height: isMobile ? "200px" : "280px"
                    }}
                  >
                    <img
                      src={
                        product.imageUrl
                          ? `http://localhost:5000${product.imageUrl}`
                          : "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=280&h=280&fit=crop"
                      }
                      alt={product.name}
                      style={{ 
                        objectFit: "cover", 
                        width: "100%", 
                        height: "100%",
                        display: "block"
                      }}
                    />
                  </figure>
                  
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <h3 className="title is-5" style={{ 
                      color: "#1a202c", 
                      fontWeight: "700",
                      fontSize: isMobile ? "1.1rem" : "1.3rem",
                      marginBottom: "12px"
                    }}>
                      {product.name}
                    </h3>
                    <p className="title is-4" style={{ 
                      color: "#3182ce",
                      fontWeight: "800",
                      fontSize: isMobile ? "1.5rem" : "1.8rem",
                      marginBottom: "12px"
                    }}>
                      Rp{product.price.toLocaleString()}
                    </p>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginBottom: "16px"
                    }}>
                      <span style={{ fontSize: isMobile ? "12px" : "14px", color: "#4a5568" }}>📦</span>
                      <span style={{ fontSize: isMobile ? "12px" : "14px", color: "#4a5568", fontWeight: "600" }}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="has-text-centered mt-6">
            <button
              className="button is-outlined is-large"
              style={{ 
                borderRadius: "30px", 
                padding: isMobile ? "12px 30px" : "16px 40px",
                fontSize: isMobile ? "1rem" : "1.2rem",
                fontWeight: "700",
                border: "3px solid #3182ce",
                color: "#3182ce",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                width: isMobile ? "90%" : "auto"
              }}
              onClick={goToProductSelection}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.background = "#3182ce";
                  e.target.style.color = "white";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.target.style.background = "rgba(255,255,255,0.9)";
                  e.target.style.color = "#3182ce";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              🔍 Lihat Semua Produk
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="about"
        className="section"
        style={{ 
          background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(0,0,0,0.05)",
          padding: isMobile ? "40px 0" : "80px 0"
        }}
      >
        <div className="container has-text-centered">
          <div style={{ marginBottom: isMobile ? "40px" : "60px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(49,130,206,0.1)",
              padding: isMobile ? "8px 16px" : "12px 24px",
              borderRadius: "25px",
              marginBottom: "20px"
            }}>
              <span style={{ fontSize: isMobile ? "16px" : "20px" }}>🚀</span>
              <span style={{
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: "600",
                color: "#3182ce"
              }}>KENAPA PILIH KAMI</span>
            </div>
            <h2 className="title is-2 mb-4" style={{ 
              color: "#1a202c", 
              fontWeight: "800",
              fontSize: isMobile ? "2rem" : "3rem"
            }}>
              Teknologi Pintar, Pengalaman Lebih Baik
            </h2>
            <p className="subtitle is-5 mb-5" style={{ 
              color: "#4a5568",
              fontSize: isMobile ? "1rem" : "1.2rem",
              maxWidth: "700px",
              margin: "0 auto"
            }}>
              Rasakan masa depan vending dengan teknologi terkini dan layanan premium kami
            </p>
          </div>
          
          <div className="columns is-multiline">
            {[
              {
                icon: "🕐",
                title: "Tersedia 24/7",
                desc: "Akses mesin vending kami kapan saja, di mana saja. Tidak perlu menunggu jam buka toko.",
                color: "#3182ce"
              },
              {
                icon: "📱",
                title: "Pembayaran Digital",
                desc: "Berbagai opsi pembayaran termasuk dompet digital, kartu, dan pembayaran tanpa kontak.",
                color: "#2b6cb0"
              },
              {
                icon: "⚡",
                title: "Transaksi Instan",
                desc: "Layanan super cepat dengan pelacakan inventaris real-time dan rekomendasi produk pintar.",
                color: "#1a202c"
              },
              {
                icon: "🔒",
                title: "Aman & Terpercaya",
                desc: "Fitur keamanan canggih dan pemantauan real-time untuk keselamatan dan kenyamanan Anda.",
                color: "#38a169"
              },
            ].map((item, i) => (
              <div key={i} className={`column ${isMobile ? 'is-6' : 'is-3'}`}>
                <div
                  style={{
                    backdropFilter: "blur(25px)",
                    background: "rgba(255,255,255,0.8)",
                    border: "1px solid rgba(255,255,255,0.6)",
                    padding: isMobile ? "25px 20px" : "40px 30px",
                    borderRadius: "28px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: isMobile ? "20px" : "0"
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0 30px 80px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.8)";
                    }
                  }}
                >
                  <div style={{
                    fontSize: isMobile ? "2.5rem" : "3rem",
                    marginBottom: "20px",
                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))"
                  }}>
                    {item.icon}
                  </div>
                  <h3 className="title is-4" style={{ 
                    color: "#1a202c", 
                    fontWeight: "700",
                    marginBottom: "16px",
                    fontSize: isMobile ? "1.2rem" : "1.4rem"
                  }}>
                    {item.title}
                  </h3>
                  <p className="subtitle is-6" style={{ 
                    color: "#4a5568",
                    lineHeight: "1.7",
                    fontSize: isMobile ? "0.9rem" : "1rem"
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="section" style={{ 
        background: "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)",
        color: "white",
        padding: isMobile ? "40px 0 20px 0" : "60px 0 30px 0"
      }}>
        <div className="container">
          <div className="columns is-multiline">
            <div className={`column ${isMobile ? 'is-12' : 'is-4'}`}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
                justifyContent: isMobile ? "center" : "flex-start"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden"
                }}>
                  <img 
                    src="/logo.png" 
                    alt="SmartVend Logo" 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover" 
                    }} 
                  />
                </div>
                <div>
                  <h3 style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    color: "white",
                    margin: 0
                  }}>
                    SmartVend
                  </h3>
                  <p style={{
                    fontSize: "12px",
                    color: "#a0aec0",
                    margin: 0
                  }}>
                    Solusi Vending Generasi Baru
                  </p>
                </div>
              </div>

              <p style={{
                color: "#a0aec0",
                lineHeight: "1.6",
                marginBottom: "20px",
                textAlign: isMobile ? "center" : "left"
              }}>
                Merevolusi pengalaman vending dengan teknologi pintar dan produk premium.
              </p>
            </div>
            
            <div className={`column ${isMobile ? 'is-6' : 'is-2'}`}>
              <h4 style={{
                color: "white",
                fontWeight: "700",
                marginBottom: "20px",
                fontSize: "16px",
                textAlign: isMobile ? "center" : "left"
              }}>Perusahaan</h4>
              <ul style={{ 
                listStyle: "none", 
                padding: 0,
                textAlign: isMobile ? "center" : "left"
              }}>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "#a0aec0", textDecoration: "none" }}>Tentang</a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "#a0aec0", textDecoration: "none" }}>Karir</a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "#a0aec0", textDecoration: "none" }}>Kontak</a>
                </li>
              </ul>
            </div>
            
            <div className={`column ${isMobile ? 'is-6' : 'is-2'}`}>
              <h4 style={{
                color: "white",
                fontWeight: "700",
                marginBottom: "20px",
                fontSize: "16px",
                textAlign: isMobile ? "center" : "left"
              }}>Dukungan</h4>
              <ul style={{ 
                listStyle: "none", 
                padding: 0,
                textAlign: isMobile ? "center" : "left"
              }}>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "#a0aec0", textDecoration: "none" }}>Pusat Bantuan</a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "#a0aec0", textDecoration: "none" }}>Kebijakan Privasi</a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "#a0aec0", textDecoration: "none" }}>Ketentuan Layanan</a>
                </li>
              </ul>
            </div>
            
            <div className={`column ${isMobile ? 'is-12' : 'is-4'}`}>
              <h4 style={{
                color: "white",
                fontWeight: "700",
                marginBottom: "20px",
                fontSize: "16px",
                textAlign: isMobile ? "center" : "left"
              }}>Newsletter</h4>
              <p style={{
                color: "#a0aec0",
                marginBottom: "20px",
                textAlign: isMobile ? "center" : "left"
              }}>
                Dapatkan update terbaru tentang produk dan fitur kami.
              </p>
              <div style={{
                display: "flex",
                gap: "10px",
                flexDirection: isMobile ? "column" : "row"
              }}>
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #4a5568",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "14px"
                  }}
                />
                <button
                  style={{
                    padding: "12px 20px",
                    background: "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  Berlangganan
                </button>
              </div>
            </div>
          </div>
          
          <div style={{
            borderTop: "1px solid #4a5568",
            marginTop: "40px",
            paddingTop: "30px",
            textAlign: "center"
          }}>
            <p style={{ 
              color: "#a0aec0",
              fontSize: "14px"
            }}>
              © {new Date().getFullYear()} SmartVend. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VendingPublic;
