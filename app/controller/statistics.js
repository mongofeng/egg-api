'use strict';

const Controller = require('egg').Controller;

class StatisticsController extends Controller {
  /**
   * 学生统计
   */
  async stuCountByTime() {
    const { ctx } = this;
    const result = await ctx.service.statistics.stuCountByTime();
    ctx.status = 200;
    ctx.body = result;
  }


  async stuCountByStatus() {
    const { ctx } = this;
    const result = await ctx.service.statistics.stuCountByStatus();
    ctx.status = 200;
    ctx.body = result;
  }

  async hourCountByTime() {
    const { ctx } = this;
    const result = await ctx.service.statistics.hourCountByTime();
    ctx.status = 200;
    ctx.body = result;
  }

  async caculatePackage() {
    const { ctx } = this;
    const data = await ctx.service.statistics.caculatePackage(ctx.request.body);
    ctx.status = 200;
    ctx.body = {
      code: 1,
      msg: 'find success',
      data,
      desc: '获取成功',
    };
  }
}

module.exports = StatisticsController;
