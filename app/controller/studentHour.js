'use strict';

const Controller = require('egg').Controller;

class StudentHourController extends Controller {
  // post列表   student-hour/list
  async list() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.baseResful.list(ctx.model.StudentHour);
    ctx.status = 200;
    ctx.body = result;
  }


  // get：查   student-hour/:id
  async show() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.baseResful.detail(ctx.model.StudentHour, 'studentId');
    ctx.status = 200;
    ctx.body = result;
  }
}

module.exports = StudentHourController;
