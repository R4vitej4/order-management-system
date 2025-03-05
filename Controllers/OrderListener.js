require('dotenv').config();
const { sqs, SQS_QUEUE_URL } = require('../Config/aws');
const Order = require('../Models/orderSchema');
const User = require('../Models/userSchema');
const { sendEmailNotification } = require('../Utilities/emailService');

const processOrder = async () => {
    try {
        const params = {
            QueueUrl: SQS_QUEUE_URL,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 10
        };

        const response = await sqs.receiveMessage(params).promise();
        if (!response.Messages || response.Messages.length === 0) return;

        const message = response.Messages[0];
        const { orderId } = JSON.parse(message.Body);

        console.log(`Processing Order: ${orderId}`);

        const order = await Order.findOneAndUpdate(
            { orderId },
            { status: 'Processed' },
            { new: true }
        );
        console.log("Order details are: ", order);
        if (!order) {
            console.error(`Order ${orderId} not found`);
            return;
        }
        const customer = await User.findOne({ _id: order.userId }); 
        const customer_email = customer?.email;

        if (!customer_email) {
            console.error("User email not found for order:", order.orderId);
        } else {
            console.log("Customer email:", customer_email);
        }
        await sendEmailNotification(order, customer_email);

        await sqs.deleteMessage({ QueueUrl: SQS_QUEUE_URL, ReceiptHandle: message.ReceiptHandle }).promise();

        console.log(`Order ${orderId} processed successfully`);
    } catch (error) {
        console.error('Error processing order:', error);
    }
};

const orderlistener = () => {
    setInterval(() => {
        processOrder(); 
    }, 10000);
};

module.exports = orderlistener;