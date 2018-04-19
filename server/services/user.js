const db = require('../db/db.js');

const userModel = '../models/user.js';
const datashopBase = db.datashop;
const User = datashopBase.import(userModel);
const model = {
  userName: '',
  password: '',
  type: '',
  rid: '',
  headerUrl: '',
};
module.exports = {
    async getUserById(id) {
        const userInfo = await User.findOne({
            where: {
                id,
            },
            attributes: ['id', 'headerUrl', 'account', 'rid', 'userName', 'type', 'createdAt', 'updatedAt'],
        });
        return userInfo;
    },
    async getUserByRid(rid) {
        const userInfo = await User.findOne({
            where: {
                rid,
            },
            attributes: ['id', 'headerUrl', 'account', 'rid', 'userName', 'type', 'createdAt', 'updatedAt'],
        });
        return userInfo;
    },
    async getOneUserInfo(data) {
      const where = {};
      Object.keys(model).forEach((key) => {
        if (data[key] || data[key] === 0) where[key] = data[key];
      });
      const userInfo = await User.findOne({
        where,
        attributes: ['id', 'headerUrl', 'account', 'rid', 'userName', 'type', 'createdAt', 'updatedAt'],
    });
    return userInfo;
    },
    async updateUserInfo(data) {
        const updata = {};
        Object.keys(model).forEach((key) => {
            if (data[key] || data[key] === 0) updata[key] = data[key];
          });
        const result = await User.update(
            {
                ...updata,
                updatedAt: new Date(),
            },
            {
                where: {
                    id: data.id,
                },
            },
        );
        return result[0] === 1;
    },
    async butchGetUserByIds(idArr) {
      const userInfos = await User.findAll({
          where: {
              id: {
                $in: idArr,
              },
          },
          attributes: ['id', 'headerUrl', 'account', 'rid', 'userName', 'type', 'createdAt', 'updatedAt'],
      });
      return userInfos;
  },
  async butchGetUserByRids(ridArr) {
    const userInfos = await User.findAll({
        where: {
            rid: {
              $in: ridArr,
            },
        },
        attributes: ['id', 'headerUrl', 'account', 'rid', 'userName', 'type', 'createdAt', 'updatedAt'],
    });
    return userInfos;
},
    async getUserByAccount(account) {
        const userInfo = await User.findOne({
            where: {
                account,
            },
            attributes: ['id', 'headerUrl', 'account', 'rid', 'userName', 'password', 'type', 'createdAt', 'updatedAt'],
        });
        return userInfo;
    },
    async getUserByName(userName) {
      const userInfo = await User.findAll({
          where: {
              userName: {
                $like: `%${userName}%`,
              },
          },
          attributes: ['id', 'headerUrl', 'account', 'rid', 'userName'],
      });
      return userInfo;
  },
    async addUser(data) {
        const ret = await User.create({
            account: data.account,
            userName: data.account,
            password: data.password,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return ret;
    },
    async updatePasswordById(userId, newPassword) {
        const data = {
          password: newPassword,
          updatedAt: new Date(),
        };
        const result = await User.update(
          data,
            {
                where: {
                    id: userId,
                },
            },
        );
        return result[0] === 1;
    },
};
