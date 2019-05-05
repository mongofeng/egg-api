'use strict';

const Controller = require('egg').Controller;

class ClassHourController extends Controller {
  // post列表   class-hour/list
  async list() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.baseResful.list(ctx.model.ClassHour);
    ctx.status = 200;
    ctx.body = result;
  }

  // post：增   class-hour
  async create() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.classHour.add();
    ctx.status = 200;
    ctx.body = result;
  }

  // get：查   class-hour/:id
  async show() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.baseResful.detail(ctx.model.ClassHour);
    ctx.status = 200;
    ctx.body = result;
  }
}

module.exports = ClassHourController;
