'use strict';

const Service = require('egg').Service;

class StudentService extends Service {
  /**
   * 新建学员
   */
  async add() {
    const { ctx } = this;
    const body = ctx.request.body;
    // 新建学生
    const data = await ctx.model.Student.create(body);
    const insertParmas = {
      studentId: data._id,
      num: 0, // 学时
      used: 0, // 剩余学时
    };
    // 新建学时统计表
    await ctx.model.StudentHour.create(insertParmas);
    return {
      code: 1,
      msg: 'insert success',
      data,
      desc: '添加成功',
    };
  }

  /**
 * 根据创建时间统计学生的个数
 */
  async caculateStudentByMonth() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { query } = body;


    const poline = [
      {
        $group: {
        // _id : { $dateToString: { format: "%Y-%m-%d", date: "$createDate" } },
          _id: { $dateToString: { format: '%Y-%m', date: '$createDate' } },
          key: { $first: { $month: '$createDate' } },
          students: {
            $push: {
              teacherId: '$teacherId',
              name: '$name',
              id: '$_id',
            },
          },
          count: { $sum: 1 },
        },
      },
    ];

    if (query) {
      const {
        teacherId,
        createDate,
      } = query;

      const match = {
        $match: {
        },
      };

      if (teacherId) {
        match.$match.teacherId = teacherId;
      }

      if (createDate) {
        match.$match.createDate = {
          $gte: new Date(Number(createDate), 1, 1, 0, 0, 0),
          $lte: new Date(Number(createDate), 12, 31, 23, 59, 59),
        };
      }

      poline.unshift(match);
    }

    const data = await ctx.model.Student.aggregate(poline);

    return {
      code: 1,
      msg: 'find success',
      data,
      desc: '获取成功',
    };
  }


  /**
 * 统计学生的就读和毕业人数
 */
  async caculateStudentNumber() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { query } = body;


    const poline = [
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ];

    if (query) {
      const {
        teacherId,
        createDate,
      } = query;

      const match = {
        $match: {
        },
      };

      if (teacherId) {
        match.$match.teacherId = teacherId;
      }

      if (createDate) {
        match.$match.createDate = {
          $gte: new Date(Number(createDate), 1, 1, 0, 0, 0),
          $lte: new Date(Number(createDate), 12, 31, 23, 59, 59),
        };
      }

      poline.unshift(match);
    }

    const data = await ctx.model.Student.aggregate(poline);
    return {
      code: 1,
      msg: 'find success',
      data,
      desc: '获取成功',
    };
  }
}

module.exports = StudentService;
