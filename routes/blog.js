'use strict';

const Joi = require('joi');
const BlogController = require('../controllers/blog');

module.exports = [
    {
        method: 'POST',
        path: '/blog',
        handler: BlogController.create
    },
    {
        method: 'GET',
        path: '/blogs',
        config: {
            auth: false
        },
        handler: BlogController.list
    },
    {
        method: 'DELETE',
        path: '/blog/{id}',
        handler: BlogController.remove
    },
    {
        method: 'PUT',
        path: '/blog/{id}',
        handler: BlogController.update
    }
]