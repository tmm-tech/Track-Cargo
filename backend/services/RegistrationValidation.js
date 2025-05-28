const Joi = require('joi');

const registrationSchema = Joi.object({
  fullname: Joi.string()
    .min(5)
    .required(),

  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),

  username: Joi.string()
    .alphanum()
    .min(4)
    .max(30)
    .required(),

  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 12 characters',
    }),

  roles: Joi.string().required(),

  status: Joi.string().valid('active', 'inactive').default('active'),

  permissions: Joi.array().items(Joi.string()),
  
  lastLogin: Joi.date().allow(null).default(null),
});


const validateCreateUserSchema = (payload) => {
    return registrationSchema.validateAsync(payload, { abortEarly: false })
}
module.exports = validateCreateUserSchema
