const KoaRouter = require('koa-router');
const systemController = require('../controllers/system');

const system = KoaRouter();
system.post('/system/page', systemController.page);
system.post('/system/insert', systemController.insert);
system.post('/system/update', systemController.update);
system.get('/system/delete', systemController.deleteByRid);
system.get('/system/findById', systemController.findById);
system.post('/system/all', systemController.getAll);
system.get('/system/operatorSystems', systemController.getAllByOperator);
system.get('/system/apply', systemController.apply);
module.exports = system;