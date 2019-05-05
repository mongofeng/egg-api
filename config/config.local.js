'use strict';

module.exports = appInfo => {
  const config = {};

  /**
   * @member Config#mongodb的配置
   * @property {String} KEY - description
   */
  config.mongoose = {
    client: {
      url: 'mongodb://localhost:27017/koa-api',
      options: {},
    },
  };

  return config;
};
