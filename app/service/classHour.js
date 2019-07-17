'use strict';

const Service = require('egg').Service;

class ClassHourService extends Service {
  async add() {
    // $inc在原基础上更改：https://docs.mongodb.com/manual/reference/operator/update/inc/#up._S_inc
    // https://docs.mongodb.com/manual/reference/operator/update/inc/#up._S_inc

    // 更新学时统计表
    const { ctx } = this;
    const body = ctx.request.body;
    const { type, num, classTypes, amount = 0 } = body;

    // 判断课时是否足以扣除
    if (type === 2) {
      const user = await ctx.model.StudentHour.findOne(
        { studentId: body.studentId }
      );
      if (!user) {
        const errorMsg = {
          code: 0,
          msg: 'class hour is not exit!',
          desc: '学生课时不存在',
          data: user,
        };
        ctx.throw(400, errorMsg);
      }

      if ((user.num - user.used) < num) {
        const errorMsg = {
          code: 0,
          msg: 'class hour is not dec!',
          desc: '学生课时不足以扣除,请添加课时',
          data: user,
        };
        ctx.throw(400, errorMsg);
      }
    }


    // 更新统计表
    const query = type === 1 ? { $inc: { num, amount } } : { $inc: { used: num } };

    const update = await ctx.model.StudentHour.update(
      { studentId: body.studentId },
      query,
      { upsert: false, multi: false }
    );

    const data = {
      student_hour: update,
    };

    // 如果学时表更新成功，则添加流水
    if (update && update.n !== 0) {
      // 如果是扣除课时的话
      if (type === 2 && classTypes === 3) { // 如果是签到, 推送微信消息
        const { access_token } = await ctx.service.wechat.wechatToken();
        const { template_id } = this.config.schedule.sign;
        const stu = await ctx.model.Student.findOne({
          _id: body.studentId,
        });

        const total = await ctx.model.StudentHour.findOne({
          studentId: body.studentId,
        });

        if (stu && stu.openId) {
          // {{first.DATA}}
          // 上课日期：{{keyword1.DATA}}
          // 班级名称：{{keyword2.DATA}}
          // 本次扣课时：{{keyword3.DATA}}
          // 剩余总课时：{{keyword4.DATA}}
          // {{remark.DATA}}

          // 你好，恭喜您签到成功！
          // 上课日期：2017年11月10号
          // 班级名称：音乐课
          // 本次扣课时：1课时
          // 剩余总课时：19课时
          // 祝您生活愉快！
          const date = new Date();
          const time = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}号`;
          const query = {
            touser: stu.openId,
            template_id,
            data: {
              first: {
                value: `您好,${stu.name}同学,签到成功！`,
              },
              keyword1: {
                value: time,
              },
              keyword2: {
                value: body.course,
              },
              keyword3: {
                value: `${num}课时`,
              },
              keyword4: {
                value: `${total.num - total.used}课时`,
              },
              remark: {
                value: '祝您生活愉快！',
              },
            },
          };

          const res = await ctx.service.wechat.sendTemplateMsg({ access_token, data: query });
          data.templateMsg = res;
        } else {
          data.templateMsg = {
            errcode: 1,
            errmsg: stu ? '改学生还没绑定微信号' : '查询不到改学生',
          };
        }
      }
      data.class_hour = await ctx.model.ClassHour.create(body);
    }

    return {
      code: 1,
      msg: 'insert success',
      data,
      desc: '添加成功',
    };
  }
}

module.exports = ClassHourService;
