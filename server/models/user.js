/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    rid: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    account: {
      type: DataTypes.CHAR(50),
      allowNull: false,
    },
    userName: {
      type: DataTypes.CHAR(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.CHAR(128),
      allowNull: false,
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
    },
  }, {
    tableName: 'user',
  });
};
