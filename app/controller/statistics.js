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
}

module.exports = StatisticsController;
