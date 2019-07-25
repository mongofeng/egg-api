'use strict';

const Controller = require('egg').Controller;

class StudentPackageController extends Controller {
  // post列表   student/list
  async list() {
    const { ctx } = this;
    const result = await ctx.service.baseResful.list(ctx.model.StudentPackage);
    ctx.status = 200;
    ctx.body = result;
  }

  // post：增   student
  async create() {
    const { ctx } = this;
    const result = await ctx.service.baseResful.add(ctx.model.StudentPackage);
    ctx.status = 200;
    ctx.body = result;
  }

  // get：查   student/:id
  async show() {
    const { ctx } = this;
    const result = await ctx.service.baseResful.detail(ctx.model.StudentPackage);
    ctx.status = 200;
    ctx.body = result;
  }

  // put：改   student/:id
  async update() {
    const { ctx } = this;
    const result = await ctx.service.baseResful.update(ctx.model.StudentPackage);
    ctx.status = 200;
    ctx.body = result;
  }

  // delete：删   student/:id
  async destroy() {
    const { ctx } = this;
    const result = await ctx.service.baseResful.del(ctx.model.StudentPackage);
    ctx.status = 200;
    ctx.body = result;
  }
}

module.exports = StudentPackageController;
