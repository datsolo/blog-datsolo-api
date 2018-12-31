'use strict';
const AccountController = require('../controllers/account');
const Joi = require('joi');
module.exports = [{
  method: 'GET',
  path: '/accounts',
  config: {
    auth: false
  },
  handler: AccountController.list
},
{
  method: 'GET',
  path: '/account/{id}',
  
  handler: AccountController.get
},


{
  method: 'POST',
  path: '/login',
  config: {
    auth: false
  },
  handler: AccountController.login
},
{
  method: 'GET',
  path: '/auth',
  config: {
    auth: false
  },
  handler: AccountController.auth
},

{
  method: 'POST',
  path: '/account',
  config: {
    auth: false
  },
  handler: AccountController.create
},
{
  method: 'PUT',
  path: '/account/{id}',
  
  handler: AccountController.update
},

{
  method: 'DELETE',
  path: '/account/{id}',
  config: {
    auth: false
  },
  handler: AccountController.remove
},
{
  method: 'GET',
  path: '/accounts/search',
  config: {
    auth: false
  },
  handler: AccountController.search,
}
]
