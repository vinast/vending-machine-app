import Product from "../models/ProductModel.js";
import Transaction from "../models/TransactionModel.js";
import { unlink } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const listProducts = async (req, res) => {
    try {
        const { limit } = req.query;
        const options = {};
        
        if (limit) {
            options.limit = parseInt(limit);
        }
        
        const products = await Product.findAll(options);
        console.log('Products fetched:', products.length);
        console.log('Products data:', products.map(p => ({ id: p.id, name: p.name, imageUrl: p.imageUrl })));
        res.json(products);
    } catch (error) {
        console.log('Error fetching products:', error);
        res.status(500).json({ msg: "Error fetching products" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;
        let imageUrl = null;
        
        if (req.file) {
            // Ensure the path is properly formatted
            imageUrl = '/uploads/' + req.file.filename;
            console.log('File uploaded:', req.file);
            console.log('Image URL set to:', imageUrl);
        }
        
        const product = await Product.create({
            name: name,
            imageUrl: imageUrl,
            price: price,
            stock: stock
        });
        
        console.log('Product created successfully:', product);
        res.status(201).json({ msg: "Product Created Successfully", product: product });
    } catch (error) {
        console.log('Error creating product:', error);
        res.status(500).json({ msg: "Error creating product: " + error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }
        
        let imageUrl = product.imageUrl; // Keep existing image by default
        
        if (req.file) {
            // Fix the path to be relative to the uploads directory
            imageUrl = '/uploads/' + req.file.filename;
            console.log('File uploaded for update:', req.file);
            console.log('New image URL set to:', imageUrl);
        }
        
        await Product.update({
            name: name,
            imageUrl: imageUrl,
            price: price,
            stock: stock
        }, {
            where: {
                id: req.params.id
            }
        });
        console.log('Product updated with imageUrl:', imageUrl);
        res.status(200).json({ msg: "Product Updated Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error updating product" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        console.log('Deleting product with ID:', req.params.id);
        
        // First, get the product to check if it exists and get image info
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            console.log('Product not found for deletion');
            return res.status(404).json({ msg: "Product not found" });
        }
        
        console.log('Product found:', product.name, 'Image:', product.imageUrl);
        
        // Delete the image file from the uploads directory
        if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
            const imagePath = join(__dirname, '..', product.imageUrl.substring(1));
            try {
                await unlink(imagePath);
                console.log('Image file deleted:', imagePath);
            } catch (unlinkError) {
                console.error('Error deleting image file:', unlinkError);
            }
        }

        await Product.destroy({
            where: {
                id: req.params.id
            }
        });
        
        console.log('Product deleted successfully');
        res.status(200).json({ msg: "Product Deleted Successfully" });
    } catch (error) {
        console.log('Error deleting product:', error);
        res.status(500).json({ msg: "Error deleting product" });
    }
};

export const purchase = async (req, res) => {
    try {
        const { productId, insertedAmount, quantity } = req.body;
        
        console.log('🔍 Purchase request received:', { productId, insertedAmount, quantity });
        
        // Validate input
        if (!productId || !insertedAmount || !quantity) {
            console.log('❌ Missing required fields:', { productId, insertedAmount, quantity });
            return res.status(400).json({ msg: "Missing required fields" });
        }
        
        if (quantity <= 0) {
            console.log('❌ Invalid quantity:', quantity);
            return res.status(400).json({ msg: "Quantity must be greater than 0" });
        }
        
        if (insertedAmount <= 0) {
            console.log('❌ Invalid inserted amount:', insertedAmount);
            return res.status(400).json({ msg: "Inserted amount must be greater than 0" });
        }
        
        // Find product
        const product = await Product.findByPk(productId);
        if (!product) {
            console.log('❌ Product not found with ID:', productId);
            return res.status(404).json({ msg: "Product not found" });
        }
        
        console.log('✅ Product found:', { 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            stock: product.stock 
        });
        
        // Check stock
        if (product.stock < quantity) {
            console.log('❌ Insufficient stock:', { requested: quantity, available: product.stock });
            return res.status(400).json({ msg: "Stock tidak cukup" });
        }
        
        // Calculate total price
        const totalPrice = product.price * quantity;
        console.log('💰 Price calculation:', { 
            unitPrice: product.price, 
            quantity, 
            totalPrice 
        });
        
        // Check if inserted amount is sufficient
        if (insertedAmount < totalPrice) {
            console.log('❌ Insufficient money:', { 
                inserted: insertedAmount, 
                required: totalPrice, 
                shortfall: totalPrice - insertedAmount 
            });
            return res.status(400).json({ msg: "Uang tidak cukup" });
        }
        
        // Calculate change
        const changeAmount = insertedAmount - totalPrice;
        console.log('💵 Change calculation:', { 
            inserted: insertedAmount, 
            totalPrice, 
            changeAmount 
        });
        
        // Update stock
        const newStock = product.stock - quantity;
        await Product.update({
            stock: newStock
        }, {
            where: { id: productId }
        });
        console.log('📦 Stock updated:', { 
            productId, 
            oldStock: product.stock, 
            newStock, 
            quantity 
        });
        
        // Create transaction record
        const transaction = await Transaction.create({
            productId: productId,
            productName: product.name,
            quantity: quantity,
            paidAmount: insertedAmount,
            changeAmount: changeAmount,
            totalPrice: totalPrice
        });
        console.log('✅ Transaction created:', { 
            id: transaction.id, 
            productName: transaction.productName, 
            totalPrice: transaction.totalPrice 
        });
        
        res.json({
            msg: `Berhasil membeli ${quantity} ${product.name}`,
            changeAmount: changeAmount,
            totalPrice: totalPrice,
            transactionId: transaction.id
        });
        
    } catch (error) {
        console.error('❌ Purchase error:', error);
        res.status(500).json({ 
            msg: "Error processing purchase", 
            error: error.message 
        });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        console.log('Deleting transaction with ID:', req.params.id);
        
        // First, get the transaction to check if it exists
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) {
            console.log('Transaction not found for deletion');
            return res.status(404).json({ msg: "Transaction not found" });
        }
        
        console.log('Transaction found:', transaction.productName, 'Amount:', transaction.totalPrice);
        
        await Transaction.destroy({
            where: {
                id: req.params.id
            }
        });
        
        console.log('Transaction deleted successfully');
        res.status(200).json({ msg: "Transaction Deleted Successfully" });
    } catch (error) {
        console.log('Error deleting transaction:', error);
        res.status(500).json({ msg: "Error deleting transaction" });
    }
};

export const listTransactions = async (req, res) => {
    try {
        console.log('listTransactions called');
        const transactions = await Transaction.findAll({
            order: [['createdAt', 'DESC']]
        });
        console.log('Found transactions:', transactions.length);
        console.log('Transactions data:', transactions);
        res.json(transactions);
    } catch (error) {
        console.log('Error in listTransactions:', error);
        res.status(500).json({ msg: "Error fetching transactions" });
    }
};


