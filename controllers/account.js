var request = require('request');
var Boom = require('boom');
var Account = require('../models/account');
var Session = require('../models/session');
var User = require('../classes/user');
// var Notification = require('../classes/notification');
var Session = require('../models/session');

// declare number of record per page
const perPage = 10;



exports.login = (req, h) => {
	return Account.findOne({ $or: [{ phone: req.payload.username }, { username: req.payload.username }] }).exec().then((account) => {
		if (!account) {
			return Boom.badData('Invalid username');
		}
		var Bcrypt = require('bcrypt');
		if (!Bcrypt.compareSync(req.payload.password, account.password)) {
			return Boom.badData('Invalid password');
		}
		//luu session
		var user = new User(account);
		console.log(user);
		return user.generate_session();



	}).catch((err) => {
		//console.log(err);
		return Boom.boomify(err, { statusCode: 404 });

	});
}


exports.list = (req, h) => {

	//TODO Sorting and pagnination
	var query = {};
	var skill_arr = [];
	for (var key in req.query) { //could also be req.query and req.params
		if (key != 'page') req.query[key] !== "" ? query[key] = req.query[key] : null;
	}
	var current_page = req.query['page'] || 1;

	return Account.find(query).skip((perPage * current_page) - perPage).limit(perPage).exec().then((accounts) => {
		return Account.count(query).exec().then(count => {
			return { accounts: accounts, current: parseInt(current_page), pages: Math.ceil(count / perPage) };
		}).catch((err) => {
			return Boom.boomify(err, { statusCode: 422 });
		});
	}).catch((err) => {
		return Boom.boomify(err, { statusCode: 422 });
	});
}

/**
 * Get Account by ID
 */
exports.get = (req, h) => {
	return Account.findById(req.params.id).exec().then((account) => {
		if (!account) return { message: 'Account not Found' };
		return account;
	}).catch((err) => {

		return Boom.boomify(err, { statusCode: 422 });

	});
}

/**
 * Get Account by phone
 */
exports.getByPhone = (req, h) => {

	return Account.findOne({ phone: req.params.phone }).exec().then((account) => {

		if (!account) return { message: 'Account not Found' };

		return { account: account };

	}).catch((err) => {

		return Boom.boomify(err, { statusCode: 422 });

	});
}







exports.create = (req, h) => {
	var user = new User();
	return user.create(req.payload).then((account) => {
		user = new User(account);
		return user.generate_session().then(result => {
			return { message: "Account created successfully", account: account, sessionid: result.sessionid }
		})
	}).catch((err) => {
		//return Boom.badData('Phone number is existed');
		return Boom.boomify(err, { statusCode: 422 });

	});
}

//login by session
exports.auth = (req, h) => {
	var user = new User()
	return user.load_user_from_session(req.headers.sessionid).then((account) => {
		if(!account) Boom.boomify(err, { statusCode: 401 });
		return account;
	}).catch((err) => {
		return Boom.boomify(err, { statusCode: 401 });
	})
}



exports.update = (req, h) => {
	var data = req.payload;

	var user_id = req.auth.credentials.user._id;

	return Account.findById(user_id).exec().then((account) => {

		if (!account) throw Boom.badData('Account not found');

		if (data.password) {
			var Bcrypt = require('bcrypt');
			data.password = Bcrypt.hashSync(req.payload.password, 10);
		}
		return account.update(data).exec().then(() => {
			return { message: "Account data updated successfully" };
		})		
	}).catch((err) => {
		return Boom.boomify(err, { statusCode: 422 });
	});

}




/**
 * Delete Account by ID
 */
exports.remove = (req, h) => {

	return Account.findById(req.params.id).exec().then((account) => {
		if (!account) return Boom.badData('Account not found');

		return account.remove().then((data) => {
			return { message: 'Remove successfuly' };
		}).catch((err) => {

			return Boom.boomify(err, { statusCode: 422 });

		});

	}).catch((err) => {

		return Boom.boomify(err, { statusCode: 422 });

	});
}

exports.search = (req, h) => {
	// var type_query = req.query.type || ['admin', 'host', 'worker'];
	if (req.query.keyword !== '') {
		return Account.find({ name: { $regex: req.query.keyword, $options: 'i' }}).exec().then((accounts) => {
			if (!accounts) return Boom.badData('No result');
			return { accounts }
		}).catch((err) => {
			return Boom.boomify(err, { statusCode: 422 });
		});
	} else {
		return { accounts: [] }
	}
}

