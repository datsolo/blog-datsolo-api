var Account = require('../models/account');
var Blog = require('../models/blog');
var request = require('request');
var Boom = require('boom');
var Hastag = require('../models/hastag');
var User = require('../classes/user');
var Comment = require('../models/comment');

const perPage = 10;

exports.list = (req, h) => {
    var current_page = req.query['page'] || 1;
    return Blog.find().skip((perPage * current_page) - perPage).limit(perPage).populate('user_id').populate('hastag').sort({ created: 'desc' }).lean().exec().then((blogs) => {
        return Blog.count().exec().then(count => {
        return { blogs: blogs, current: parseInt(current_page), pages: Math.ceil(count / perPage) };
        })
    }).catch((err) => {
        return Boom.boomify(err, { statusCode: 422 });
    })
}

exports.create = (req, h) => {
    const blogData = {
        user_id: req.auth.credentials.user._id,
        title: req.payload.title,
        content: req.payload.content,
        hastag: req.payload.hastag
    };

    return Blog.create(blogData).then((blog) => {
        return { message: "blog created successfully", blog: blog };
    })
        .catch((err) => {
            return Boom.boomify(err, { statusCode: 422 });
        })
}

exports.remove = (req, h) => {
    return Blog.findById(req.params.id).exec().then((blog) => {
        if (!blog) return Boom.badData('Blog not found');
        return blog.remove().then((data) => {
            return { message: "Remove successfuly", blog: blog };
        })
            .catch((err) => {
                return Boom.boomify(err, { statusCode: 422 });
            })
    })
}


exports.update = (req, h) => {
    return Blog.update({ _id: req.params.id }, { ...req.payload }, function (err, raw) {
        if (err) return Boom.boomify(err, { statusCode: 422 });
    }).exec().then(() => {
        return { message: "Blog updated successfully" };
    })
}

exports.like = (req, h) => {
    var user_id = req.auth.credentials.user._id;
    var blog_id = req.params.id;
    return Blog.findById(blog_id).exec().then((blog) => {
        if (!blog) return Boom.badData('Blog not found');
        var index = blog.like.indexOf(user_id);
        if (index >= 0) {
            blog.like = blog.like.filter((user) => {
                return (user.toString() !== user_id.toString());
            });
            return Blog.update({ _id: blog_id }, { like: blog.like }, function (err, raw) {
                if (err) return Boom.boomify(err, { statusCode: 422 });
            }).exec().then(() => {
                return { message: "liked" };
            })

        }
        else {
            blog.like.push(user_id);
            return Blog.update({ _id: blog_id }, { like: blog.like }, function (err, raw) {
                if (err) return Boom.boomify(err, { statusCode: 422 });
            }).exec().then(() => {
                return { message: "unliked" };
            })
        }
    }).catch(err => {
        return Boom.boomify(err, { statusCode: 422 });
    })
}

exports.detail = (req, h) => {
    return Blog.findById(req.params.id).populate('user_id').populate('hastag').exec().then((blog) => {
        if (!blog) return { message: 'Blog not Found' };
        return blog;
    }).catch((err) => {

        return Boom.boomify(err, { statusCode: 422 });

    });
}

exports.search = (req, h) => {
    if (req.query.keyword !== '') {
        return Blog.find({ content: { $regex: req.query.keyword, $options: 'i' } }).populate('hastag').populate('user_id').sort({ created: 'desc' }).exec().then((blogs) => {
            if (!blogs) return Boom.badData('No result');
            return { blogs }
        }).catch((err) => {
            return Boom.boomify(err, { statusCode: 422 });
        });
    } else {
        return { blogs: [] }
    }
}

exports.searchByHastag = (req, h) => {
    console.log(req.query)
    let hastag = [req.query.hastag]
    if (hastag !== []) {
        return Blog.find({ hastag:  hastag  }).populate('user_id').populate('hastag').sort({ created: 'desc' }).exec().then((blogs) => {
            if (!blogs) return Boom.badData('No result');
            return { blogs }
        }).catch((err) => {
            return Boom.boomify(err, { statusCode: 422 });
        });
    } else {
        return { blogs: [] }
    }
}


exports.listByUser =  (req, h) => {
    var current_page = req.query['page'] || 1;
    return Blog.find({user_id: req.params.id}).skip((perPage * current_page) - perPage).limit(perPage).populate('user_id').populate('hastag').sort({ created: 'desc' }).lean().exec().then((blogs) => {
        if (!blogs) return Boom.badData('No result');
        return { blogs };
    }).catch((err) => {
        return Boom.boomify(err, { statusCode: 422 });
    })
}

