'use strict';

const Controller = require('egg').Controller;

class WechatController extends Controller {
  async fetchAccessToken() {
    const { ctx } = this;
    const result = await ctx.service.wechat.wechatToken();
    // const result = await ctx.service.wechat.fetchAccessToken();
    ctx.status = 200;
    ctx.body = result;
  }


  async fetchOpenId() {
    const { ctx } = this;
    const { code } = ctx.request.body;
    const result = await ctx.service.wechat.fetchOpenId(code);
    ctx.status = 200;
    ctx.body = result;
  }

  async sendTemplateMsg() {
    const { ctx } = this;
    const data = ctx.request.body;
    const { access_token } = await ctx.service.wechat.wechatToken();
    const result = await ctx.service.wechat.sendTemplateMsg({ access_token, data });
    ctx.status = 200;
    ctx.body = result;
  }
}

module.exports = WechatController;
