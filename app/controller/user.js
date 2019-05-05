'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async fetchUserInfo() {
    const { ctx } = this;
    const result = await ctx.service.auth.findUser(ctx.locals.userId);
    ctx.status = 200;
    ctx.body = result;
  }
}

module.exports = UserController;
