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

  // 学生
  router.resources('student', '/v1/student', controller.student);
  router.post('/v1/student/list', controller.student.list);

  // 课程
  router.resources('course', '/v1/course', controller.course);
  router.post('/v1/course/list', controller.course.list);
  router.post('/v1/course/detailList', controller.course.detailList);
  router.post('/v1/course/deleteStudent', controller.course.delCoursesStudent);
  router.post('/v1/course/batchCourse', controller.course.batchCourses);


  // 课时
  router.resources('class-hour', '/v1/class-hour', controller.classHour);
  router.post('/v1/class-hour/list', controller.classHour.list);

  // 学时
  router.post('/v1/student-hour/list', controller.studentHour.list);
  router.get('/v1/student-hour/:id', controller.studentHour.show);

  // 当前用户信息
  router.get('/v1/user/userInfo', controller.user.fetchUserInfo);

  // 统计接口
  router.post('/v1/statistics/stuCountByTime', controller.statistics.stuCountByTime);
  router.post('/v1/statistics/stuCountByStatus', controller.statistics.stuCountByStatus);
  router.post('/v1/statistics/hourCountByTime', controller.statistics.hourCountByTime);


  // 微信
  router.get('/wechat/token', controller.wechat.fetchAccessToken);
  router.post('/wechat/openid', controller.wechat.fetchOpenId);
  router.post('/wechat/template', controller.wechat.sendTemplateMsg);

};
