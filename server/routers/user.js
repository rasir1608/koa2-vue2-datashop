const KoaRouter = require('koa-router');
const userController = require('../controllers/user');
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
const user = KoaRouter();
user.post('/user/register', userController.registerAuth);
user.post('/user/login', userController.postUserAuth);
user.post('/userinfo/updatePassword', userController.updatePassword);
user.post('/userinfo/uploadImg', upload.single('file'), userController.getImageUpload);
user.post('/userinfo/updateUserName', userController.updateUserName);
user.get('/userinfo/userInfo', userController.getUserInfo);
user.get('/userinfo/getUserInfoByName', userController.getUserInfoByName);
module.exports = user;