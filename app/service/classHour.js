'use strict';

const Service = require('egg').Service;

class ClassHourService extends Service {
  async add() {
    // $inc在原基础上更改：https://docs.mongodb.com/manual/reference/operator/update/inc/#up._S_inc
    // https://docs.mongodb.com/manual/reference/operator/update/inc/#up._S_inc

    // 更新学时统计表
    const { ctx } = this;
    const body = ctx.request.body;
    const { type, num, amount = 0 } = body;
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
