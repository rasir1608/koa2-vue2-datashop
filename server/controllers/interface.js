const interfaceServer = require('../services/interface.js');

module.exports = {
    page() {},
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
            console.log(8, ret);
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
};