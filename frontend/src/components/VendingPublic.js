import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const VendingPublic = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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
      {/* Hero Carousel */}
      <section className="hero is-fullheight" style={{ position: "relative" }}>
        <Slider {...settings}>
          {[
            {
              img: "https://images.unsplash.com/photo-1635260549221-2ff8f61f9f55?q=80&w=1600",
              title: "Vending Machine Modern",
              subtitle: "Belanja mudah kapanpun dan dimanapun",
            },
            {
              img: "https://images.unsplash.com/photo-1645969928029-75f2aa82accf?q=80&w=1600",
              title: "Snack & Minuman Favorit",
              subtitle: "Nikmati produk terbaik dengan harga terjangkau",
            },
            {
              img: "https://images.unsplash.com/photo-1607082349566-1873428f2a3e?q=80&w=1600",
              title: "Pembayaran Mudah",
              subtitle: "Proses transaksi cepat & praktis",
            },
          ].map((slide, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={slide.img}
                alt={slide.title}
                style={{
                  width: "100%",
                  height: "80vh",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
              {/* Enhanced Overlay with neutral colors */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "80vh",
                  background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(20px)",
                    padding: "40px",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    color: "#1a202c",
                  }}
                >
                  <h1
                    className="title is-1"
                    style={{ 
                      color: "#1a202c",
                      fontWeight: "700",
                      marginBottom: "16px"
                    }}
                  >
                    {slide.title}
                  </h1>
                  <p className="subtitle is-4 mb-4" style={{ 
                    color: "#4a5568",
                    fontWeight: "400"
                  }}>
                    {slide.subtitle}
                  </p>
                  <button
                    className="button is-medium"
                    style={{ 
                      borderRadius: "25px", 
                      padding: "16px 32px",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                      border: "none",
                      background: "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)",
                      color: "white"
                    }}
                    onClick={goToProductSelection}
                  >
                    🛒 Mulai Belanja
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Produk Preview with Glass Effect */}
      <section className="section" style={{ padding: "60px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 className="title is-2" style={{ 
              color: "#1a202c", 
              fontWeight: "700"
            }}>
              ✨ Produk Unggulan
            </h2>
            <p className="subtitle is-5" style={{ 
              color: "#4a5568"
            }}>
              Pilihan terbaik untuk kebutuhan Anda
            </p>
          </div>
          
          <div className="columns is-multiline">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="column is-4">
                <div
                  className="box has-text-centered"
                  style={{
                    borderRadius: "20px",
                    backdropFilter: "blur(20px)",
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    cursor: "pointer",
                    padding: "30px 20px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-12px) scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
                    e.currentTarget.style.background = "rgba(255,255,255,1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.9)";
                  }}
                >
                  {/* Glass effect overlay */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(135deg, rgba(49,130,206,0.05) 0%, rgba(43,108,176,0.05) 100%)",
                    borderRadius: "20px",
                    pointerEvents: "none"
                  }} />
                  
                  <figure
                    className="image is-128x128 mx-auto mb-4"
                    style={{ 
                      overflow: "hidden", 
                      borderRadius: "16px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      position: "relative",
                      zIndex: 1
                    }}
                  >
                    <img
                      src={
                        product.imageUrl
                          ? `http://localhost:5000${product.imageUrl}`
                          : "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=128&h=128&fit=crop"
                      }
                      alt={product.name}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </figure>
                  
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <h3 className="title is-5" style={{ 
                      color: "#1a202c", 
                      fontWeight: "600"
                    }}>
                      {product.name}
                    </h3>
                    <p className="title is-4" style={{ 
                      color: "#3182ce",
                      fontWeight: "700"
                    }}>
                      Rp{product.price.toLocaleString()}
                    </p>
                    <p className="subtitle is-6" style={{ 
                      color: "#4a5568"
                    }}>
                      📦 Stok: {product.stock}
                    </p>
                    
                    <button
                      className="button is-small"
                      style={{
                        borderRadius: "20px",
                        marginTop: "10px",
                        background: "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(49,130,206,0.3)",
                        color: "white"
                      }}
                    >
                      Beli Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="has-text-centered mt-5">
            <button
              className="button is-outlined is-medium"
              style={{ 
                borderRadius: "25px", 
                padding: "12px 32px",
                fontSize: "1.1rem",
                fontWeight: "600",
                border: "2px solid #3182ce",
                color: "#3182ce",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)"
              }}
              onClick={goToProductSelection}
            >
              🔍 Lihat Semua Produk
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Info Section */}
      <section
        className="section"
        style={{ 
          background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(0,0,0,0.05)",
          padding: "80px 0"
        }}
      >
        <div className="container has-text-centered">
          <h2 className="title is-2 mb-5" style={{ 
            color: "#1a202c", 
            fontWeight: "700"
          }}>
            🚀 Kenapa Pilih Mesin Kami?
          </h2>
          <p className="subtitle is-5 mb-6" style={{ 
            color: "#4a5568"
          }}>
            Nikmati pengalaman berbelanja yang berbeda dengan teknologi terkini
          </p>
          
          <div className="columns is-multiline">
            {[
              {
                icon: "🕐",
                title: "24/7 Tersedia",
                desc: "Bisa digunakan kapanpun tanpa batasan waktu. Mesin kami selalu siap melayani kebutuhan Anda.",
                color: "#3182ce"
              },
              {
                icon: "📱",
                title: "Pembayaran Digital",
                desc: "Dilengkapi dengan berbagai metode pembayaran digital yang aman dan mudah digunakan.",
                color: "#2b6cb0"
              },
              {
                icon: "⚡",
                title: "Transaksi Cepat",
                desc: "Proses transaksi instan tanpa antrian. Dapatkan produk favorit Anda dalam hitungan detik.",
                color: "#1a202c"
              },
            ].map((item, i) => (
              <div key={i} className="column is-4">
                <div
                  style={{
                    backdropFilter: "blur(20px)",
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    padding: "40px 30px",
                    borderRadius: "24px",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)";
                  }}
                >
                  {/* Glass overlay */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${item.color}10 0%, ${item.color}05 100%)`,
                    borderRadius: "24px",
                    pointerEvents: "none"
                  }} />
                  
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{
                      fontSize: "3rem",
                      marginBottom: "20px",
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))"
                    }}>
                      {item.icon}
                    </div>
                    <h3 className="title is-4" style={{ 
                      color: "#1a202c", 
                      fontWeight: "600",
                      marginBottom: "16px"
                    }}>
                      {item.title}
                    </h3>
                    <p className="subtitle is-6" style={{ 
                      color: "#4a5568",
                      lineHeight: "1.6"
                    }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="section" style={{ 
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)",
        padding: "40px 0",
        borderTop: "1px solid rgba(0,0,0,0.05)"
      }}>
        <div className="container has-text-centered">
          <p style={{ 
            color: "#4a5568",
            fontSize: "1.1rem"
          }}>
            © 2024 Vending Machine Modern. Dibuat dengan ❤️ untuk kenyamanan Anda.
          </p>
        </div>
      </section>
    </div>
  );
};

export default VendingPublic;
