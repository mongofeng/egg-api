'use strict';
const Subscription = require('egg').Subscription;

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // disable: true, // 配置该参数为 true 时，这个定时任务不会被启动。
      interval: '1m', // 1 分钟间隔
      type: 'worker', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { ctx } = this;
    const list = await ctx.service.schedule.fetchCurrentCourse();
    console.log(list);
    // const { access_token } = await ctx.service.wechat.wechatToken();
    // await ctx.service.wechat.sendTemplateMsg({ access_token, data });
    console.log('定时任务执行');
  }
}

module.exports = UpdateCache;
