# 🚀 Aplikasi Vending Machine - Frontend Developer Test

Aplikasi vending machine interaktif yang mensimulasikan mesin penjual otomatis dengan fitur lengkap untuk user dan admin panel.

## 🎯 Deskripsi Umum

Aplikasi vending machine menggunakan ReactJS yang dapat mensimulasikan mesin penjual otomatis. Aplikasi ini dinamis, interaktif, serta mampu menyimpan dan memproses data dari API menggunakan MySQL database dengan Sequelize ORM.

## 📦 Fitur yang Sudah Diimplementasi

### • Tampilan Mesin Vending
- Menampilkan produk makanan dan minuman
- Tiap item menampilkan: Gambar produk, Nama, Harga, Jumlah stok
- Interface yang menarik dan responsif dengan carousel

### • Simulasi Uang Masuk
- Pengguna bisa memasukkan uang dengan pecahan: Rp2.000, Rp5.000, Rp10.000, Rp20.000, Rp50.000
- Total uang yang dimasukkan ditampilkan secara real-time
- Tombol untuk mengembalikan uang

### • Pembelian Produk
- Klik tombol "Beli" untuk produk yang tersedia
- Validasi jika uang tidak cukup atau stok habis
- Setelah pembelian, kurangi stok dan tampilkan uang kembalian
- Simpan transaksi ke database

### • Admin Panel Lengkap
- Route `/admin` untuk dashboard admin
- Route `/admin/login` dan `/admin/register` untuk autentikasi
- Route `/admin/history` untuk melihat riwayat transaksi
- Fitur CRUD produk: tambah, ubah, hapus makanan
- Upload gambar produk dengan preview

### • History Transaksi
- Setiap pembelian disimpan ke MySQL database
- Tampilkan riwayat pembelian di halaman `/admin/history`
- Fitur hapus transaksi untuk admin

## ⚙️ Teknologi & Tools

### Frontend
- **React JS 19.1.1** - Library JavaScript untuk UI
- **React Router DOM 7.8.1** - Routing dan navigasi
- **Axios 1.11.0** - HTTP client untuk API calls
- **JWT Decode 4.0.0** - Handling authentication tokens

### UI Components & Styling
- **Bulma CSS 1.0.4** - CSS framework untuk styling komponen
- **React Slick 0.31.0** - Carousel component untuk gambar produk
- **Inline CSS** - Custom styling dengan modern design
- **Responsive Design** - Mobile-friendly interface
- **Modern UI/UX** - Card design, shadows, dan animations

### Backend & Database
- **Node.js** - Runtime environment
- **Express.js 5.1.0** - Web framework
- **MySQL** - Database management
- **Sequelize ORM 6.37.7** - Object-Relational Mapping
- **Multer 1.4.5** - File upload handling
- **JWT** - Authentication system
- **bcrypt 6.0.0** - Password hashing
- **CORS** - Cross-origin resource sharing

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
CREATE DATABASE your_database;
USE your_database;
```

#### **Database Configuration**
Update file `backend/config/Database.js`:
```javascript
import { Sequelize } from "sequelize";

const db = new Sequelize('your_database', 'your_username', 'your_password', {
    host: "localhost",
    dialect: "mysql"
});

export default db;
```

### **4. Setup Environment Variables**
Buat file `.env` di folder `backend`:
```env
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
```

### **5. Menjalankan Aplikasi**

#### **Backend Server**
```bash
cd backend
npm start
```
Server akan berjalan di `http://localhost:5000`

**Note**: Aplikasi akan otomatis:
- Connect ke database MySQL
- Create tabel products, transactions, dan users
- Seed produk default jika tabel kosong

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
- **Password Hashing**: Password dienkripsi dengan bcrypt

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

## 🔧 API Endpoints

### **Public Endpoints**
- `GET /products` - Daftar produk
- `POST /purchase` - Pembelian produk
- `POST /users` - Register admin
- `POST /login` - Login admin
- `GET /token` - Refresh token
- `DELETE /logout` - Logout

### **Admin Endpoints (Protected)**
- `GET /users` - Daftar user
- `GET /transactions` - Riwayat transaksi
- `DELETE /transactions/:id` - Hapus transaksi
- `POST /products` - Tambah produk
- `PUT /products/:id` - Update produk
- `DELETE /products/:id` - Hapus produk

## 📁 Struktur Project

```
vending-machine-app/
├── backend/
│   ├── config/
│   │   └── Database.js
│   ├── controllers/
│   │   ├── Users.js
│   │   ├── Products.js
│   │   └── RefreshToken.js
│   ├── middleware/
│   │   └── VerifyToken.js
│   ├── models/
│   │   ├── UserModel.js
│   │   ├── ProductModel.js
│   │   └── TransactionModel.js
│   ├── routes/
│   │   └── index.js
│   ├── uploads/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── user/
│   │   │   │   ├── VendingPublic.js
│   │   │   │   ├── ProductSelection.js
│   │   │   │   └── Checkout.js
│   │   │   └── admin/
│   │   │       ├── Dashboard.js
│   │   │       ├── History.js
│   │   │       ├── Login.js
│   │   │       ├── Register.js
│   │   │       └── Navbar.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## 🎨 Screenshots Aplikasi

### **User Interface**
<!-- Tambahkan screenshot di sini -->
- **Halaman Utama (VendingPublic)**: Tampilan utama dengan produk vending machine dan carousel
- **Pemilihan Produk (ProductSelection)**: Halaman pilihan produk dengan detail
- **Checkout**: Halaman pembayaran dan input uang

### **Admin Panel**
<!-- Tambahkan screenshot di sini -->
- **Dashboard**: Overview admin dengan statistik produk
- **Manajemen Produk**: CRUD produk dengan upload gambar
- **Riwayat Transaksi**: Daftar semua transaksi yang telah dilakukan
- **Login & Register**: Halaman autentikasi admin

### **Mobile View**
<!-- Tambahkan screenshot di sini -->
- **Responsive Design**: Tampilan mobile yang optimal
- **Touch Interface**: Interface yang mudah digunakan di perangkat mobile

## 🚧 Catatan Development

### **Fitur yang Sudah Diimplementasi**
- ✅ **React.js dengan modern JavaScript (ES6+)**
- ✅ **Styling menggunakan Bulma CSS + Inline CSS**
- ✅ **Carousel dengan React Slick**
- ✅ **State management menggunakan React Hooks**
- ✅ **API calls menggunakan Axios dengan interceptors**
- ✅ **File upload support untuk gambar produk**
- ✅ **Database menggunakan MySQL dengan Sequelize ORM**
- ✅ **JWT token authentication dengan bcrypt**
- ✅ **Protected admin routes**
- ✅ **Auto-seed produk default**
- ✅ **Riwayat transaksi lengkap**
- ✅ **CRUD produk dengan upload gambar**
- ✅ **Responsive design untuk mobile**

### **Security Features**
- JWT token authentication
- Password hashing dengan bcrypt
- Protected admin routes
- SQL injection prevention dengan Sequelize
- File upload validation (hanya gambar)

### **Performance Optimizations**
- Lazy loading untuk gambar
- Optimized API calls
- Efficient state management
- Responsive image handling
- Auto-seed produk default

### **Auto-Seed Products**
Aplikasi otomatis akan membuat produk default saat pertama kali dijalankan dengan fitur upload gambar.

## 🌟 Fitur Unggulan

- **Interface Modern**: Design yang menarik dan user-friendly
- <img width="1918" height="1079" alt="image" src="https://github.com/user-attachments/assets/83fdeede-5c68-492f-a064-06b29838827a" />
- **Carousel Produk**: Tampilan produk yang menarik dengan React Slick
- <img width="1913" height="1078" alt="image" src="https://github.com/user-attachments/assets/5355f0d9-8f67-4439-89bc-b71f09202ecb" />
- **Pilih Produk**: Fitur pilih produk
- <img width="1917" height="1079" alt="image" src="https://github.com/user-attachments/assets/11a93bab-3d73-4f03-b9ba-ee9357c7c51d" />
- **fitur Pembayaran**: fitur pembayaran produk
- <img width="1915" height="1079" alt="image" src="https://github.com/user-attachments/assets/b1afa632-c5da-4c65-a05b-7e8d4a821a00" />
- <img width="1915" height="1079" alt="image" src="https://github.com/user-attachments/assets/3d731619-2588-4365-a2db-5b1d96641216" />
- **Histori Pembelian produk**: Histori Pembelian produk
- <img width="1915" height="1079" alt="image" src="https://github.com/user-attachments/assets/e66bfee1-0264-4046-b06a-73acd22b2a72" />
- **Admin Panel Lengkap**: CRUD ADMIN
- <img width="1876" height="1068" alt="image" src="https://github.com/user-attachments/assets/c37125f7-0b7e-4f02-99fa-248966049954" />



