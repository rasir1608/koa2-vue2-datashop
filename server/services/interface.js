const db = require('../db/db');

const interfaceModel = '../models/interface.js';
const datashop = db.datashop;
const interfaceDb = datashop.import(interfaceModel);
const model = {
    name: '',
    url: '',
    rid: '',
    method: '',
    contentType: '',
    creatorRid: '',
    opratorRid: '',
    request: '',
    response: '',
    systemRid: '',
    remark: '',
    createdAt: '',
    updatedAt: '',
};

const interfaceServer = {
    async insertInterface(data) {
        const iDate = {};
        Object.keys(model).forEach((key) => {
            if (data[key] || data[key] === 0) iDate[key] = data[key];
        });
        const ret = await interfaceDb.create({
            ...iDate,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return ret;
    },
    async updateInterface(data) {
        const id = data.id;
        delete data.id;
        data.updatedAt = new Date();
        const ret = await interfaceDb.update(
            data,
            {
                where: {
                    id,
                },
            },
            
        );
        return ret[0] === 1;
    },
    async findOneInterface(data) {
        const ret = await interfaceDb.findOne({
            where: {
                ...data,
            },
        });
        return ret;
    },
    async pageInterface(data) {
        const iData = {};
        Object.keys(model).forEach((key) => {
            if (data[key] || data[key] === 0) iData[key] = data[key];
        });
        if (iData.name) iData.name = { $like: `%${iData.name}%` };
        if (iData.rid) iData.rid = { $like: `%${iData.rid}%` };
        const ret = await interfaceDb.findAndCountAll({
            where: {
                ...iData,
            },
            offset: data.offset,
            limit: data.limit,
        });
        return ret;
    },
};

module.exports = interfaceServer;