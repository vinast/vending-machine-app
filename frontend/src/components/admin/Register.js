import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/users", {
        name: name,
        email: email,
        password: password,
        confPassword: confPassword,
      });
      navigate("/"); // redirect ke login
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh" }}>
      <div className="container" style={{ paddingTop: "80px" }}>
        <div className="columns is-centered">
          <div className="column is-4-desktop">
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(49,130,206,0.1)",
                padding: "12px 24px",
                borderRadius: "25px",
                marginBottom: "20px"
              }}>
                <span style={{ fontSize: "20px" }}>👤</span>
                <span style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#3182ce"
                }}>ADMIN REGISTER</span>
              </div>
              <p style={{ 
                color: "#4a5568",
                fontSize: "1.1rem",
                maxWidth: "400px",
                margin: "0 auto"
              }}>
                Buat akun admin baru untuk Vending Machine
              </p>
            </div>
            
            <div style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: "24px",
              padding: "40px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            }}>
              {msg && (
                <div style={{
                  background: "rgba(229,62,62,0.1)",
                  border: "1px solid rgba(229,62,62,0.3)",
                  borderRadius: "15px",
                  padding: "16px",
                  marginBottom: "24px",
                  textAlign: "center"
                }}>
                  <p style={{
                    color: "#e53e3e",
                    fontWeight: "600",
                    margin: 0,
                    fontSize: "0.95rem"
                  }}>
                    {msg}
                  </p>
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{
                    color: "#1a202c",
                    fontWeight: "600",
                    fontSize: "1rem",
                    marginBottom: "8px",
                    display: "block"
                  }}>Nama Lengkap</label>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      padding: "16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box"
                    }}
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3182ce";
                      e.target.style.boxShadow = "0 0 0 3px rgba(49,130,206,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{
                    color: "#1a202c",
                    fontWeight: "600",
                    fontSize: "1rem",
                    marginBottom: "8px",
                    display: "block"
                  }}>Email</label>
                  <input
                    type="email"
                    style={{
                      width: "100%",
                      padding: "16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box"
                    }}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3182ce";
                      e.target.style.boxShadow = "0 0 0 3px rgba(49,130,206,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{
                    color: "#1a202c",
                    fontWeight: "600",
                    fontSize: "1rem",
                    marginBottom: "8px",
                    display: "block"
                  }}>Password</label>
                  <input
                    type="password"
                    style={{
                      width: "100%",
                      padding: "16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box"
                    }}
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3182ce";
                      e.target.style.boxShadow = "0 0 0 3px rgba(49,130,206,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: "32px" }}>
                  <label style={{
                    color: "#1a202c",
                    fontWeight: "600",
                    fontSize: "1rem",
                    marginBottom: "8px",
                    display: "block"
                  }}>Konfirmasi Password</label>
                  <input
                    type="password"
                    style={{
                      width: "100%",
                      padding: "16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box"
                    }}
                    placeholder="******"
                    value={confPassword}
                    onChange={(e) => setConfPassword(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3182ce";
                      e.target.style.boxShadow = "0 0 0 3px rgba(49,130,206,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <button
                  type="submit"
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
                    boxShadow: "0 8px 24px rgba(56,161,105,0.3)",
                    width: "100%"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 32px rgba(56,161,105,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 8px 24px rgba(56,161,105,0.3)";
                  }}
                >
                  👤 Register
                </button>

                <div style={{ textAlign: "center", marginTop: "24px" }}>
                  <p style={{
                    color: "#4a5568",
                    margin: "0 0 16px 0"
                  }}>Sudah Mempunyai Akun?</p>
                  <a 
                    href="/admin/login"
                    style={{
                      color: "#3182ce",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "14px",
                      transition: "color 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#2b6cb0";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#3182ce";
                    }}
                  >
                    Login Sekarang →
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
