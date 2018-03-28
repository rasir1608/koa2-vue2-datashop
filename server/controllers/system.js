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
          const ownerInfo = await userServer.getUserById(row.owner);
          row.setDataValue('ownerInfo', ownerInfo);
          const operators = row.operators.split(',');
          const operatorInfos = await userServer.butchGetUserByIds(operators);
          row.setDataValue('operatorInfos', operatorInfos);
          return row;
        });
        list = await Promise.all(pFn);
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
      if (isExis) {
        ctx.body = {
          ok: false,
          data: '',
          msg: '项目名重复',
        };
      } else {
        const ret = await systemServer.createSystem(data);
        const ownerId = data.owner;
        const userInfo = await userServer.getUserById(ownerId);
        if (userInfo.systems)userInfo.systems = `${userInfo.systems},${ret.id}`;
        else userInfo.systems = `${ret.id}`; 
        const abc = await userServer.updateUserInfo(userInfo);
        console.log(46, abc);
        ctx.body = {
          ok: true,
          data: ret,
          msg: '项目保存成功',
        };
      }
    },
    async getAll(ctx) {
      const ret = await systemServer.getAllSystem();
      if (ret) {
        ctx.body = {
          ok: true,
          data: ret,
          msg: '',
        };
      } else {
        ctx.body = {
          ok: false,
          data: '',
          msg: '项目查询失败',
        };
      }
    },
    async getAllByOperator(ctx) {
      const operator = ctx.query.userId;
      const ret = await systemServer.getAllByOperator(`%${operator}%`);
      if (ret) {
        const regStr = `(,|\\b)${operator}(,|\\b)`;
        const regExp = new RegExp(regStr);
        const systems = ret.filter(s => regExp.test(s.getDataValue('operators')));
        ctx.body = {
          ok: true,
          data: systems,
          msg: '',
        };
      } else {
        ctx.body = {
          ok: false,
          data: '',
          msg: '可用项目查询失败',
        };
      }
    },
};