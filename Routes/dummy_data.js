const express = require('express');
const Product = require('../Models/ProductSchema');
const Inventory = require('../Models/Inventory');

const router = express.Router();


router.post('/products', async (req, res) => {
    try {
        const products = [
            { name: "Laptop", description: "High-performance laptop", price: 1200, stock: 10 },
            { name: "Smartphone", description: "Latest model smartphone", price: 800, stock: 15 },
            { name: "Wireless Earbuds", description: "Noise-cancelling earbuds", price: 150, stock: 25 },
            { name: "Smartwatch", description: "Fitness tracking smartwatch", price: 200, stock: 30 },
            { name: "Mechanical Keyboard", description: "RGB mechanical keyboard", price: 100, stock: 20 }
        ];

        await Product.deleteMany(); 
        const insertedProducts = await Product.insertMany(products);

        res.status(201).json({ message: "Products inserted successfully", products: insertedProducts });
    } catch (error) {
        res.status(500).json({ message: "Error inserting products", error: error.message });
    }
});


router.post('/inventory', async (req, res) => {
    try {
        const products = await Product.find();

        if (!products.length) {
            return res.status(400).json({ message: "No products found! Seed products first." });
        }

        const inventoryData = products.map(product => ({
            productId: product._id,
            stock: product.stock
        }));

        await Inventory.deleteMany();
        await Inventory.insertMany(inventoryData);

        res.status(201).json({ message: "Inventory inserted successfully", inventory: inventoryData });
    } catch (error) {
        res.status(500).json({ message: "Error inserting inventory", error: error.message });
    }
});

module.exports = router;
