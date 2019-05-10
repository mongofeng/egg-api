'use strict';

const Controller = require('egg').Controller;

class WechatServerController extends Controller {
  async index() {
    const { ctx } = this;
    const result = ctx.service.wechatServer.validateWechatConfig();
    ctx.status = 200;
    ctx.body = result;
  }

  async create() {
    const { ctx } = this;
    const result = await ctx.service.wechatServer.handleWechatMsg();
    // ctx.status = 200;
    ctx.type = 'application/xml';
    ctx.body = result;
  }
}

module.exports = WechatServerController;
