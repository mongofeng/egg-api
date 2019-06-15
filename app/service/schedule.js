'use strict';

const Service = require('egg').Service;

class ScheduleService extends Service {
  async sendTemplate() {
    const { ctx } = this;
    const data = await ctx.model.Student.find({
      status: 1,
      isSendTemplate: true,
    });
    console.log(data);
  }

  // 上课提醒
  async sendCourse() {
    const { ctx } = this;
    const data = await ctx.model.Course.find({
      startDate: {
        $lte: new Date().getTime(),
      },
      endDate: {
        $gte: new Date().getTime(),
      },
      day: new Date().getDay(),
    });
    console.log(data);
  }
}

module.exports = ScheduleService;
