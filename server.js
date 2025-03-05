const express = require('express');
const app = express();
const database = require('./Config/db');
const authRoutes = require('./Routes/user');
const orderRoutes = require('./Routes/order');
const dummy = require('./Routes/dummy_data');
require('dotenv').config();
const PORT = process.env.port || 9000;
const orderlistener = require('./Controllers/OrderListener');
// call the database connection 
database();
app.use(express.json());
orderlistener();
// authentication routes 
app.use('/api/auth', authRoutes);
// order routes
app.use('/api/orders',orderRoutes);
app.use('/api/insert_data',dummy);

app.listen(PORT, ()=>{
    console.log(`Server is running at port : ${PORT}`);
})
