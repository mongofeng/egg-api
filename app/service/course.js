'use strict';

const Service = require('egg').Service;

class CourseService extends Service {
  /**
 * 批量关联课程
 */
  async batchCourses() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { id, courseIds } = body; // 学生的id
    const courseQuery = courseIds.map(key => ({
      _id: key,
    }));

    const query = {
      $or: courseQuery,
    };

    const update = await ctx.model.Course.update(
      query,
      { $addToSet: { studentIds: id } },
      { upsert: false, multi: true });

    return {
      code: 1,
      msg: 'update success',
      data: update,
      desc: '更新成功',
    };
  }

  /**
 * 取消课程学生的关联
 */
  async delCoursesStudent() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { id, courseIds } = body; // 学生的id
    const courseQuery = courseIds.map(key => ({
      _id: key,
    }));

    const query = {
      $or: courseQuery,
    };

    const update = await ctx.model.Course.update(
      query,
      { $pullAll: { studentIds: [ id ] } },
      { upsert: false, multi: true });

    // 更新课程表成功 : update.n更新的条数
    return {
      code: 1,
      msg: 'update success',
      data: update,
      desc: '更新成功',
    };
  }

  /**
   * 聚合函数获取课程，包含老师的名称
   */
  async list() {
    const { ctx } = this;
    const data = await ctx.model.Course.aggregate([
      {
        $lookup:
        {
          from: 'teacher',
          let: { tId: { $toObjectId: '$teacherId' } },
          pipeline: [
            {
              $match:
              {
                $expr: // 接受聚合表达式
                  { $eq: [ '$_id', '$$tId' ] },
              },
            },
            {
              $project: {
                teacherName: '$name',
                _id: 0,
              },
            },
          ],
          as: 'teacherMsg',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              { $arrayElemAt: [ '$teacherMsg', 0 ] }, // 拿数组的第一位，变成一个object
              '$$ROOT', // 覆盖数组
            ],
          },
        },
      },
      {
        $project: {
          teacherMsg: 0, // 去除teacherMsg
        },
      },
    ]);


    return {
      code: 1,
      msg: 'find success',
      data,
      desc: '获取成功',
    };
  }


}

module.exports = CourseService;
