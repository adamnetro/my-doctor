const {body, validationResult} = require('express-validator')

const userValidatorRules = () => {
    return [
        body('name').notEmpty().withMessage('اسم المستخدم مطلوب'),
        body('email').notEmpty().withMessage('البريد الالكتروني مطلوب'),
        body('email').isEmail().withMessage('يجب ادخال بريد الكتروني بشكل صحيح'),
        body('password').notEmpty().withMessage('كلمة المرور مطلوبة'),
        body('password').isLength({min:5}).withMessage('يجب ادخال كلمة مرور اكثر من خمصة أحرف'),
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({
        [err.path]:err.msg
    }))
    return res.status(400).json({errors: extractedErrors})
}

module.exports = {
    userValidatorRules,
    validate,
}