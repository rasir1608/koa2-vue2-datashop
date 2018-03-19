const Sequelize = require('sequelize');

const datashop = new Sequelize('mysql://root:123456@localhost/datashop', {
    // define: {
    //     timestamps: false, // 取消Sequelzie自动给数据表加入时间戳（createdAt以及updatedAt）
    //   },
});

module.exports = { datashop };