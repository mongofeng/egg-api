'use strict';

const Service = require('egg').Service;

class HourService extends Service {
  // 购买课程包,添加流水
  async buy() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { packageId, studentId, desc = '' } = body;
    // 1.查询课程包的状态
    const Package = await this.findPackage(packageId);
    // 2.关联课程包
    const { count } = Package;
    const data = await this.relatePackageToStu({
      packageId,
      studentId,
      count,
    });
    // num:  // 课时的数量
    // courseId?:  // 课程id,补签或者签到时候存在
    // packageId:  // 课程包id
    // studentId: // 学员的id
    // type // 类型：添加/减少 1/2
    // classTypes?:// 学时的类型：补签/签到 1/2
    // desc:  // 描述

    // 3.创建课程的流水
    const result = await this.createFlows({
      num: count,
      packageId,
      type: 1,
      studentId,
      desc,
    });

    // 4.推送微信消息
    let templateMsg = {};
    const stu = await this.findStudent(studentId);
    if (stu && stu.openId) {
      const date = new Date();
      const time = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}号`;
      const tem = {
        first: `您好,${stu.name}同学,签到成功！`,
        keyword1: time,
        keyword2: '111',
        remark: '祝您生活愉快！',
      };
      const { template_id } = this.config.schedule.package;
      const params = {
        touser: stu.openId,
        template_id,
        data: ctx.helper.formateTemplate(tem),
      };

      templateMsg = await this.pushWechatMessage(params);
    } else {
      templateMsg = {
        errcode: 1,
        errmsg: stu ? '该学生还没绑定微信号,没有推送消息' : '查询不到改学生,没有推送消息',
      };
    }


    // 添加课程的流水
    return {
      code: 1,
      data: {
        classHour: result,
        package: Package,
        studentPackage: data,
        templateMsg,
      },
      msg: 'insert success',
      desc: '添加成功',
    };
  }
  // 查找学生的信息
  async findStudent(studentId) {
    const { ctx } = this;
    const user = await ctx.model.Student.findOne({
      _id: studentId,
    });
    if (user) {
      return user;
    }

    const errorMsg = {
      code: 0,
      msg: 'student is not exit!',
      desc: '学生不存在',
      data: user,
    };
    ctx.throw(400, errorMsg);
  }
  // 查找课程包明细
  async findPackage(packageId) {
    const { ctx } = this;
    const Package = await ctx.model.ClassPackage.findOne(
      { _id: packageId }
    );

    if (!Package) {
      const errorMsg = {
        code: 0,
        msg: 'Package is not exit!',
        desc: '课程包不存在',
        data: Package,
      };
      ctx.throw(400, errorMsg);
    } else {
      return Package;
    }
  }
  // 关联学员课程包
  async relatePackageToStu({ packageId, studentId, count }) {
    const { ctx } = this;
    const data = await ctx.model.studentPackage.create({
      packageId,
      studentId,
      surplus: count,
      used: 0,
    });
    // 关联成功
    if (data) {
      return data;
    }
    const errorMsg = {
      code: 0,
      msg: 'relate is not fail!',
      desc: '关联课程包失败',
      data,
    };
    ctx.throw(400, errorMsg);
  }

  // 查找学员课程包的明细
  async findStudentPackage(id) {
    const { ctx } = this;
    const data = await ctx.model.studentPackage.find({
      studentId: id,
      isActive: true, // 激活的
      surplus: { // 剩余学时大于0的
        $gte: 0,
      },
    }).sort({
      createDate: -1,
    });
    return data;
  }
  // 创建课程流水
  async createFlows(body) {
    const { ctx } = this;
    const result = await ctx.model.ClassHour.create(body);
    return result;
  }

  // 推送微信的消息
  async pushWechatMessage(data) {
    const { ctx } = this;
    const { access_token } = await ctx.service.wechat.wechatToken();
    const res = await ctx.service.wechat.sendTemplateMsg({ access_token, data });
    return res
  }

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

module.exports = HourService;
