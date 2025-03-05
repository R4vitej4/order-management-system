const { sqs, SQS_QUEUE_URL } = require('../Config/aws');
const Product = require('../Models/ProductSchema');
const Inventory = require('../Models/Inventory');
const Order = require('../Models/orderSchema');
const { v4: uuidv4 } = require('uuid');


const createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req.user;
        console.log(`userID: ${userId}`);
        for (let item of items) {
            const inventory = await Inventory.findOne({ productId: item.productId });
            if (!inventory || inventory.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for Product ID: ${item.productId}` });
            }
        }

        let totalAmount = 0;
        for (let item of items) {
            const product = await Product.findById(item.productId);
            totalAmount += product.price * item.quantity;
        }

        const order = new Order({
            orderId: uuidv4(),
            userId,
            items,
            totalAmount,
            status: 'Pending'
        });
        console.log("Order insertion data is: ", order);
        await order.save();

        const sqsParams = {
            MessageBody: JSON.stringify({ orderId: order.orderId }),
            QueueUrl: SQS_QUEUE_URL
        };
        await sqs.sendMessage(sqsParams).promise();
        console.log("Order placed successfully");
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};


module.exports = createOrder;