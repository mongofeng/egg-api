'use strict';

const Service = require('egg').Service;

class StatisticsService extends Service {
  /**
 * 根据创建时间统计学生的个数
 */
  async stuCountByTime() {
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
  async stuCountByStatus() {
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


  /**
 * 根据创建时间统计课时的数量
 */
  async hourCountByTime() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { query } = body;


    const poline = [
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createDate' } },
          key: { $first: { $month: '$createDate' } },
          count: { $sum: '$num' },
        },
      },
    ];

    if (query) {
      const {
        createDate,
        ...reset
      } = query;

      const match = {
        $match: {
        },
      };

      for (const [ key, value ] of Object.entries(reset)) {
        match.$match[key] = value;
      }

      if (createDate) {
        match.$match.createDate = {
          $gte: new Date(Number(createDate), 1, 1, 0, 0, 0),
          $lte: new Date(Number(createDate), 12, 31, 23, 59, 59),
        };
      }

      poline.unshift(match);
    }

    const data = await ctx.model.CourseHourFlow.aggregate(poline);

    return {
      code: 1,
      msg: 'find success',
      data,
      desc: '获取成功',
    };
  }


  groupFields(obj) {
    return Object.keys(obj).reduce((initVal, key) => {
      return {
        ...initVal,
        [key]: { [obj[key]]: `$${key}` },
      };
    }, {});
  }

  /**
   * 统计课时
   */
  async caculatePackage(body) {
    const { ctx } = this;
    const fields = {
      amount: '$sum',
      count: '$sum',
      used: '$sum',
      surplus: '$sum',
    };
    const data = await ctx.model.StudentPackage.aggregate([
      {
        $unwind: '$studentIds', // 结构数组
      },
      {
        $match: body,
      },
      {
        $group: {
          _id: '$studentIds',
          ...this.groupFields(fields),
          overdueCount: {
            $sum: { $cond: [ '$beOverdue', '$surplus', 0 ] },
          },
          activiteCount: {
            $sum: { $cond: [ '$isActive', '$count', 0 ] },
          },
          unActiviteCount: {
            $sum: { $cond: [ '$isActive', 0, '$count' ] },
          },
        },
      },
    ]);
    return data;
  }
}

module.exports = StatisticsService;
