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
    errorHandler: {
      match: '/api',
    },

    // 自定义jwt:https://juejin.im/post/5c170f7ef265da614273ccb1
    jwt: {
      enable: true,
      ignore: [ '/v1/user/', '/public/' ], // 哪些请求不需要认证
    },

    security: {
      csrf: {
        // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
        enable: false,
      },
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
