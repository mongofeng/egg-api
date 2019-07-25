'use strict';

const Service = require('egg').Service;

class HourService extends Service {

  /**
   * 购买
   */
  async buy() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { packageId, studentId, desc = '' } = body;
    // 1.查询课程包的状态
    const Package = await this.findPackage(packageId);
    // 2.关联课程包
    const { count, amount } = Package;
    const data = await this.relatePackageToStu({
      packageId,
      studentIds: [ studentId ],
      surplus: count,
      count,
      used: 0,
      amount,
    });
    // num:  // 课时的数量
    // course?:  // 课程,补签或者签到时候存在[{courseId, count}]
    // packageId:  // 课程包id
    // studentId: // 学员的id
    // type // 类型：添加/补签/签到  1/2/3
    // desc:  // 描述

    // 3.创建课程的流水
    const result = await this.createFlows({
      num: count,
      packageId,
      studentPackageId: data._id,
      type: 1,
      studentId,
      desc,
    });

    // 4.推送微信消息
    let templateMsg = {};
    const stu = await this.findStudent(studentId);
    if (stu && stu.openId) {
      // {{first.DATA}}
      // 上课日期：{{keyword1.DATA}}
      // 班级名称：{{keyword2.DATA}}
      // 本次扣课时：{{keyword3.DATA}}
      // 剩余总课时：{{keyword4.DATA}}
      // {{remark.DATA}}
      const date = new Date();
      const time = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}号`;
      const tem = {
        first: `您好,${stu.name}同学,签到成功！`,
        keyword1: time,
        keyword2: '111',
        keyword3: '',
        keyword4: '',
        remark: '祝您生活愉快！',
      };
      const { template_id } = this.config.schedule.package;
      const params = {
        touser: stu.openId,
        template_id,
        data: ctx.helper.formateTemplate(tem),
      };

      templateMsg = await ctx.service.wechat.pushWechatMessage(params);
    } else {
      templateMsg = {
        errcode: 1,
        errmsg: stu ? '该学生还没绑定微信号,没有推送消息' : '查询不到改学生,没有推送消息',
      };
    }


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

  /**
   * 签到
   */
  async sign() {
    // $inc在原基础上更改：https://docs.mongodb.com/manual/reference/operator/update/inc/#up._S_inc
    const { ctx } = this;
    const body = ctx.request.body;
    const { studentId, course, num, desc = '', courseName } = body;

    const query = {
      studentIds: {
        $in: [ studentId ],
      },
      isActive: true, // 激活的
      surplus: { // 剩余学时大于0的
        $gte: num,
      },
    };

    // 1.查找课时包
    const packages = await this.findStudentPackage(query);

    // 2.更新package包里面的课时
    const params = {
      $inc: {
        surplus: -num,
        used: num },
    };
    const update = await this.updateStudentPackage({
      _id: packages._id,
    }, params);

    // 3.添加一个流水
    // num:  // 课时的数量
    // course:  // 课程,补签或者签到时候存在[{courseId, count}]
    // packageId?:  // 课程包id
    // studentId: // 学员的id
    // type // 类型：添加/补签/签到  1/2/3
    // desc:  // 描述

    // 3.创建课程的流水
    const result = await this.createFlows({
      num,
      course,
      studentPackageId: packages._id,
      type: 3,
      studentId,
      desc,
    });


    // 4.推送微信消息
    let templateMsg = {};
    const stu = await this.findStudent(studentId);
    if (stu && stu.openId) {
      // {{first.DATA}}
      // 上课日期：{{keyword1.DATA}}
      // 班级名称：{{keyword2.DATA}}
      // 本次扣课时：{{keyword3.DATA}}
      // 剩余总课时：{{keyword4.DATA}}
      // {{remark.DATA}}
      const date = new Date();
      const time = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}号`;
      const tem = {
        first: `您好,${stu.name}同学,签到成功！`,
        keyword1: time,
        keyword2: courseName,
        keyword3: `${num}课时`,
        keyword4: `${packages.surplus - num}课时`,
        remark: '祝您生活愉快！',
      };
      const { template_id } = this.config.schedule.package;
      const params = {
        touser: stu.openId,
        template_id,
        data: ctx.helper.formateTemplate(tem),
      };

      templateMsg = await ctx.service.wechat.pushWechatMessage(params);
    } else {
      templateMsg = {
        errcode: 1,
        errmsg: stu ? '该学生还没绑定微信号,没有推送消息' : '查询不到改学生,没有推送消息',
      };
    }


    return {
      code: 1,
      data: {
        classHour: result,
        package: packages,
        studentPackage: update,
        templateMsg,
      },
      msg: 'insert success',
      desc: '添加成功',
    };

  }

  /**
   * 补签
   */
  async supplement() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { studentId, course, num, desc = '' } = body;

    const query = {
      studentIds: {
        $in: [ studentId ],
      },
      isActive: true, // 激活的
      surplus: { // 剩余学时大于0的
        $gte: num,
      },
    };

    // 1.查找课时包
    const packages = await this.findStudentPackage(query);

    // 2.更新package包里面的课时
    const params = {
      $inc: {
        surplus: -num,
        used: num },
    };
    const update = await this.updateStudentPackage({
      _id: packages._id,
    }, params);

    // 3.添加一个流水
    // num:  // 课时的数量
    // course:  // 课程,补签或者签到时候存在[{courseId, count}]
    // packageId?:  // 课程包id
    // studentId: // 学员的id
    // type // 类型：添加/补签/签到  1/2/3
    // desc:  // 描述

    // 3.创建课程的流水
    const result = await this.createFlows({
      num,
      course,
      studentPackageId: packages._id,
      type: 2,
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

      templateMsg = await ctx.service.wechat.pushWechatMessage(params);
    } else {
      templateMsg = {
        errcode: 1,
        errmsg: stu ? '该学生还没绑定微信号,没有推送消息' : '查询不到改学生,没有推送消息',
      };
    }


    return {
      code: 1,
      data: {
        classHour: result,
        package: packages,
        studentPackage: update,
        templateMsg,
      },
      msg: 'insert success',
      desc: '添加成功',
    };
  }

  /**
   * 关联现有的学员包(多人共用一个包的情况)
   * @return {Promise<{msg: string, code: number, data: {package: *, studentPackage: *, classHour: null, templateMsg}, desc: string}>}
   */
  async sharePackage() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { packId, studentId } = body;
    const query = {
      _id: packId,
    };

    // 1.查找课时包
    const packages = await this.findStudentPackage(query);
    // 2.关联现有的学员包(多人共用一个包的情况)
    const params = {
      $addToSet: { studentIds: studentId },
    };
    const update = await this.updateStudentPackage({
      _id: packages._id,
    }, params);

    // 4.推送微信消息
    let templateMsg = {};
    const stu = await this.findStudent(studentId);
    if (stu && stu.openId) {
      // {{first.DATA}}
      // 上课日期：{{keyword1.DATA}}
      // 班级名称：{{keyword2.DATA}}
      // 本次扣课时：{{keyword3.DATA}}
      // 剩余总课时：{{keyword4.DATA}}
      // {{remark.DATA}}
      const date = new Date();
      const time = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}号`;
      const tem = {
        first: `您好,${stu.name}同学,签到成功！`,
        keyword1: time,
        remark: '祝您生活愉快！',
      };
      const { template_id } = this.config.schedule.package;
      const params = {
        touser: stu.openId,
        template_id,
        data: ctx.helper.formateTemplate(tem),
      };

      templateMsg = await ctx.service.wechat.pushWechatMessage(params);
    } else {
      templateMsg = {
        errcode: 1,
        errmsg: stu ? '该学生还没绑定微信号,没有推送消息' : '查询不到改学生,没有推送消息',
      };
    }


    return {
      code: 1,
      data: {
        classHour: null,
        package: packages,
        studentPackage: update,
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


  // 查找课程包
  async findPackage(packageId) {
    const { ctx } = this;
    const Package = await ctx.model.Package.findOne(
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
  async relatePackageToStu(params) {
    const { ctx } = this;
    const data = await ctx.model.studentPackage.create(params);
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
  async findStudentPackage(query) {
    const { ctx } = this;
    const data = await ctx.model.studentPackage.findOne(query).sort({
      createDate: -1,
    });
    if (data) {
      return data;
    }
    const errorMsg = {
      code: 0,
      msg: 'find package is fail!',
      desc: '查找学员课程包的明细失败',
      data,
    };
    ctx.throw(400, errorMsg);
  }

  // 更新学员课程包的数量
  async updateStudentPackage(query, params) {
    const { ctx } = this;
    const data = await ctx.model.studentPackage.updateOne(
      query,
      params
    );
    // data.n; // Number of documents matched
    // data.nModified; // Number of documents modified
    if (data.n && data.nModified) {
      return data;
    }
    const errorMsg = {
      code: 0,
      msg: 'update package is fail!',
      desc: '更新学员课程包的明细失败',
      data,
    };
    ctx.throw(400, errorMsg);
  }


  // 创建课程流水
  async createFlows(body) {
    const { ctx } = this;
    const result = await ctx.model.CourseHourFlow.create(body);
    return result;
  }
}

module.exports = HourService;
