'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async fetchUserInfo() {
    const { ctx } = this;
    ctx.logger.info('ctx.locals.userId', ctx.locals.userId);
    const result = await ctx.service.auth.findUser(ctx.locals.userId, 'userId');

    if (!result) {
      const errorMsg = {
        code: 0,
        msg: 'account is exit!',
        desc: '账号已经存在',
      };
      ctx.throw(403, errorMsg);
    }
    ctx.logger.debug('some response data: %j', result);
    const { status, account, name, mobile, userId } = result;
    ctx.status = 200;
    ctx.body = {
      code: 1,
      msg: 'success',
      desc: '获取成功',
      data: { status, account, name, mobile, userId },
    };
  }
}

module.exports = UserController;
