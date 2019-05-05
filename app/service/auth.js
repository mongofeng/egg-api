'use strict';

const Service = require('egg').Service;
const uuidv1 = require('uuid/v1');

class AuthService extends Service {
  async find({ password, account }) {
    // 获取用户的 userId和密码，找不到为null
    const { ctx } = this;
    const user = await this.findUser(account);
    if (!user) {
      const errorMsg = {
        code: 0,
        msg: 'account is not exit!',
        desc: '账号不存在',
        data: user,
      };
      ctx.throw(403, errorMsg);
    }

    const result = this.validate({
      account,
      password,
      userId: user.userId,
      dbPassword: user.password,
    });

    return result;
  }


  /**
   * 注册用户
   * @param {*} param0 a
   */
  async registry({ account, password, mobile, name }) {
    // 获取用户的 userId和密码，找不到为null
    const { ctx } = this;
    const user = await this.findUser(account);
    if (user) {
      const errorMsg = {
        code: 0,
        msg: 'account is exit!',
        desc: '账号已经存在',
      };
      ctx.throw(403, errorMsg);
    }

    // 插入新用户
    const userId = uuidv1();

    // 加密密码
    const hash = await ctx.helper.encrypt(password);
    await ctx.model.Auth.create({ account, password: hash, userId, mobile, name });
    return {
      code: 1,
      msg: 'insert success',
      desc: '注册成功',
    };
  }


  async validate({ password, dbPassword, userId, account }) {
    const { ctx } = this;
    // 验证密码的正确性
    const match = await ctx.helper.validate(password, dbPassword);
    if (match) {
      const token = ctx.helper.createToken({
        userId,
      });
      return {
        code: 1,
        msg: 'login success',
        desc: '登录成功',
        data: {
          token,
        },
      };
    }

    ctx.throw(403,
      {
        code: 0,
        desc: '账号或者密码错误,请输入正确的',
        msg: 'account or password error!',
        data: {
          account,
          password,
        },
      });
  }

  // 查找用户
  async findUser(account) {
    const { ctx } = this;
    return await ctx.model.Auth.findOne({
      account,
    });
  }
}

module.exports = AuthService;
