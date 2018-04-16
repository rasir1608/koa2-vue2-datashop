const KoaRouter = require('koa-router');
const userController = require('../controllers/user');

const user = KoaRouter();
user.post('/user/register', userController.registerAuth);
user.post('/user/login', userController.postUserAuth);
user.get('/user/userInfo', userController.getUserInfo);
user.get('/user/getUserInfoByName', userController.getUserInfoByName);
module.exports = user;