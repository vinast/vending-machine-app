import express from "express";
import db from "./config/Database.js";
import cors from "cors";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import Product from "./models/ProductModel.js";
import Transaction from "./models/TransactionModel.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ========================================
// DATABASE CONNECTION & SYNC
// ========================================
const initializeDatabase = async () => {
  try {
    // 1. Test koneksi database
    await db.authenticate();
    console.log('✅ Database Connected...');
    
    // 2. Sync semua models ke database
    // Ini akan membuat tabel otomatis jika belum ada
    await db.sync({ 
      force: false,  // false = tidak hapus data lama
      alter: false   // false = tidak ubah struktur yang ada
    });
    console.log('✅ Database Models synced successfully!');
    
    // 3. Sync individual models (optional, untuk memastikan)
    await Product.sync();
    await Transaction.sync();
    console.log('✅ Individual models synced!');
    
  } catch (error) {
    console.error('❌ Database Error:', error);
    process.exit(1); // Stop server jika database error
  }
};

// ========================================
// SEED DATA (Optional)
// ========================================
const seedProductsIfEmpty = async () => {
  try {
    const count = await Product.count();
    if (count > 0) {
      console.log('📦 Products already exist, skipping seed...');
      return;
    }
    
    // Seed default products jika tabel kosong
    await Product.bulkCreate([
      { 
        name: 'Air Mineral', 
        imageUrl: 'https://i.imgur.com/I7sZ8vN.png', 
        price: 2000, 
        stock: 10 
      },
      { 
        name: 'Teh Botol', 
        imageUrl: 'https://i.imgur.com/6Q2T8vN.png', 
        price: 5000, 
        stock: 8 
      },
      { 
        name: 'Kopi Kaleng', 
        imageUrl: 'https://i.imgur.com/6zGm1cw.png', 
        price: 10000, 
        stock: 6 
      },
      { 
        name: 'Keripik', 
        imageUrl: 'https://i.imgur.com/1nF7h7q.png', 
        price: 20000, 
        stock: 5 
      },
      { 
        name: 'Cokelat', 
        imageUrl: 'https://i.imgur.com/Nv3C0z0.png', 
        price: 50000, 
        stock: 4 
      }
    ]);
    console.log('🌱 Seeded 5 default products successfully!');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
};

// ========================================
// SERVER INITIALIZATION
// ========================================
const startServer = async () => {
  try {
    // 1. Initialize database first
    await initializeDatabase();
    
    // 2. Seed data if needed
    await seedProductsIfEmpty();
    
    // 3. Create uploads directory
    const uploadsDir = join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('📁 Uploads directory created!');
    }
    
    // 4. Start server
    app.listen(5000, () => {
      console.log('🚀 Server running at Port 5000');
      console.log('📊 Database: Connected & Synced');
      console.log('🌐 API: http://localhost:5000');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// ========================================
// MIDDLEWARE SETUP
// ========================================
app.use(cors({ 
  credentials: true, 
  origin: 'http://localhost:3000' 
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));
app.use(router);

// ========================================
// START SERVER
// ========================================
startServer();

