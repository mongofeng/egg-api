'use strict';

const Controller = require('egg').Controller;

class CourseController extends Controller {
  // post列表   course/list
  async list() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.baseResful.list(ctx.model.Course);
    ctx.status = 200;
    ctx.body = result;
  }

  // post：增   course
  async create() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.course.add();
    ctx.status = 200;
    ctx.body = result;
  }

  // get：查   course/:id
  async show() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.baseResful.detail(ctx.model.Course);
    ctx.status = 200;
    ctx.body = result;
  }

  // put：改   course/:id
  async update() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.baseResful.update(ctx.model.Course);
    ctx.status = 200;
    ctx.body = result;
  }

  // delete：删   course/:id
  async destroy() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.baseResful.del(ctx.model.Course);
    ctx.status = 200;
    ctx.body = result;
  }


  /**
   * 特有功能
   * 取消学生对课程的关联
   */
  async delCoursesStudent() {
    const { ctx } = this;
    const result = await ctx.service.course.delCoursesStudent();
    ctx.status = 200;
    ctx.body = result;
  }

  /**
   * 包含老师姓名的课程列表
   */
  async detailList() {
    const { ctx } = this;
    const result = await ctx.service.course.list();
    ctx.status = 200;
    ctx.body = result;
  }
}

module.exports = CourseController;
