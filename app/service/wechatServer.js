'use strict';
const crypto = require('crypto'); // 引入加密模块
const Service = require('egg').Service;
const getRawBody = require('raw-body');

class WechatServerService extends Service {
  validateWechatConfig () {
    // 1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
    const { signature, timestamp, nonce, echostr } = this.ctx.query;
    // signature, //微信加密签名
    // timestamp, //时间戳
    // nonce, //随机数
    // echostr; //随机字符串

    // 2.将token、timestamp、nonce三个参数进行字典序排序
    const { token } = this.config.wechat;
    const array = [ token, timestamp, nonce ];
    array.sort();

    // 3.将三个参数字符串拼接成一个字符串进行sha1加密
    const tempStr = array.join('');
    const hashCode = crypto.createHash('sha1'); // 创建加密类型
    const resultCode = hashCode.update(tempStr, 'utf8').digest('hex'); // 对传入的字符串进行加密

    // 4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (resultCode === signature) {
      return echostr;
    }
    return `验证不成功, resultCode:${resultCode}, echostr:${echostr}`;

  }


  async handleWechatMsg () {
    // 取原始数据
    const { ctx } = this;
    const xml = await getRawBody(this.ctx.req, {
      length: ctx.request.length,
      limit: '1mb',
      encoding: ctx.request.charset || 'utf-8',
    });
    console.log(xml);
    const formatted = await this.ctx.helper.parseXML(xml);
    console.log(formatted);
    // ctx.body = 'success' // 一定要success，否则报错
    // ctx.type = 'application/xml';
    return (`<xml> 
    <ToUserName><![CDATA[${formatted.FromUserName}]]></ToUserName> 
    <FromUserName><![CDATA[${formatted.ToUserName}]]></FromUserName> 
    <CreateTime>${new Date().getTime()}</CreateTime> 
    <MsgType><![CDATA[text]]></MsgType> 
    <Content><![CDATA[这儿是学员中学]]></Content> 
    </xml>`);
  }
}

module.exports = WechatServerService;
