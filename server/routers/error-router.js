module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    switch (err.status) {
      case 401:
        ctx.body = {
          ok: false,
          data: '',
          msg: '请重新登录',
          code: 401,
        };
        break;
      default :
        break;
    }
  }
}; 