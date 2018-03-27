const userServer = require('../services/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const util = require('util');

const verify = util.promisify(jwt.verify); // 解密

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
                    ok: false,
                    data: null,
                    msg: '密码错误！',
                };
            } else {
                const userToken = {
                    account: userInfo.account,
                    name: userInfo.user_name,
                    id: userInfo.id,
                    systems: userInfo.systems || '',
                    kind: userInfo.kind,
                    createdAt: userInfo.createdAt,
                    updatedAt: userInfo.updatedAt,
                };
                const token = jwt.sign({
                    data: userToken,
                     // 设置 token 过期时间
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                }, 'data-shop-secret');
                ctx.body = {
                    ok: true,
                    data: {
                      token,
                      userInfo: userToken,
                    },
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
    async getUserInfo(ctx) {
      const token = ctx.header.authorization;
      if (token) {
        const payload = await verify(token.split(' ')[1], 'data-shop-secret');
        const userId = payload.data.id;
        const userInfo = await userServer.getUserById(userId);
        ctx.body = {
          ok: true,
          data: userInfo,
          msg: '',
        };
      } else {
        ctx.body = {
          ok: false,
          data: '',
          msg: '请重新登录',
        };
      }
    },
};