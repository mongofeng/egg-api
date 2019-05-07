'use strict';

const Controller = require('egg').Controller;
// 定义创建接口的请求参数规则
const loginRule = {
  account: 'string',
  password: 'string',
};


const registryRule = {
  ...loginRule,
  mobile: 'string',
  name: 'string',
};

class AuthController extends Controller {
  /**
   * 登录
   */
  async login() {
    const { ctx } = this;
    ctx.logger.info('some request data: %j', ctx.request.body);
    const body = ctx.request.body;
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    ctx.validate(loginRule, body);
    const { account, password } = body;

    // 调用 service 创建一个 auth
    const result = await ctx.service.auth.find({ account, password });
    ctx.status = 200;
    ctx.body = result;
  }

  /**
   * 注册
   */
  async register() {
    const { ctx } = this;

    ctx.logger.info('some request data: %j', ctx.request.body);
    ctx.logger.warn('WARNNING!!!!');
    const body = ctx.request.body;
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    ctx.validate(registryRule, body);
    const { account, password, mobile, name } = body;

    // 调用 service 创建一个 auth
    const result = await ctx.service.auth.registry({ account, password, mobile, name });
    ctx.status = 200;
    ctx.body = result;

  }
}

module.exports = AuthController;
