const { ZodError } = require('zod');

const validateRequest = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next(); 
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.errors.map(err=>err.message);
            return res.status(400).json({ errors: errorMessages});
        }
        return res.status(500).json({ message: 'Validation Error', error });
    }
};

module.exports = validateRequest;
