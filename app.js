// node.js 入口
const Koa = require('koa');
const MainRouter = require('./server/routers/main-routers');
// const HistoryRouter = require('./server/routers/history-routers');
const path = require('path');
const Static = require('koa-static');
const Logger = require('koa-logger'); 
const Json = require('koa-json');
const Body = require('koa-body');
const favicon = require('koa-favicon');
// const history = require('koa2-connect-history-api-fallback');

const app = new Koa();

app
.use(favicon(path.resolve(__dirname, './public/favicon.jpg')))
.use(Static(path.resolve(__dirname, './public')))
.use(Logger())
.use(Json())
.use(Body())
;
app.on('error', (err) => {
    console.log('server error', err);
  });
app
    .use(MainRouter.routes())
    // .use(history())
;

app.listen(8888, () => {
    console.log('koa2-vue2-datashop run in 8888');
});
