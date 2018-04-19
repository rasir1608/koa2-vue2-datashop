const KoaRouter = require('koa-router');
const systemController = require('../controllers/system');
const multer = require('koa-multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({  
  //文件保存路径  
  destination(req, file, cb) {  
      const tempPath = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);
      cb(null, tempPath);
  },  
  filename(req, file, cb) {
      const fileFormat = (file.originalname).split('.');  
      cb(null, `${Date.now()}.${fileFormat[fileFormat.length - 1]}`);  
  },  
});  
const upload = multer({ storage });
const system = KoaRouter();
system.post('/system/page', systemController.page);
system.post('/system/insert', systemController.insert);
system.post('/system/update', systemController.update);
system.get('/system/delete', systemController.deleteByRid);
system.get('/system/findById', systemController.findById);
system.post('/system/all', systemController.getAll);
system.post('/system/uploadUrl', upload.single('file'), systemController.uploadUrl);
system.get('/system/operatorSystems', systemController.getAllByOperator);
system.get('/system/apply', systemController.apply);
module.exports = system;