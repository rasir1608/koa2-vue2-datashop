const KoaRouter = require('koa-router');
const systemController = require('../controllers/system');

const system = KoaRouter();
system.get('/system/list/:userId', systemController.list);
module.exports = system;