'use strict';
const Subscription = require('egg').Subscription;

class CourseSchedule extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // cron: '0 0 10 * * *', // 10.0分执行一次
      cron: '0 30 8 * * *', // 8.30分执行一次
      // interval: '1m', // 1 分钟间隔
      type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { ctx } = this;

    const DAY_LABEL = {
      1: '上午',
      2: '下午',
      3: '晚上',
    };

    const list = await ctx.service.schedule.fetchCurrentCourse();
    console.log(list);
    const { template_id } = this.config.schedule.course;
    const api = list.map(item => {
      return {
        touser: item.openId,
        template_id,
        url: 'http://yangjin-art.top/platform',
        data: {
          first: {
            value: `您好,${item.stu_name}同学,你今天的课程安排来了`,
            color: '#1d1d1d',
          },
          keyword1: {
            value: item.name,
            color: '#173177',
          },
          keyword2: {
            value: (item.endTime && item.startTime) ? `${item.startTime}-${item.endTime}` : DAY_LABEL[item.time],
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

module.exports = CourseSchedule;
