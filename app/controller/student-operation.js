'use strict';

const Controller = require('egg').Controller;

class StudentOperationController extends Controller {
  async buy() {
    const { ctx } = this;
    const result = await ctx.service.studentOperation.buy();
    ctx.status = 200;
    ctx.body = result;
  }


  async sign() {
    const { ctx } = this;
    const result = await ctx.service.studentOperation.sign();
    ctx.status = 200;
    ctx.body = result;
  }


  async supplement() {
    const { ctx } = this;
    const result = await ctx.service.studentOperation.supplement();
    ctx.status = 200;
    ctx.body = result;
  }


  async sharePackage() {
    const { ctx } = this;
    const result = await ctx.service.studentOperation.sharePackage();
    ctx.status = 200;
    ctx.body = result;
  }
}

module.exports = StudentOperationController;
