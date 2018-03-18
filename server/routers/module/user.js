const KoaRouter = require('koa-router');
const userController = require('../../controllers/user');

const user = KoaRouter();
user.post('/user', userController.postUserAuth);
module.exports = user;