const KoaRouter = require('koa-router');
const interfaceController = require('../controllers/interface');

const interfaceRouter = KoaRouter();
interfaceRouter.post('/interface/page', interfaceController.page);
interfaceRouter.post('/interface/insert', interfaceController.insert);

module.exports = interfaceRouter;