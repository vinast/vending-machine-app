import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VendingPublic from './components/user/VendingPublic';
import ProductSelection from './components/user/ProductSelection';
import Checkout from './components/user/Checkout';
import Login from './components/admin/Login';
import Register from './components/admin/Register';
import Dashboard from './components/admin/Dashboard';
import History from './components/admin/History';
import Navbar from './components/admin/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<VendingPublic />} />
          <Route path="/products" element={<ProductSelection />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />
          <Route path="/admin" element={
            <>
              <Navbar />
              <Dashboard />
            </>
          } />
          <Route path="/admin/history" element={
            <>
              <Navbar />
              <History />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;