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

  return config;
};
