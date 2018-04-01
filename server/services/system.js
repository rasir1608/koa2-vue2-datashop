const db = require('../db/db');

const systemModel = '../models/system.js';
const datashop = db.datashop;
const system = datashop.import(systemModel);

const systemServer = {
    async getSystemListPage(data) {
      const systemData = {
        id: '',
        owner: '',
        name: '',
        operators: '',
        createdAt: '',
        updatedAt: '',
      };
      const where = {};
      Object.keys(systemData).forEach((key) => {
        if (data.name) where.name = { $like: `%${data.name}%` };
        else if (data[key]) where[key] = data[key];
      });
      const ret = await system.findAndCountAll({
        where,
        offset: data.offset,
        limit: data.limit,
      });
      return ret;
    },
    async getAllByOperator(operatorRid) {
      const ret = await system.findAll({
        where: {
          operators: {
            $like: operatorRid,
          },
        },
      });
      return ret;
    },
    async getAllSystem() {
      const ret = await datashop.query('select * from datashop.system', { type: datashop.QueryTypes.SELECT });
      return ret;
    },
    async getSystemByName(name) {
      const ret = await system.findOne({
        where: {
          name,
        },
      });
      return ret;
    },
    async getOneSystem(data) {
      const ret = await system.findOne({
        where: {
          ...data,
        },
      });
      return ret;
    },
    async delSystemById(id) {
      const ret = await system.destroy({
        where: {
          id,
        },
      });
      return ret === 1;
    },
    async createSystem(systemData) {
      const ret = await system.create({
          ownerRid: systemData.ownerRid,
          name: systemData.name,
          operatorRids: systemData.operatorRids,
          remarks: systemData.remarks,
          createdAt: new Date(),
          updatedAt: new Date(),
      });
      return ret;
    },
    async updateSystem(systemData) {
      const data = {
        ownerRid: '',
        name: '',
        operatorRids: '',
        rid: '',
      };
      Object.keys(data).forEach((key) => {
        if (systemData[key] === '') data[key] = null;
        else if (systemData[key]) data[key] = systemData[key];
      });
      data.updatedAt = new Date();
      const ret = await system.update(
        data,
        { where: {
          id: systemData.id,
        } });
      return ret[0] === 1;
    },
};

module.exports = systemServer;