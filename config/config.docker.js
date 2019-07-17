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
  };

  // 微信的配置
  config.wechat = {
    appid: 'wx9bb9b35bb6d4f980',
    secret: '9a1b5839cba147e16d088ec98853951e',
    token: 'wechat', // 消息服务号需要的token
    grant_type: 'client_credential', // 默认
    defalult_url: 'https://api.weixin.qq.com/',
    mp_url: 'https://mp.weixin.qq.com/',
  };

  // 定时任务的配置
  config.schedule = {
    course: {
      template_id: 'HS3-DZGGG2zkpOq0O4ymQwOg2PNN0cbHaAmJCxJZycM', // 上课提醒
    },
    sign: {
      template_id: 'yMWwcsc25qNY-24GYSD_KTvVbFIQFPLZuzzP_YyXTgM', // 签到提醒
    },
  };

  return config;
};
