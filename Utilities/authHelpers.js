const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

module.exports = { generateTokens };
