const KoaRouter = require('koa-router');
const interfaceController = require('../controllers/interface');

const interfaceRouter = KoaRouter();
interfaceRouter.post('/interface/page', interfaceController.page);
interfaceRouter.post('/interface/insert', interfaceController.insert);
interfaceRouter.post('/interface/update', interfaceController.update);
interfaceRouter.get('/interface/findById', interfaceController.findById);

module.exports = interfaceRouter;