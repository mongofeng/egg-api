'use strict';
// 自定义环境配置:https://eggjs.org/zh-cn/basics/env.html
module.exports = appInfo => {
  const config = {};

  /**
   * @member Config#mongodb的配置
   * @property {String} KEY - description
   */
  config.mongoose = {
    client: {
      url: 'mongodb://database:27017/education',
      options: {},
    },

    // 微信的配置
    wechat: {
      appid: 'wx9bb9b35bb6d4f980',
      secret: '9a1b5839cba147e16d088ec98853951e',
      token: 'wechat', // 消息服务号需要的token
      grant_type: 'client_credential', // 默认
      defalult_url: 'https://api.weixin.qq.com/',
      mp_url: 'https://mp.weixin.qq.com/',
    },
  };

  return config;
};
