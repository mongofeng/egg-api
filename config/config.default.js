/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1556184009096_8684';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    myAppName: 'egg-api',

    // 加载 errorHandler 中间件
    middleware: [ 'errorHandler', 'jwt' ],

    // 只对 /api 前缀的 url 路径生效
    // errorHandler: {
    //   match: '/v1',
    // },

    // 自定义jwt:https://juejin.im/post/5c170f7ef265da614273ccb1
    jwt: {
      enable: true,
      ignore: [ '/v1/auth/', '/public/', '/wechat/' ], // 哪些请求不需要认证
    },

    security: {
      csrf: {
        // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
        enable: false,
      },
      domainWhiteList: [ 'http://localhost:3000' ],
    },

    // mongodb的配置
    mongoose: {
      client: {
        // url: 'mongodb://koa-admin:131415@localhost:27017/koa-api',
        url: 'mongodb://localhost:27017/education',
        options: {},
      },
    },

    // 跨域的配置
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },

    // 更换端口
    cluster: {
      listen: {
        port: 3330,
        hostname: '0.0.0.0',
      },
    },

    // 微信的配置
    wechat: {
      // appid: 'wx6bce565776a81ced',
      // secret: 'b2b49cfc626b99a42536837928a32893',
      appid: 'wx9bb9b35bb6d4f980',
      secret: '9a1b5839cba147e16d088ec98853951e',
      token: 'wechat', // 消息服务号需要的token
      grant_type: 'client_credential', // 默认
      defalult_url: 'https://api.weixin.qq.com/',
      mp_url: 'https://mp.weixin.qq.com/',
    },

    // 定时任务的配置
    schedule: {
      course: {
        template_id: 'LGHVsyKEBAsk79EDA2surQhWVSGl-oSq-MtPJ4fe1r0',
      },
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
