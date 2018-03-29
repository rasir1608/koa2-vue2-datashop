const interfaceServer = require('../services/interface.js');
const userServer = require('../services/user.js');
const systemServer = require('../services/system.js');

module.exports = {
    async page(ctx) {
        const data = ctx.request.body;
        const ret = await interfaceServer.pageInterface(data);
       
        if (Array.isArray(ret.rows) && ret.rows.length > 0) {
            const pFn = await ret.rows.map(async (i) => {
                const creator = i.getDataValue('creator');
                const oprator = i.getDataValue('oprator');
                const systemId = i.getDataValue('systemId');
                const corInfo = await userServer.getUserById(creator);
                const oprInfo = await userServer.getUserById(oprator);
                const systemInfo = await systemServer.getOneSystem({ id: systemId });
                i.setDataValue('systemName', systemInfo.name);
                i.setDataValue('creatorName', corInfo.user_name);
                i.setDataValue('opratorName', oprInfo.user_name);
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
                msg: '获取接口分页信息失败！',
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