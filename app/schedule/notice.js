'use strict';
const Subscription = require('egg').Subscription;

class NoticeSchedule extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置:https://www.cnblogs.com/a8457013/p/8515939.html
  static get schedule() {
    return {
      cron: '0 */5 7,8,9,10,11,14,15,16,17,18,19 * * *', // 6点到9点每五分钟执行一次
      // interval: '10s', // 1 分钟间隔
      type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
    };
  }

  async subscribe() {
    const { ctx } = this;

    const DAY_LABEL = {
      1: '上午',
      2: '下午',
      3: '晚上',
    };


    const myDate = new Date(); // 获取今天日期

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


    // 一个半小时之后
    const HourDate = new Date();
    let intervalStr = '1个半小时';

    if (myDate.getHours() === 11 && myDate.getMinutes() === 30) {
      HourDate.setHours(HourDate.getHours() + 3);
      intervalStr = '3个小时';
    } else {
      HourDate.setHours(HourDate.getHours() + 1);
      HourDate.setMinutes(HourDate.getMinutes() + 30);
    }

    // 开始时间
    let startHour = HourDate.getHours();
    startHour = String(startHour).padStart(2, '0');
    let startmMinutes = HourDate.getMinutes();
    startmMinutes = String(startmMinutes).padStart(2, '0');
    const startTime = `${startHour}:${startmMinutes}`;

    // 结束的时间
    HourDate.setMinutes(HourDate.getMinutes() + 5);
    let startEndTimeHour = HourDate.getHours();
    startEndTimeHour = String(startEndTimeHour).padStart(2, '0');
    let startEndTimeMinutes = HourDate.getMinutes();
    startEndTimeMinutes = String(startEndTimeMinutes).padStart(2, '0');
    const startEndTime = `${startEndTimeHour}:${startEndTimeMinutes}`;

    console.log(startTime, startEndTime);

    const list = await ctx.service.schedule.fetchCurrentNoticeCourseByTime({
      startTime,
      startEndTime,
    });

    console.log(list);

    const { template_id } = this.config.schedule.course;
    const PromiseMap = list.map(async item => {
      const timeStr = `${dateStr}${WEEK[myDate.getDay()]}`;
      const lastTimeStr = (item.endTime && item.startTime) ? `${timeStr}${item.startTime}-${item.endTime}` : `${timeStr}${DAY_LABEL[item.time]}`;

      const tem = {
        first: `您好,${item.stu_name}同学,您的美术课${intervalStr}后开始，请准时出席`,
        keyword1: item.name,
        keyword2: lastTimeStr,
        remark: '记得准时参加哦！',
      };

      const params = {
        touser: item.openId,
        template_id,
        data: ctx.helper.formateTemplate(tem),
      };

      const { errcode, errmsg, msgid } = await ctx.service.wechat.pushWechatMessage(params);
      return {
        errcode,
        errmsg,
        msgid,
        id: item._id,
      };

    });

    await Promise.all(PromiseMap);


    // const result = await Promise.all(PromiseMap);

    // mogodb的ids
    // let ids = result.filter(item => !!item.msgid).map(item => item.id);
    // ids = [ ...new Set(ids) ];
    // if (ids.length) {
    //   console.log('更新数据ku', ids);
    //   const res = await ctx.model.Course.updateMany({
    //     _id: {
    //       $in: ids,
    //     },
    //   }, {
    //     $set: {
    //       isNotice: true,
    //     },
    //   });
    //   console.log(res);
    //   console.log('更新数据成功');
    // }

  }
}

module.exports = NoticeSchedule;
