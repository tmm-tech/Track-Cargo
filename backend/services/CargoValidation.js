const Joi = require('joi');

const cargoSchema = Joi.object({
    container_number: Joi.string().required(),
    truck_number: Joi.string().required(),
    bl_number: Joi.string().required(),
});

const validateCargoSchema = async (payload, checkBlUnique) => {
    // Validate with Joi
    const value = await cargoSchema.validateAsync(payload, { abortEarly: false });

    // Check BL number uniqueness
    const isBlUnique = await checkBlUnique(value.bl_number);
    if (!isBlUnique) {
        throw new Error('BL number must be unique');
    }

    return value;
};

module.exports = validateCargoSchema;
