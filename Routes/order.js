const express = require('express');
const router = express.Router();
const create_order = require('../Controllers/Order');
const get_order_details = require('../Controllers/getOrderDetails');
const authMiddleware = require('../Middlewares/authMiddleware');

router.post('/create', authMiddleware, create_order);

router.get('/:id', authMiddleware, get_order_details);



module.exports = router;