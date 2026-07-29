import {body,validationResult} from "express-validator"

export const validationRegister = [
    body('name').trim().notEmpty().withMessage("Name is required").isLength({min:2,max:50}).withMessage("Name must be between 2 and 50 characters"),
    body('email').trim().isEmail().withMessage('valid email is required').normalizeEmail(),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    handleValidationErrors,
];

export const validateLogin =[
    body('email').trim().isEmail().withMessage('valid email is required').normalizeEmail(),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    handleValidationErrors,
]
function handleValidationErrors(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next();
}