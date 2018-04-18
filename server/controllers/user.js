const userServer = require('../services/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const util = require('util');
const tool = require('../utils');

const verify = util.promisify(jwt.verify); // 解密
const salt = bcrypt.genSaltSync(10);
module.exports = {
    async getUserInfoById(ctx) {
        const id = ctx.params.id;
        const result = await userServer.getUserById(id);
        if (result) {
          ctx.body = {
            ok: true,
            data: result,
            msg: '',
          };
        } else {
          ctx.body = {
            ok: true,
            data: '',
            msg: '获取信息失败',
          };
        }
    },
    async getUserInfoByName(ctx) {
      const userName = ctx.query.userName;
      const result = await userServer.getUserByName(userName);
      if (result) {
        ctx.body = {
          ok: true,
          data: result,
          msg: '',
        };
      } else {
        ctx.body = {
          ok: true,
          data: '',
          msg: '获取信息失败',
        };
      }
  },
    async getUserInfoByRid(ctx) {
      const rid = ctx.params.rid;
      const result = await userServer.getOneUserInfo({ rid });
      if (result) {
        ctx.body = {
          ok: true,
          data: result,
          msg: '',
        };
      } else {
        ctx.body = {
          ok: true,
          data: '',
          msg: '获取信息失败',
        };
      }
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
            const hash = bcrypt.hashSync(userInfo.password, salt);
            const user = await userServer.addUser({
                account: userInfo.account,
                password: hash,
            });
            const rid = tool.getRid(user.getDataValue('id'));
            const upUser = await userServer.updateUserInfo({
              id: user.id,
              rid,
            });
            if (upUser) {
              ctx.body = {
                ok: true,
                data: upUser,
                msg: '账号保存成功',
              };
            } else {
              ctx.body = {
                ok: true,
                data: '',
                msg: '账号保存失败',
              };
            }
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
                    userName: userInfo.userName,
                    id: userInfo.id,
                    kind: userInfo.kind,
                    rid: userInfo.rid,
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
    async updatePassword(ctx) {
      const password = ctx.request.body;
      const account = password.account;
      const user = await userServer.getUserByAccount(account);
      if (user && bcrypt.compareSync(password.oldPassword, user.password)) {
        const newPassword = password.newPassword;
        const hash = bcrypt.hashSync(newPassword, salt);
        const upUser = userServer.updateUserInfo({
          id: user.id,
          password: hash,
        });
        if (upUser) {
          ctx.body = {
            ok: true,
            data: '',
            msg: '密码修改成功',
          };
        } else {
          ctx.body = {
            ok: false,
            data: '',
            msg: '密码修改失败',
          };
        }
      } else {
        ctx.body = {
          ok: false,
          data: '',
          msg: '旧密码输入有误！',
        };
      }
    },
};