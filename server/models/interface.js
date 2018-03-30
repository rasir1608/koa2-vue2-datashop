/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('interface', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    rid: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'GET',
    },
    contentType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    creatorRid: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    opratorRid: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    request: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    systemRid: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: 'interface',
  });
};
