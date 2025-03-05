const { z } = require('zod');


const registerSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

const refreshTokenSchema = z.object({
    refreshToken: z.string().min(10, { message: 'Invalid refresh token' })
});



module.exports = { registerSchema, loginSchema, refreshTokenSchema };
