'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('/register', '/v1/auth/register', controller.auth.register);
  router.post('/login', '/v1/auth/login', controller.auth.login);

  // 通过 app.resources 方法，我们将 topics 这个资源的增删改查接口映射到了 app/controller/topics.js 文件
  router.resources('topics', '/api/v2/topics', app.controller.topics);

};
