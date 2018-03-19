const db = require('../db/db.js');

const userModel = '../models/user.js';
const datashopBase = db.datashop;
const User = datashopBase.import(userModel);

export default {
    async getUserById(id) {
        const userInfo = await User.findOne({
            where: {
                id,
            },
        });
        return userInfo;
    },
    async getUserByAccount(account) {
        console.log(17, account);
        const userInfo = await User.findOne({
            where: {
                account,
            },
        });
        return userInfo;
    },
    async addUser(data) {
        await User.create({
            account: data.account,
            user_name: data.account,
            password: data.password,
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
