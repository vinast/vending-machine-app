import express from "express";
import db from "./config/Database.js";
// import Users from "./models/UserModel.js";
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

try {
    await db.authenticate();
    console.log('Database Connected...');
    await Product.sync();
    await Transaction.sync();
} catch (error) {
    console.error(error);
}

// Create uploads directory if it doesn't exist
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser())
app.use(express.json())
app.use('/uploads', express.static(join(__dirname, 'uploads')));
app.use(router)

app.listen(5000, ()=> console.log('Server Runnung at Port 5000'))

// Seed 5 default products if table is empty
const seedProductsIfEmpty = async () => {
    const count = await Product.count();
    if (count > 0) return;
    await Product.bulkCreate([
        { name: 'Air Mineral', imageUrl: 'https://i.imgur.com/I7sZ8vN.png', price: 2000, stock: 10 },
        { name: 'Teh Botol', imageUrl: 'https://i.imgur.com/6Q2T8uK.png', price: 5000, stock: 8 },
        { name: 'Kopi Kaleng', imageUrl: 'https://i.imgur.com/6zGm1cw.png', price: 10000, stock: 6 },
        { name: 'Keripik', imageUrl: 'https://i.imgur.com/1nF7h7q.png', price: 20000, stock: 5 },
        { name: 'Cokelat', imageUrl: 'https://i.imgur.com/Nv3C0z0.png', price: 50000, stock: 4 }
    ]);
    console.log('Seeded default products');
};

seedProductsIfEmpty().catch(console.error);

