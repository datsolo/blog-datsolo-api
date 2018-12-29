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
    },
    {
        method: 'PUT',
        path: '/like/{id}',
        handler: BlogController.like
    },
    {
        method: 'GET',
        path: '/blog/{id}',
        config: {
            auth: false
        },
        handler: BlogController.detail
    },
    {
        method: 'GET',
        path: '/blog/search',
        config: {
            auth: false
        },
        handler: BlogController.search
    },
    {
        method: 'GET',
        path: '/blog/hastag',
        config: {
            auth: false
        },
        handler: BlogController.searchByHastag
    },
    {
        method: 'GET',
        path: '/myblog/{id}',
        handler: BlogController.listByUser
    }
]