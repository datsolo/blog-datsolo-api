var Account = require('../models/account');
var Blog = require('../models/blog');
var request = require('request');
var Boom = require('boom');
var Hastag = require('../models/hastag');
var User = require('../classes/user');
var Comment = require('../models/comment');

exports.get = (req, h) => {
    return Comment.find({blog_id: req.params.id}).populate('user_id').sort({ created: 'desc' }).exec().then((comments) => {
        if (!comments) return { message: 'Hastag not Found' };
        return comments;
    }).catch((err) => {

        return Boom.boomify(err, { statusCode: 422 });

    });
}

exports.create = (req, h) => {
    const commentData = {
        user_id: req.auth.credentials.user._id,
        blog_id: req.params.id,
        content: req.payload.content,
    }
    return Comment.create(commentData).then((comment) => {
        return { message: "comment created successfully", comment: comment };
    })
        .catch((err) => {
            return Boom.boomify(err, { statusCode: 422 });
        })
}
