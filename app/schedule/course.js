'use strict';
const Subscription = require('egg').Subscription;

class CourseSchedule extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // cron: '0 0 10 * * *', // 10.0分执行一次
      cron: '0 0 21 * * *', // 21点分执行一次
      // interval: '10s', // 1 分钟间隔
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


    const myDate = new Date(); // 获取今天日期
    console.log('------------------------------时间-----------------------------------------------');
    console.log(myDate);

    // 获取1天后的日期
    myDate.setDate(myDate.getDate() + 1);
    const WEEK = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ];

    const dateStr = `${myDate.getMonth() + 1}月${myDate.getDate()}日`;

    const list = await ctx.service.schedule.fetchCurrentCourse();

    const { template_id } = this.config.schedule.course;
    const api = list.map(item => {
      const timeStr = `${dateStr}${WEEK[myDate.getDay()]}`;
      const lastTimeStr = (item.endTime && item.startTime) ? `${timeStr}${item.startTime}-${item.endTime}` : `${timeStr}${DAY_LABEL[item.time]}`;
      return {
        touser: item.openId,
        template_id,
        // url: 'http://yangjin-art.top/platform',
        data: {
          first: {
            value: `您好,${item.stu_name}同学,提醒您画画啦`,
          },
          keyword1: {
            value: item.name,
          },
          keyword2: {
            value: lastTimeStr,
          },
          remark: {
            value: '记得准时参加哦',
          },
        },
      };
    });
    const { access_token } = await ctx.service.wechat.wechatToken();
    api.forEach(data => {
      console.log('------------------------------data-----------------------------------------------');
      console.log(data);
      ctx.service.wechat.sendTemplateMsg({ access_token, data });
    });
    console.log('课程推送定时任务执行');
  }
}

module.exports = CourseSchedule;
