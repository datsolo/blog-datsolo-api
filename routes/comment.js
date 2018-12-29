'use strict';
const Joi = require('joi');
const CommetController = require('../controllers/comment');

module.exports = [
    {
        method: 'GET',
        path: '/comment/{id}',
        config: {
            auth: false
        },
        handler: CommetController.get
    },
    {
        method: 'POST',
        path: '/comment/{id}',
        handler: CommetController.create
    }
]