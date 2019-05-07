'use strict';

const Controller = require('egg').Controller;

class WechatController extends Controller {
  async fetchAccessToken() {
    const { ctx } = this;
    const result = await ctx.service.wechat.fetchAccessToken();

    ctx.status = 200;
    ctx.body = result;
  }
}

module.exports = WechatController;
