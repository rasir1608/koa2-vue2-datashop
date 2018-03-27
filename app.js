// node.js 入口
const Koa = require('koa');
// const HistoryRouter = require('./server/routers/history-routers');
const path = require('path');
const Static = require('koa-static');
const Logger = require('koa-logger'); 
const Json = require('koa-json');
const Body = require('koa-body');
const favicon = require('koa-favicon');
const JwtKoa = require('koa-jwt');
const userRouter = require('./server/routers/user');
const systemRouter = require('./server/routers/system');
const interfaceRouter = require('./server/routers/interface');
const ErrorRouter = require('./server/routers/error-router');
// const history = require('koa2-connect-history-api-fallback');

const app = new Koa();

app
    .use(ErrorRouter())
    .use(favicon(path.resolve(__dirname, './public/favicon.jpg')))
    .use(Static(path.resolve(__dirname, './public')))
    .use(Logger())
    .use(Json())
    .use(Body())
    .use(JwtKoa({ secret: 'data-shop-secret' }).unless({
      path: [/^\/user/], //数组中的路径不需要通过jwt验证
    }))
;
app.on('error', (err) => {
    console.log('server error', err);
  });
app
    .use(userRouter.routes(), userRouter.allowedMethods())
    .use(systemRouter.routes(), systemRouter.allowedMethods())
    .use(interfaceRouter.routes(), interfaceRouter.allowedMethods())
    ;


app.listen(8888, () => {
    console.log('koa2-vue2-datashop run in 8888');
});
