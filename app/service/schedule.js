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
}

module.exports = ScheduleService;
