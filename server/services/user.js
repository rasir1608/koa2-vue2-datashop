const db = require('../db/db.js');

const userModel = '../models/user.js';
const todolistDb = db.todoList;
const User = todolistDb.import(userModel);

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
        const userInfo = await User.findOne({
            where: {
                account,
            },
        });
        return userInfo;
    },
    async addUser(data) {
        await User.create({
            user_name: data.userName,
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
