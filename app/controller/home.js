'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const token = ctx.helper.createToken({ userId: 1111 }); // token生成
    console.log(ctx);
    ctx.body = token;
  }
}

module.exports = HomeController;
