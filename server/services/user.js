const db = require('../db/db.js');

const userModel = '../models/user.js';
const datashopBase = db.datashop;
const User = datashopBase.import(userModel);

module.exports = {
    async getUserById(id) {
        const userInfo = await User.findOne({
            where: {
                id,
            },
            attributes: ['id', 'account', 'user_name', 'systems', 'kind', 'createdAt', 'updatedAt'],
        });
        return userInfo;
    },
    async updateUserInfo(data) {
        const model = {
            user_name: '',
            systems: '',
            password: '',
            kind: '',
        };
        const updata = {};
        Object.keys(model).forEach((key) => {
            if (key === 'user_name') {
                if (data.userName) updata[key] = data.userName;
            } else {
                if (data[key] || data[key] === 0) updata[key] = data[key];
            }
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
          attributes: ['id', 'account', 'user_name', 'systems', 'kind', 'createdAt', 'updatedAt'],
      });
      return userInfos;
  },
    async getUserByAccount(account) {
        const userInfo = await User.findOne({
            where: {
                account,
            },
            attributes: ['id', 'account', 'user_name', 'password', 'systems', 'kind', 'createdAt', 'updatedAt'],
        });
        return userInfo;
    },
    async addUser(data) {
        const ret = await User.create({
            account: data.account,
            user_name: data.account,
            password: data.password,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return ret;
    },
    async updatePasswordById(userId, newPassword) {
        const result = await User.update(
            { password: newPassword },
            {
                where: {
                    id: userId,
                },
            },
        );
        return result[0] === 1;
    },
};
