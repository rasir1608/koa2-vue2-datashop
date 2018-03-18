const path = require('path');
const fs = require('fs');

const whiteRouter = [];
module.exports = () => async (ctx, next) => {
        await next();
        if (ctx.status === 404) {
           if (whiteRouter.length > 0) {
            whiteRouter.forEach((url) => {
                const reg = new RegExp(`^/${url}`, 'i');
                if (reg.test(ctx.url)) {
                    ctx.type = 'text/html'; 
                    ctx.body = fs.createReadStream(path.resolve(__dirname, '../../public/index.html'));
                }
            });
           } else {
            ctx.type = 'text/html'; 
            ctx.body = fs.createReadStream(path.resolve(__dirname, '../../public/index.html'));
           }
        }
    };