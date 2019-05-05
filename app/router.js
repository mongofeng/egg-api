'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/v1/auth/register', controller.auth.register);
  router.post('/v1/auth/login', controller.auth.login);

  // 通过 app.resources 方法，我们将 teacher 这个资源的增删改查接口映射到了 app/controller/teacher.js 文件
  router.resources('teacher', '/v1/teacher', controller.teacher);
  router.post('/v1/teacher/list', controller.teacher.list);

  // 通过 app.resources 方法，我们将 topics 这个资源的增删改查接口映射到了 app/controller/topics.js 文件
  router.resources('topics', '/api/v2/topics', app.controller.topics);

};
