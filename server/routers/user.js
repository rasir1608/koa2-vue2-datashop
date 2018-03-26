const KoaRouter = require('koa-router');
const userController = require('../controllers/user');

const user = KoaRouter();
user.post('/user/register', userController.registerAuth);
user.post('/user/login', userController.postUserAuth);
module.exports = user;