import express from "express";
import { getUsers, Login, Logout, Register } from "../controllers/Users.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { listProducts, createProduct, updateProduct, deleteProduct, purchase, listTransactions, deleteTransaction } from "../controllers/Products.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import multer from "multer";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Public routes
router.get('/test', (req, res) => {
    res.json({ msg: "Server is running!" });
});
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/products', listProducts);
router.post('/purchase', purchase);

// Protected routes (require authentication)
router.get('/users', verifyToken, getUsers);
router.delete('/transactions/:id', verifyToken, deleteTransaction);
router.get('/transactions', verifyToken, listTransactions);
router.post('/products', verifyToken, upload.single('image'), createProduct);
router.put('/products/:id', verifyToken, upload.single('image'), updateProduct);
router.delete('/products/:id', verifyToken, deleteProduct);

export default router;