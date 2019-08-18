'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // student-package: studentPackage
  router.post('/v1/auth/register', controller.auth.register);
  router.post('/v1/auth/login', controller.auth.login);

  router.resources('teacher', '/v1/teacher', controller.teacher);
  router.post('/v1/teacher/list', controller.teacher.list);

  // 学生
  router.resources('student', '/v1/student', controller.student);
  router.post('/v1/student/list', controller.student.list);
  router.put('/v1/student/bindingWechat/:id', controller.student.bindingWechat);

  // 课程包
  router.resources('package', '/v1/package', controller.package);
  router.post('/v1/package/list', controller.package.list);


  // 课程包使用的统计
  router.resources('student-package', '/v1/student-package', controller.studentPackage);
  router.post('/v1/student-package/list', controller.studentPackage.list);

  // 课程
  router.resources('course', '/v1/course', controller.course);
  router.post('/v1/course/list', controller.course.list);
  router.post('/v1/course/detailList', controller.course.detailList);
  router.post('/v1/course/deleteStudent', controller.course.delCoursesStudent);
  router.post('/v1/course/batchCourse', controller.course.batchCourses);


  // 课时
  router.resources('course-hour-flow', '/v1/course-hour-flow', controller.courseHourFlow);
  router.post('/v1/course-hour-flow/list', controller.courseHourFlow.list);


  // 当前用户信息
  router.get('/v1/user/userInfo', controller.user.fetchUserInfo);

  // 统计接口
  router.post('/v1/statistics/stuCountByTime', controller.statistics.stuCountByTime);
  router.post('/v1/statistics/stuCountByStatus', controller.statistics.stuCountByStatus);
  router.post('/v1/statistics/hourCountByTime', controller.statistics.hourCountByTime);
  router.post('/v1/statistics/caculatePackage', controller.statistics.caculatePackage);

  // 课时操作行为
  router.post('/v1/student-operation/buy', controller.studentOperation.buy);
  router.post('/v1/student-operation/sign', controller.studentOperation.sign);
  router.post('/v1/student-operation/supplement', controller.studentOperation.supplement);
  router.post('/v1/student-operation/share-package', controller.studentOperation.sharePackage);

  router.post('/v1/student-operation/activate-package', controller.studentOperation.activatePackage);

  // ----------------------------------------以下为微信接口-------------------------------------------------------
  // 微信
  router.get('/wechat/token', controller.wechat.fetchAccessToken);
  router.post('/wechat/openid', controller.wechat.fetchOpenId);
  router.post('/wechat/userInfo', controller.wechat.fetchUserInfo);
  router.post('/wechat/template', controller.wechat.sendTemplateMsg);
  router.get('/wechat/template/list', controller.wechat.fetchTemplateList);

  // 微信消息接口
  router.resources('server', '/wechat/server', controller.wechatServer);

  // 微信用户接口
  // 学生
  router.resources('student', '/wechat/student', controller.student);
  router.post('/wechat/student/list', controller.student.list);
  router.put('/wechat/student/bindingWechat/:id', controller.student.bindingWechat);

  // 课程
  router.post('/wechat/course/list', controller.course.list);

  // 课时
  router.post('/wechat/course-hour-flow/list', controller.courseHourFlow.list);
  router.get('/wechat/course-hour-flow/:id', controller.courseHourFlow.show);

  // 课时统计
  router.post('/wechat/student-package/list', controller.studentPackage.listDetail);
  router.post('/wechat/student-package/simple-list', controller.studentPackage.list);
  router.post('/wechat/statistics/caculatePackage', controller.statistics.caculatePackage);

};
