const client = require('../Config/redis');
const Order = require('../Models/orderSchema');

const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID is:", id);

        const order = await client.get(id);

        if (order) {
            console.log("Cache Hit");
            return res.status(200).json(JSON.parse(order));
        }

        console.log("Cache Missed");
        const orderFromDB = await Order.findOne({ orderId: id }).populate('items.productId');

        if (!orderFromDB) {
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log("Fetched from DB:", orderFromDB);

        await client.set(id, JSON.stringify(orderFromDB), 'EX', 600);

        return res.status(200).json(orderFromDB);

    } catch (error) {
        console.error("Error in getOrderDetails:", error);
        return res.status(500).json({ message: 'Server Error', error });
    }
};

module.exports = getOrderDetails;
