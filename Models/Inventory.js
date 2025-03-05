const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true, 
        min: 0 
    }
});

const Inventory = mongoose.model('Inventory', inventorySchema);


module.exports = Inventory;