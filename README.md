# vue-cli-rasir

# Sass
>全局使用ES6语法编写，SASS(预编译),postcss(后编译),集成express开发服务器(解决前台跨域问题);

>主要布局模式 app.vue views/main/index.vue||latout.vue;

>集成sass(assets/common.scss 存放全局变量),全局样式(assets/style.scss)（修改element样式;

# axios
>集成http.js(axios拦截器) 实现统一登录，统一出错处理;

# vue-router
>集成vue-router(实现权限路由钩子);

# vuex
>集成vuex 全局状态管理（模块global处理全局状态);

>namespaced: true 激活模块命名空间;

> action(所有异步改变通过commit| mutation 改变 state), mutation 改变 state, state ->激活页面变化

>mapGetters,mapState,mapMutations,mapActions(使用方法在App.vue)

# eslint
>集成es-lint(基于airbnb模板) 管理代码规范;

>vuex使用eslint

>/* eslint-disable no-param-reassign */

>/* eslint-disable no-shadow */

>/* eslint-disable no-new */

# 组件(src/components)
>基于element2.x 封装成业务组件sfsFilter,leftMenu,sfTable...后续增加公用组件;
>基于charts封装 pielinebar 组件(提供样式),提供一维数据,二维数据 只需要更新数据;

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).