const { ses } = require('../Config/aws');
require('dotenv').config();


const sendEmailNotification = async (order, to_email) => {
    console.log("SES Source Email:", process.env.AWS_SES_FROM_EMAIL);

    const params = {
        Source: process.env.AWS_SES_FROM_EMAIL, 
        Destination: { ToAddresses: [to_email] },
        Message: {
            Subject: { Data: `Order Confirmation - ${order.orderId}` },
            Body: {
                Text: {
                    Data: `Thank you for your order!\n\nOrder ID: ${order.orderId}\nStatus: ${order.status}\nTotal: $${order.totalAmount}`
                }
            }
        }
    };

    try {
        await ses.sendEmail(params).promise();
        console.log(`Email sent to ${to_email}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmailNotification };
