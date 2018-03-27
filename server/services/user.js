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
        return userInfo.dataValues;
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
        await User.create({
            account: data.account,
            user_name: data.account,
            password: data.password,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return true;
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
