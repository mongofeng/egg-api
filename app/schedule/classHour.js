'use strict';
const Subscription = require('egg').Subscription;

class ClassHourSchedule extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      disable: true, // 配置该参数为 true 时，这个定时任务不会被启动。
      cron: '0 30 8 * * *', // 8.30分执行一次
      // interval: '1m', // 1 分钟间隔
      type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { ctx } = this;

    const list = await ctx.service.schedule.fetchCurrentCourse();
    const { template_id } = this.config.schedule.course;
    console.log(list);
    const api = list.map(item => {
      return {
        touser: item.openId,
        template_id,
        url: 'http://47.107.144.222/platform',
        data: {
          course: {
            value: item.name,
            color: '#173177',
          },
          time: {
            value: item.time,
            color: '#1d1d1d',
          },
          teacher: {
            value: item.teacher_name,
            color: '#1d1d1d',
          },
          remark: {
            value: item.desc,
            color: '#173177',
          },
        },
      };
    });

    const { access_token } = await ctx.service.wechat.wechatToken();
    api.forEach(data => {
      ctx.service.wechat.sendTemplateMsg({ access_token, data });
    });
    console.log('定时任务执行');
    console.log('wechat 定时任务执行');
  }
}

module.exports = ClassHourSchedule;
