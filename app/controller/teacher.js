'use strict';

// Method	Path	Route Name	Controller.Action
// GET	/posts	posts	app.controllers.posts.index
// GET	/posts/new	new_post	app.controllers.posts.new
// GET	/posts/:id	post	app.controllers.posts.show
// GET	/posts/:id/edit	edit_post	app.controllers.posts.edit
// POST	/posts	posts	app.controllers.posts.create
// PUT	/posts/:id	post	app.controllers.posts.update
// DELETE	/posts/:id	post	app.controllers.posts.destroy

const Controller = require('egg').Controller;

class TeacherController extends Controller {
  // 列表
  // post   teacher/list
  async list() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.baseResful.list(ctx.model.Teacher);
    ctx.status = 200;
    ctx.body = result;
  }

  // post   teacher
  async create() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.baseResful.add(ctx.model.Teacher);
    ctx.status = 200;
    ctx.body = result;
  }

  // get   teacher/:id
  async show() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.baseResful.detail(ctx.model.Teacher);
    ctx.status = 200;
    ctx.body = result;
  }

  // put   teacher/:id
  async update() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.baseResful.update(ctx.model.Teacher);
    ctx.status = 200;
    ctx.body = result;
  }

  // delete   teacher/:id
  async destroy() {
    const { ctx } = this;
    // 调用 service 创建一个 baseResful
    const result = await ctx.service.baseResful.del(ctx.model.Teacher);
    ctx.status = 200;
    ctx.body = result;
  }
}

module.exports = TeacherController;
