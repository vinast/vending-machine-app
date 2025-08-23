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
    <nav
      className="navbar is-light"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/admin">
            <span className="icon-text">
              <span className="icon">
                <i className="fas fa-cog"></i>
              </span>
              <span className="has-text-weight-bold">Vending Admin</span>
            </span>
          </Link>

          <button
            className="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-item" to="/admin">
              Admin
            </Link>
            <Link className="navbar-item" to="/admin/history">
              History
            </Link>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <button onClick={Logout} className="button is-light">Log Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar
