const KoaRouter = require('koa-router');
const user = require('./module/user');
const jwt = require('koa-jwt');
const system = require('./module/system');

const router = KoaRouter();
router.use('/user', user.routes());
router.use('/system', jwt({ secret: 'data-shop-secret' }), system.routes());
module.exports = router;