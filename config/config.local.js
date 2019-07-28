'use strict';
// 自定义环境配置:https://eggjs.org/zh-cn/basics/env.html
module.exports = appInfo => {
  const config = {
    // 更换端口
    cluster: {
      listen: {
        port: 7777,
        hostname: '0.0.0.0',
      },
    },
  };

  /**
   * @member Config#mongodb的配置
   * @property {String} KEY - description
   */
  config.mongoose = {
    client: {
      url: 'mongodb://localhost:27017/education',
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
      template_id: 'HS3-DZGGG2zkpOq0O4ymQwOg2PNN0cbHaAmJCxJZycM',
    },
    sign: {
      template_id: 'yMWwcsc25qNY-24GYSD_KTvVbFIQFPLZuzzP_YyXTgM',
    },
    package: {
      template_id: 'JVkTSFKlbgG5I8OZ6EGW69X0shbkJPqHg0Zx9N4m5OM',
    },
    supplement: {
      template_id: '6T2JA3Zm8iIUM9DoqYEUb4FIW7uRGG8jTUbPgXAYRsI',
    },
  };

  return config;
};
