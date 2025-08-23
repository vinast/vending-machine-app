# 🚀 Vending Machine App

Aplikasi vending machine interaktif yang mensimulasikan mesin penjual otomatis dengan fitur lengkap untuk user dan admin panel.

## 🎯 Deskripsi Aplikasi

Aplikasi ini adalah simulasi mesin vending machine yang memungkinkan pengguna untuk:
- 🛒 **Memilih produk** dari berbagai makanan dan minuman
- 💰 **Memasukkan uang** dengan berbagai pecahan
- 🛍️ **Melakukan pembelian** dengan validasi real-time
- 📊 **Melihat riwayat transaksi** 
- ⚙️ **Mengelola produk** melalui admin panel

## ✨ Fitur Utama

### 🛒 **User Interface**
- **Tampilan Mesin Vending**: Interface yang menarik dan user-friendly
- **Katalog Produk**: Menampilkan gambar, nama, harga, dan stok produk
- **Simulasi Uang Masuk**: Support pecahan Rp2.000, Rp5.000, Rp10.000, Rp20.000, Rp50.000
- **Real-time Total**: Update otomatis total uang yang dimasukkan
- **Validasi Pembelian**: Cek stok dan kecukupan uang secara real-time
- **Uang Kembalian**: Kalkulasi otomatis kembalian setelah pembelian

### ⚙️ **Admin Panel**
- **Dashboard**: Overview produk dan transaksi
- **CRUD Produk**: Tambah, edit, hapus, dan lihat produk
- **Upload Gambar**: Support upload gambar produk
- **Manajemen Stok**: Update stok produk secara real-time
- **Riwayat Transaksi**: Lihat semua transaksi yang dilakukan

### 📊 **Sistem Transaksi**
- **History Transaksi**: Simpan setiap pembelian ke database
- **Validasi Real-time**: Cek stok dan uang sebelum pembelian
- **Auto Update**: Stok dan data terupdate otomatis
- **Error Handling**: Pesan error yang informatif

## 🛠️ Teknologi yang Digunakan

### **Frontend**
- **React.js** - Library JavaScript untuk UI
- **React Router DOM** - Routing dan navigasi
- **Axios** - HTTP client untuk API calls
- **JWT Decode** - Handling authentication tokens

### **Styling & UI**
- **Inline CSS** - Custom styling dengan modern design
- **CSS Gradients** - Background dan button styling
- **Responsive Design** - Mobile-friendly interface
- **Modern UI/UX** - Card design, shadows, dan animations

### **Backend & Database**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database management
- **Multer** - File upload handling
- **JWT** - Authentication system

### **Development Tools**
- **JSON Server** - Mock API untuk development
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Auto-restart development server

## 🚀 Cara Instalasi & Menjalankan

### **1. Clone Repository**
```bash
git clone https://github.com/username/vending-machine-app.git
cd vending-machine-app
```

### **2. Install Dependencies**

#### **Backend**
```bash
cd backend
npm install
```

#### **Frontend**
```bash
cd frontend
npm install
```

### **3. Setup Database**

#### **MySQL Setup**
1. Install MySQL di komputer Anda
2. Buat database baru:
```sql
CREATE DATABASE vending_machine;
USE vending_machine;
```

#### **Database Configuration**
Update file `backend/config/Database.js`:
```javascript
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'vending_machine'
});
```

### **4. Setup JSON Server (Development)**

#### **Install JSON Server**
```bash
npm install -g json-server
```

#### **Buat file db.json**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Coca Cola",
      "price": 5000,
      "stock": 10,
      "imageUrl": "/uploads/coca-cola.jpg"
    }
  ],
  "transactions": [
    {
      "id": 1,
      "productId": 1,
      "productName": "Coca Cola",
      "quantity": 1,
      "totalPrice": 5000,
      "paidAmount": 10000,
      "changeAmount": 5000,
      "createdAt": "2025-01-20T10:00:00.000Z"
    }
  ],
  "users": [
    {
      "id": 1,
      "name": "Admin",
      "email": "admin@vending.com",
      "password": "hashed_password"
    }
  ]
}
```

#### **Jalankan JSON Server**
```bash
json-server --watch db.json --port 5000
```

**Routes yang tersedia:**
- `GET /products` - Ambil semua produk
- `POST /products` - Tambah produk baru
- `PUT /products/:id` - Update produk
- `DELETE /products/:id` - Hapus produk
- `GET /transactions` - Ambil semua transaksi
- `POST /transactions` - Tambah transaksi baru
- `DELETE /transactions/:id` - Hapus transaksi
- `GET /users` - Ambil semua user
- `POST /users` - Register user baru
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /token` - Refresh token

### **5. Menjalankan Aplikasi**

#### **Backend Server**
```bash
cd backend
npm start
```
Server akan berjalan di `http://localhost:5000`

#### **Frontend Development**
```bash
cd frontend
npm start
```
Aplikasi akan berjalan di `http://localhost:3000`

## 📱 Fitur Responsif & Mobile Friendly

- **Responsive Layout**: Adaptif untuk semua ukuran layar
- **Touch Friendly**: Button dan interface yang mudah digunakan di mobile
- **Mobile Navigation**: Menu yang mudah diakses di perangkat mobile
- **Optimized Images**: Gambar yang dioptimasi untuk berbagai device

## 🔐 Sistem Autentikasi

- **JWT Token**: Secure authentication system
- **Auto Refresh**: Token refresh otomatis saat expired
- **Protected Routes**: Admin panel yang aman
- **Session Management**: Manajemen session yang robust

## 📊 Struktur Database

### **Tabel Products**
```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imageUrl VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Tabel Transactions**
```sql
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    productId INT NOT NULL,
    productName VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    totalPrice INT NOT NULL,
    paidAmount INT NOT NULL,
    changeAmount INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id)
);
```

### **Tabel Users**
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Screenshots

### **User Interface**
- **Home Page**: Tampilan utama dengan produk
- **Product Selection**: Halaman pilihan produk
- **Checkout**: Halaman pembayaran
- **Payment**: Interface input uang

### **Admin Panel**
- **Dashboard**: Overview admin
- **Product Management**: CRUD produk
- **Transaction History**: Riwayat transaksi
- **User Management**: Manajemen user

## 🚧 Catatan Tambahan

### **Development Notes**
- Aplikasi menggunakan React.js dengan modern JavaScript (ES6+)
- Styling menggunakan inline CSS untuk custom design
- State management menggunakan React Hooks
- API calls menggunakan Axios dengan interceptors
- File upload support untuk gambar produk

### **Security Features**
- JWT token authentication
- Password hashing
- Protected admin routes
- Input validation
- SQL injection prevention

### **Performance Optimizations**
- Lazy loading untuk gambar
- Optimized API calls
- Efficient state management
- Responsive image handling

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Kontak

- **Email**: your.email@example.com
- **GitHub**: [@username](https://github.com/username)
- **LinkedIn**: [Your Name](https://linkedin.com/in/yourprofile)

---

⭐ **Star repository ini jika bermanfaat!**
