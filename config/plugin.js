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
};
