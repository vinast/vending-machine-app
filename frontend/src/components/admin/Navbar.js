import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate();

        const Logout = async() => {
            try {
                await axios.delete('http://localhost:5000/logout');
                navigate("/"); // ✅ bukan navigate.push("/")
            } catch (error) {
                console.log(error);   
            }
        }


  return (
    <nav style={{
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(0,0,0,0.05)",
      padding: "20px 0",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
    }}>
      <div className="container">
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
           <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
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
              </div>
            </div>
            <Link 
              to="/admin"
              style={{
                textDecoration: "none",
                color: "inherit"
              }}
            >
              <div>
                <h1 style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "#1a202c",
                  margin: 0,
                  background: "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  SmartVend
                </h1>
                <p style={{
                  fontSize: "12px",
                  color: "#4a5568",
                  margin: 0,
                  fontWeight: "500"
                }}>
                  Admin Panel
                </p>
              </div>
            </Link>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "32px"
          }}>
            <div style={{
              display: "flex",
              gap: "32px",
              alignItems: "center"
            }}>
              <Link 
                to="/admin"
                style={{
                  color: "#4a5568",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "16px",
                  transition: "color 0.3s ease",
                  padding: "8px 16px",
                  borderRadius: "12px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(49,130,206,0.1)";
                  e.target.style.color = "#3182ce";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#4a5568";
                }}
              >
                🏠 Dashboard
              </Link>
              <Link 
                to="/admin/history"
                style={{
                  color: "#4a5568",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "16px",
                  transition: "color 0.3s ease",
                  padding: "8px 16px",
                  borderRadius: "12px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(49,130,206,0.1)";
                  e.target.style.color = "#3182ce";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#4a5568";
                }}
              >
                📊 History
              </Link>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center"
            }}>
              <button 
                onClick={Logout} 
                style={{
                  background: "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  padding: "12px 24px",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 16px rgba(229,62,62,0.3)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 24px rgba(229,62,62,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 16px rgba(229,62,62,0.3)";
                }}
              >
                🚪 Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar
