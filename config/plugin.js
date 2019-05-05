'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  // 开启 validate 插件
  validate: {
    enable: true,
    package: 'egg-validate',
  },

  // 开启 mongoose 插件
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },

  // 开启跨域
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};
