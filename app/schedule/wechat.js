'use strict';
const Subscription = require('egg').Subscription;

class WechatSchedule extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      cron: '0 30 8 * * *', // 8.30分执行一次
      type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    console.log('wechat 定时任务执行 start');
    const { ctx } = this;
    const data = {
      touser: 'oVB5OwyVDKfTZq4T61_p2roSg1tA',
      template_id: 'arueuQozNMNHBZ7BQ5hsCzxxC9X38tJ1Kmu7Oa1JjEY',
      url: 'http://weixin.qq.com/download',
      data: {
        first: {
          value: '微信消息推送',
          color: '#173177',
        },
        keyword1: {
          value: '杨璞',
          color: '#1d1d1d',
        },
        keyword2: {
          value: '男',
          color: '#1d1d1d',
        },
        keyword3: {
          value: '23',
          color: '#1d1d1d',
        },
        remark: {
          value: '已登记！',
          color: '#173177',
        },
      },
    };

    const { access_token } = await ctx.service.wechat.wechatToken();
    await ctx.service.wechat.sendTemplateMsg({ access_token, data });
    console.log('定时任务执行');
    console.log('wechat 定时任务执行');
  }
}

module.exports = WechatSchedule;
