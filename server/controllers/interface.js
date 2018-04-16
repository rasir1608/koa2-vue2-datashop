const interfaceServer = require('../services/interface.js');
const userServer = require('../services/user.js');
const systemServer = require('../services/system.js');
const tool = require('../utils');

module.exports = {
    async page(ctx) {
        const data = ctx.request.body;
        const ret = await interfaceServer.pageInterface(data);
       
        if (Array.isArray(ret.rows) && ret.rows.length > 0) {
            const pFn = await ret.rows.map(async (i) => {
                const creator = i.getDataValue('creatorRid');
                const oprator = i.getDataValue('opratorRid');
                const systemRid = i.getDataValue('systemRid');
                const corInfo = await userServer.getUserByRid(creator);
                const oprInfo = await userServer.getUserByRid(oprator);
                const systemInfo = await systemServer.getOneSystem({ rid: systemRid });
                i.setDataValue('systemName', systemInfo.name);
                i.setDataValue('creatorName', corInfo.userName);
                i.setDataValue('opratorName', oprInfo.userName);
                return i;
            });
            const list = await Promise.all(pFn);
            ctx.body = {
                ok: true,
                data: {
                    list,
                    total: ret.count,
                },
                msg: '获取接口分页信息成功！',
            };
        } else {
            ctx.body = {
                ok: false,
                data: [],
                msg: '未获取到分页信息',
            };
        }
    },
    async findById(ctx) {
        const id = ctx.query.id;
        const ret = await interfaceServer.findOneInterface({ id });
        if (ret) {
            ctx.body = {
                ok: true,
                data: ret,
                msg: '获取接口成功！',
            };
        } else {
            ctx.body = {
                ok: false,
                data: '',
                msg: '获取接口失败！',
            };
        } 
    },
    async insert(ctx) {
        const data = ctx.request.body;
        const interfaceData = await interfaceServer.findOneInterface({ name: data.name });
        if (interfaceData) {
            ctx.body = {
                ok: false,
                data: '',
                msg: '接口名重复，请重新命名',
            };
        } else {
            const ret = await interfaceServer.insertInterface(data);
            const id = ret.getDataValue('id');
            const rid = tool.getRid(id, 10);
            const res = await interfaceServer.updateInterface({ id, rid });
            if (res) {
                ctx.body = {
                    ok: true,
                    data: ret,
                    msg: '',
                };
            } else {
                ctx.body = {
                    ok: false,
                    data: '',
                    msg: '接口信息保持失败',
                };
            }
        }
    },
    async update(ctx) {
        const data = ctx.request.body;
        const ret = interfaceServer.updateInterface(data);
        if (ret) {
            ctx.body = {
                ok: true,
                data: ret,
                msg: '接口数据更新成功',
            };
        } else {
            ctx.body = {
                ok: false,
                data: '',
                msg: '接口数据更新失败',
            };
        }
    },
};