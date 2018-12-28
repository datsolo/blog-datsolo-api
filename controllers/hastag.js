var request = require('request');
var Boom = require('boom');
var Hastag = require('../models/hastag');

exports.get = (req, h) => {
	return Hastag.find().exec().then((hastags) => {
		if (!hastags) return { message: 'Hastag not Found' };
		return hastags;
	}).catch((err) => {

		return Boom.boomify(err, { statusCode: 422 });

	});
}

exports.create = (req, h) => {
    const hastagData = {
        content: req.payload.content,
    };

    return Blog.create(hastagData).then((hastag) => {
        return { message: "hastag created successfully", hastag: hastag };
    })
        .catch((err) => {
            return Boom.boomify(err, { statusCode: 422 });
        })
}

exports.remove = (req, h) => {
    return Hastag.findById(req.params.id).exec().then((hastag) => {
        if (!hastag) return Boom.badData('Hastag not found');
        return hastag.remove().then((data) => {
            return { message: "Remove successfuly", hastag: hastag };
        })
            .catch((err) => {
                return Boom.boomify(err, { statusCode: 422 });
            })
    })
}