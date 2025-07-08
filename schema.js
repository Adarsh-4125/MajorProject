const Joi = require('joi');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required().min(10),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().uri().optional(),
        category: Joi.string().valid(
            'trending',
            'room',
            'mountains',
            'castles',
            'pools',
            'homes',
            'farms',
            'camping'
        ).required(),
    }).required(),
    deleteImages: Joi.array().items(Joi.string()).optional()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});

module.exports = { listingSchema, reviewSchema };