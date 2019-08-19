'use strict';
const Subscription = require('egg').Subscription;

class PackageSchedule extends Subscription {
  static get schedule() {
    return {
      // cron: '0 0 8 * * *', // 21点分执行一次
      interval: '10s', // 1 分钟间隔
      type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { ctx } = this;

    const list = await ctx.service.schedule.fetchCurrentClassHourCount();

    const { template_id } = this.config.schedule.package;


    const success = [];
    const pushWechatMessage = async ({ param, id }) => {
      const res = await ctx.service.wechat.pushWechatMessage(param);
      console.log('-----------');
      console.log(res);
      if (res.errcode === 0 && res.errmsg.toLowerCase() === 'ok' && res.msgid) {
        success.push(id);
      }
    };

    const allPromise = list.map(item => {
      const tem = {
        first: `您好,${item.studentName}同学,您所购买的套餐已经充值成功！`,
        keyword1: item.studentName,
        keyword2: item.packageName,
        keyword3: `${item.surplus}课时`,
        remark: '祝您生活愉快！',
      };
      const param = {
        touser: item.openId,
        template_id,
        data: ctx.helper.formateTemplate(tem),
      };

      return pushWechatMessage({
        param,
        id: item._id,
      });
    });


    await Promise.all(allPromise);

    console.log(success);

    if (success.length) {
      const data = await ctx.model.StudentPackage.updateMany(
        { _id: {
          $in: success,
        } },
        { isPush: true });

      console.log(data);
    }


  }
}

module.exports = PackageSchedule;
