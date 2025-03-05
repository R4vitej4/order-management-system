const express = require('express');
const User = require('../Models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
require('dotenv').config();
const { generateTokens } = require('../Utilities/authHelpers');
const { registerSchema, loginSchema, refreshTokenSchema } = require('../Utilities/Validations');
const validateRequest = require('../Middlewares/ValidateRequest');


router.post('/register',validateRequest(registerSchema), async (req,res)=>{
    try{
        const {email , password} = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        user = new User({ email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch(err){
        console.log("Error in Register endpoint: ", err);
        res.status(500).json({
            message:"Something went wrong!"
        })
    }
});



router.post('/login', validateRequest(loginSchema), async(req,res)=>{
    try {
        const { email, password } = req.body; 

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const tokens = generateTokens(user);

        res.json(tokens);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
})


router.post('/refresh', validateRequest(refreshTokenSchema), (req, res) => {
    try {
        const { refreshToken } = req.body; 

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token' });

            const newAccessToken = jwt.sign(
                { userId: decoded.userId },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});


module.exports = router;