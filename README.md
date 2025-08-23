# 🛒 Vending Machine App

Aplikasi vending machine interaktif yang dibangun dengan React JS dan Node.js, dilengkapi dengan fitur pembelian publik dan panel admin untuk manajemen produk.

## ✨ Fitur Utama

### 🏪 Tampilan Mesin Vending
- Menampilkan 5 produk makanan/minuman dengan gambar, nama, harga, dan stok
- Interface yang modern dan responsif dengan Bulma CSS
- Layout yang rapi dan mudah digunakan
- Komponen yang konsisten dan profesional

### 💰 Simulasi Uang Masuk
- Pengguna dapat memasukkan uang dengan pecahan: Rp2.000, Rp5.000, Rp10.000, Rp20.000, Rp50.000
- Total uang yang dimasukkan ditampilkan secara real-time
- Tombol untuk mengembalikan uang
- Validasi otomatis untuk pembelian

### 🛍️ Pembelian Produk
- Tombol "Beli" untuk produk yang tersedia
- Validasi uang tidak cukup atau stok habis
- Setelah pembelian, stok berkurang dan uang kembalian ditampilkan
- Riwayat transaksi tersimpan otomatis

### 👨‍💼 Admin Panel
- Route `/admin` untuk mengatur produk (CRUD)
- Fitur upload gambar produk
- Manajemen stok dan harga
- Dashboard yang informatif dengan modal form

### 📊 History Transaksi
- Setiap pembelian disimpan ke database
- Tampilkan riwayat pembelian di halaman `/admin/history`
- Data transaksi lengkap dengan timestamp

## 🛠️ Teknologi & Tools

### Frontend
- **React JS** - Library JavaScript untuk UI
- **Bulma CSS** - Framework CSS modern dan responsif
- **Axios** - HTTP client untuk API calls
- **React Router** - Routing untuk SPA

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Database relasional
- **Sequelize** - ORM untuk database
- **Multer** - Middleware untuk upload file
- **JWT** - Autentikasi dan otorisasi

### Form Handling
- **react-hook-form** - Manajemen form yang efisien
- **Yup** - Validasi schema

## 🚀 Cara Instalasi & Menjalankan

### Prerequisites
- Node.js (versi 16 atau lebih baru)
- MySQL (versi 8.0 atau lebih baru)
- npm atau yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd vending-machine-app
```

### 2. Setup Backend
```bash
cd backend
npm install
```

### 3. Konfigurasi Database
- Buat database MySQL baru dengan nama `students`
- Update file `backend/config/Database.js` sesuai konfigurasi database Anda:
```javascript
const db = new Sequelize('students', 'username', 'password', {
    host: "localhost",
    dialect: "mysql"
})
```

### 4. Setup Environment Variables
Buat file `.env` di folder `backend`:
```env
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
```

### 5. Jalankan Backend
```bash
cd backend
node index.js
```
Server akan berjalan di `http://localhost:5000`

### 6. Setup Frontend
```bash
cd frontend
npm install
```

### 7. Jalankan Frontend
```bash
npm start
```
Aplikasi akan berjalan di `http://localhost:3000`

## 📱 Cara Penggunaan

### Untuk User Publik
1. Buka `http://localhost:3000`
2. Pilih produk yang ingin dibeli
3. Masukkan uang sesuai pecahan yang tersedia
4. Pilih jumlah produk
5. Klik "Beli (Rp{totalPrice})"
6. Ambil produk dan kembalian

### Untuk Admin
1. Buka `http://localhost:3000/admin/login`
2. Login dengan akun admin
3. Akses panel admin di `/admin`
4. Kelola produk (tambah, edit, hapus)
5. Lihat riwayat transaksi di `/admin/history`

## 🗄️ Struktur Database

### Tabel Users
- `id` - Primary key
- `name` - Nama user
- `email` - Email user
- `password` - Password terenkripsi
- `refresh_token` - Token refresh untuk JWT

### Tabel Products
- `id` - Primary key
- `name` - Nama produk
- `imageUrl` - URL gambar produk
- `price` - Harga produk
- `stock` - Stok tersedia

### Tabel Transactions
- `id` - Primary key
- `productId` - ID produk yang dibeli
- `productName` - Nama produk
- `quantity` - Jumlah yang dibeli
- `paidAmount` - Jumlah uang yang dibayar
- `changeAmount` - Uang kembalian
- `totalPrice` - Total harga pembelian
- `createdAt` - Timestamp transaksi

## 🔧 API Endpoints

### Public Endpoints
- `GET /products` - Daftar produk
- `POST /purchase` - Pembelian produk

### Admin Endpoints (Protected)
- `GET /transactions` - Riwayat transaksi
- `POST /products` - Tambah produk
- `PUT /products/:id` - Update produk
- `DELETE /products/:id` - Hapus produk

### Auth Endpoints
- `POST /users` - Register admin
- `POST /login` - Login admin
- `GET /token` - Refresh token
- `DELETE /logout` - Logout

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
│   │   │   ├── VendingPublic.js
│   │   │   ├── Dashboard.js
│   │   │   ├── History.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Navbar.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## 🌟 Fitur Bonus

- **Responsive Design** - Kompatibel dengan mobile dan desktop
- **Image Upload** - Admin dapat upload gambar produk
- **Real-time Updates** - Stok dan data terupdate otomatis
- **Modern UI/UX** - Interface yang menarik dengan Bulma CSS
- **Form Validation** - Validasi input yang robust
- **Session Management** - Admin session dengan JWT
- **Modal Forms** - Form CRUD yang rapi dan mudah digunakan

## 📸 Screenshots

*Screenshots akan ditambahkan setelah aplikasi selesai*

## 📝 Catatan Tambahan

- Aplikasi menggunakan session admin 1 menit untuk keamanan
- Semua gambar produk disimpan lokal di folder `uploads`
- Database akan otomatis ter-seed dengan 5 produk default
- Frontend menggunakan Bulma CSS untuk styling yang modern dan konsisten
- Backend menggunakan MySQL dengan Sequelize ORM

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Project ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ menggunakan React JS dan Node.js**
