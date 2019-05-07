'use strict';

const Service = require('egg').Service;

class WechatService extends Service {
  constructor(props) {
    super(props);
    this.getformWechat = this.getformWechat.bind(this);
    this.updateWechatToken = this.updateWechatToken.bind(this);
  }
  /**
   * 获取access_token
   * 不需要配置服务器
   */
  async fetchAccessToken() {
    const { appid, secret, grant_type, prefix } = this.config.wechat;
    const url = `${prefix}token?grant_type=${grant_type}&appid=${appid}&secret=${secret}`;
    const result = await this.ctx.curl(url, {
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });

    this.checkSuccess(result);
    return result.data;
  }

  /**
   * 获取openid
   * @param  { string } code [调用获取openid的接口需要code参数]
   * @return { object } {"access_token":"19_zSeQOVywxOGrOmddJNn7H-347BgCk8VKqvB2xgnHNxzTePDedlz9zTWxTTCr7lmqEjmkHlFib8CMniVdGicbaw","expires_in":7200,"refresh_token":"19_4YhFr5l4qDaqDSeuErhaxPP-7dqOM2t5jiOhBl3eaZsPu7acxIqsxuDJfyc9_7wccJr6aqq5R73k6k5XCA2nFA","openid":"oVB5OwyVDKfTZq4T61_p2roSg1tA","scope":"snsapi_base"}
   */
  async fetchOpenId(code) {
    const { appid, secret, defalult_url } = this.config.wechat;
    const url = `${defalult_url}/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;
    const result = await this.ctx.curl(url, {
      dataType: 'json',
    });
    console.log(result);
    this.checkSuccess(result);
  }

  /**
   * 发送模板消息
   * @param {*} param0 token, data
   */
  async sendTemplateMsg({ access_token, data }) {
    const { prefix } = this.config.wechat;
    const url = `${prefix}message/template/send?access_token=${access_token}`;
    const result = await this.ctx.curl(url, {
      // 必须指定 method
      method: 'POST',
      // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      contentType: 'json',
      data,
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });
    this.checkSuccess(result);
    // {errcode: 0, errmsg: "ok", msgid: 731267919140847600}
    // {errcode: 40003, errmsg: "invalid openid hint: [q14a3a0311shc2]"}
    if (result.data && result.data.errorMsg !== 'ok') {
      this.ctx.throw(403, result.data);
    }
    return result.data;
  }

  // 封装统一的调用检查函数，可以在查询、创建和更新等 Service 中复用
  checkSuccess(result) {
    if (result.status !== 200) {
      const errorMsg =
        result.data && result.data.error_msg
          ? result.data.error_msg
          : 'unknown error';
      this.ctx.throw(result.status, errorMsg);
    }
  }

  /**
   * 获取token的函数
   */
  async wechatToken() {
    const data = await this.ctx.model.Wechat.findOne({ name: 'wechat_token' });
    const fun = this.ctx.helper.compose(
      this.getformWechat,
      this.updateWechatToken,
      this.getformDatabase
    );
    const result = await fun(data);
    return result;
  }

  // 数据库里面没有
  async getformWechat(data) {
    if (!data) {
      const { access_token, expires_in } = await this.fetchAccessToken();
      await this.ctx.model.Wechat.create({ access_token, expires_in });
      // console.log('从微信拿的，初始化数据库');
      return { access_token, expires_in, msg: '从微信拿的，初始化数据库' };
    }
    return 'next';
  }

  // 数据库里面有,但是已经失效了
  async updateWechatToken(data) {
    const now = new Date();
    const currentDate = now.getTime();
    const updateDate = data.updateDate.getTime();
    const expires = currentDate - updateDate;
    if (expires > updateDate.expires_in * 1000) {
      const { access_token, expires_in } = await this.fetchAccessToken();
      const params = { access_token, expires_in };
      await this.ctx.model.Wechat.update(
        { name: 'wechat_token' },
        { $set: params },
        { upsert: false, multi: false }
      );
      // console.log('从微信更新到数据库里面');
      return {
        access_token,
        expires_in,
        updateDate: now,
        meg: '从微信更新到数据库里面',
      };
    }
    return 'next';
  }

  // 数据库里面有没有失效
  async getformDatabase(data) {
    const { access_token, expires_in, updateDate } = data;
    // console.log("没有更新token,直接在数据库里面拿的");
    return {
      access_token,
      expires_in,
      updateDate,
      msg: '没有更新token,直接在数据库里面拿的',
    };
  }
}

module.exports = WechatService;
