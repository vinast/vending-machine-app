import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VendingPublic from './components/VendingPublic';
import ProductSelection from './components/ProductSelection';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Navbar from './components/Navbar';

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
