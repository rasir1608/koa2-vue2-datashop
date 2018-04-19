const systemServer = require('../services/system.js');
const userServer = require('../services/user.js');
const interfaceServer = require('../services/interface.js');
const tool = require('../utils');

module.exports = {
    async page(ctx) {
      const data = ctx.request.body;
      const ret = await systemServer.getSystemListPage(data);
      let list = ret.rows;
      if (ret.rows.length > 0) {
         const pFn = await ret.rows.map(async (row) => {
          const ownerInfo = await userServer.getUserByRid(row.getDataValue('ownerRid'));
          row.setDataValue('ownerInfo', ownerInfo);
          const operators = row.getDataValue('operatorRids').split(',');
          const operatorInfos = await userServer.butchGetUserByRids(operators);
          row.setDataValue('operatorInfos', operatorInfos);
          let applicanters = row.getDataValue('applicantRids');
          if (applicanters) {
            applicanters = applicanters.split(',');
            const applicantInfos = await userServer.butchGetUserByRids(applicanters);
            row.setDataValue('applicantInfos', applicantInfos);
          } else {
            row.setDataValue('applicantInfos', []);
          }
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
        const id = ret.getDataValue('id');
        const rid = tool.getRid(id, 10);
        const res = await systemServer.updateSystem({ id, rid });
        if (res) {
          ctx.body = {
            ok: true,
            data: ret,
            msg: '项目保存成功',
          };
        } else {
          ctx.body = {
            ok: false,
            data: '',
            msg: '项目保存失败',
          };
        }
      }
    },
    async update(ctx) {
      const data = ctx.request.body;
      const ret = await systemServer.updateSystem(data);
      ctx.body = {
        ok: ret,
        data: '',
        msg: ret ? '项目更新成功' : '项目更新失败',
      };
    },
    async deleteByRid(ctx) {
      const rid = ctx.query.rid;
      const ret = await systemServer.deleteByRid(rid);
      if (ret) {
        const res = await interfaceServer.deleteBySystemRid(rid);
        if (res) {
          ctx.body = {
            ok: true,
            data: '',
            msg: '项目和项目下接口均删除成功！',
          };
        } else {
          ctx.body = {
            ok: false,
            data: '',
            msg: '项目删除成功，但接口删除异常！',
          };
        }
      } else {
        ctx.body = {
          ok: false,
          data: '',
          msg: '项目删除失败！',
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
      const operatorRid = ctx.query.userRid;
      const ret = await systemServer.getAllByOperator(operatorRid);
      if (ret) {
        const regStr = `(,|^)${operatorRid}(,|$)`;
        const regExp = new RegExp(regStr);
        const systems = ret.filter(s => regExp.test(s.getDataValue('operatorRids')));
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
    async findById(ctx) {
      const id = ctx.query.id;
      const ret = await systemServer.getOneSystem({ id });
      if (ret) {
        const operators = ret.getDataValue('operatorRids').split(',');
        const operatorInfos = await userServer.butchGetUserByRids(operators);
        ret.setDataValue('operatorInfos', operatorInfos);
        let applicanters = ret.getDataValue('applicantRids');
        if (applicanters) {
          applicanters = applicanters.split(',');
          const applicantInfos = await userServer.butchGetUserByRids(applicanters);
          ret.setDataValue('applicantInfos', applicantInfos);
        } else {
          ret.setDataValue('applicantInfos', []);
        }
        ctx.body = {
          ok: true,
          data: ret,
          msg: '项目详情查询成功',
        };
      } else {
        ctx.body = {
          ok: false,
          data: '',
          msg: '项目详情查询失败',
        };
      }
    },
    async apply(ctx) {
      const id = ctx.query.id;
      const applicantRids = ctx.query.applicantRids;
      const ret = await systemServer.updateSystem({ id, applicantRids });
      ctx.body = {
        ok: ret,
        data: '',
        msg: ret ? '已进入申请流程，请联系项目负责人审批' : '进入申请流程失败，请重试',
      };
    },
};