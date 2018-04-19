/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('system', {
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
    ownerRid: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    operatorRids: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    remarks: {
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
    applicantRids: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    webUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    modelUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    uiUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'system',
  });
};
