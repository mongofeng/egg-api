'use strict';
const Subscription = require('egg').Subscription;

class CourseSchedule extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      cron: '0 0 10 * * *', // 10.0分执行一次
      type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { ctx } = this;

    const person = [
      'oVB5Ow4k7ktizMVifdH5zjVT9EQ4', // 林兄
      'oVB5OwyVDKfTZq4T61_p2roSg1tA', // ziji
    ];

    const list = person.map(item => {
      return {
        touser: item,
        template_id: 'LGHVsyKEBAsk79EDA2surQhWVSGl-oSq-MtPJ4fe1r0',
        url: 'http://47.107.144.222/platform',
        data: {
          course: {
            value: '素描课程',
            color: '#173177',
          },
          time: {
            value: '14:30',
            color: '#1d1d1d',
          },
          teacher: {
            value: '小羊老师',
            color: '#1d1d1d',
          },
          remark: {
            value: '记得上课哦，不要迟到的啦！每天9点准点提醒hhhhh',
            color: '#173177',
          },
        },
      };
    });


    // {
    //   "touser": "oVB5OwyVDKfTZq4T61_p2roSg1tA",
    //   "template_id": "LGHVsyKEBAsk79EDA2surQhWVSGl-oSq-MtPJ4fe1r0",
    //   "url": "http://47.107.144.222/platform",
    //   "data": {
    //     "course": {
    //       "value": "素描课程",
    //       "color": "#173177"
    //     },
    //     "time": {
    //       "value": "14:30",
    //       "color": "#1d1d1d"
    //     },
    //     "teacher": {
    //       "value": "小羊老师",
    //       "color": "#1d1d1d"
    //     },
    //     "remark": {
    //       "value": "记得上课哦，不要迟到的啦！",
    //       "color": "#173177"
    //     }
    //   }
    // }


    const { access_token } = await ctx.service.wechat.wechatToken();
    list.forEach(data => {
      ctx.service.wechat.sendTemplateMsg({ access_token, data });
    });
    console.log('定时任务执行');
    console.log('wechat 定时任务执行');
  }
}

module.exports = CourseSchedule;
