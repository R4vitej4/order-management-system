const mongoose = require('mongoose');
require('dotenv').config();

const db = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connection is successful");
    } catch(err){
        console.log("DB connection is failed: ",err);
    }
}

module.exports = db;