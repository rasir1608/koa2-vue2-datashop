const systemServer = require('../services/system.js');
const userServer = require('../services/user.js');

module.exports = {
    async page(ctx) {
      const data = ctx.request.body;
      const ret = await systemServer.getSystemListPage(data);
      console.log(8, ret);
      let list = ret.rows;
      if (ret.rows.length > 0) {
         const pFn = await ret.rows.map(async (row) => {
           console.log(12);
          const userInfo = await userServer.getUserById(row.owner);
          row.ownerInfo = userInfo;
          // console.log(14, userInfo);
          const operators = row.operators.split(',');
          const operatorInfos = await userServer.butchGetUserByIds(operators);
          row.operatorInfos = operatorInfos;
          // console.log(17, row);
          return row;
        });
        list = await Promise.all(pFn);
        console.log(21, list);
      }
      ctx.body = {
        ok: true,
        data: {
          list,
          total: ret.count,
        },
        msg: '',
      };
    },
    async insert(ctx) {
      const data = ctx.request.body;
      const isExis = await systemServer.getSystemByName(data.name);
      console.log(21, isExis);
      if (isExis) {
        ctx.body = {
          ok: false,
          data: '',
          msg: '项目名重复',
        };
      } else {
        const ret = await systemServer.createSystem(data);
        ctx.body = {
          ok: true,
          data: ret,
          msg: '项目保存成功',
        };
        console.log(13, 'create', ret);
      }
    },
};