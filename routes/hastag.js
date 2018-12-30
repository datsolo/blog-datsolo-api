'use strict';

const Joi = require('joi');

const HastagController = require('../controllers/hastag');

module.exports = [
    {
        method: 'GET',
        path: '/hastag',
        config: {
            auth: false
          },
        handler: HastagController.get
    },
    {
        method: 'POST',
        path: '/hastag',
        config: {
            auth: false
        },
        handler: HastagController.create
    },
    {
        method: 'DELETE',
        path: '/hastag/{id}',
        config: {
            auth: false
        },
        handler: HastagController.remove
    },
    {
        method: 'GET',
        path: '/hastagdetail/{id}',
        config: {
            auth: false
        },
        handler: HastagController.detail
    }
]