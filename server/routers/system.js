const KoaRouter = require('koa-router');
const systemController = require('../controllers/system');

const system = KoaRouter();
system.post('/system/page', systemController.page);
system.post('/system/insert', systemController.insert);
system.post('/system/update', systemController.update);
system.post('/system/all', systemController.getAll);
system.get('/system/operatorSystems', systemController.getAllByOperator);

module.exports = system;