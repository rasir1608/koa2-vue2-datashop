const userServer = require('../services/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
    async getUserInfoById(ctx) {
        const id = ctx.params.id;
        const result = await userServer.getUserById(id);
        ctx.body = {
            ok: true,
            data: result,
        };
    },
    async registerAuth(ctx) {
        const userInfo = ctx.request.body;
        const isExis = await userServer.getUserByAccount(userInfo.account);
        if (isExis) {
            ctx.body = {
                ok: false,
                data: 0,
                msg: '账号已存在',
            };
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(userInfo.password, salt);
            console.log(26, hash);
            await userServer.addUser({
                account: userInfo.account,
                password: hash,
            });
            ctx.body = {
                ok: true,
                data: 1,
                msg: '账号保存成功',
            };
        }
    },
    async postUserAuth(ctx) {
        const data = ctx.request.body;
        const userInfo = await userServer.getUserByAccount(data.account);
        if (userInfo !== null) {
            if (!bcrypt.compareSync(data.password, userInfo.password)) {
                ctx.body = {
                    ok: true,
                    data: null,
                    info: '密码错误！',
                };
            } else {
                const userToken = {
                    name: userInfo.suer_name,
                    id: userInfo.id,
                };
                console.log(53, jwt.sign);
                const token = jwt.sign(userToken, 'data-shop-secret');
                ctx.body = {
                    ok: true,
                    token,
                };
            }
        } else {
            ctx.body = {
                ok: false,
                data: null,
                msg: '用户不存在！',
            };
        }
    },
};