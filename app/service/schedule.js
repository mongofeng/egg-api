'use strict';

const Service = require('egg').Service;

class ScheduleService extends Service {
  async sendTemplate() {
    const { ctx } = this;
    const data = await ctx.model.Student.find({
      status: 1,
      isSendTemplate: true,
    });
    console.log(data);
  }

  // 上课提醒
  async fetchCurrentCourse() {
    const { ctx } = this;
    const nowDate = new Date();
    const data = await ctx.model.Course.aggregate([{
      $match: {
        startDate: {
          $lte: nowDate.getTime(),
        },
        endDate: {
          $gte: nowDate.getTime(),
        },
        status: 1,
        // day: nowDate.getDay(),
      },
    }, {
      $unwind: '$studentIds', // 结构数组
    }, {
      $lookup:
        {
          from: 'student',
          let: { stuId: { $toObjectId: '$studentIds' } }, // 把studentid变成Object(id)
          pipeline: [
            {
              $match:
              {
                $expr: // 接受聚合表达式
                  { $eq: [ '$_id', '$$stuId' ] },
              },
            },
            {
              $project: {
                openId: '$openId',
                stu_name: '$name',
                stu_id: '$_id',
              },
            },
          ],
          as: 'student',
        },
    }, {
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
              teacher_name: '$name',
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
            { $arrayElemAt: [ '$student', 0 ] }, // 拿数组的第一位，变成一个object
            '$$ROOT', // 覆盖数组
          ],
        },
      },
    }, {
      $project: { // 只保留openid,和课程id
        openId: 1,
        stu_name: 1,
        name: 1,
        stu_id: 1,
        day: 1,
        time: 1,
        teacher_name: 1,
        desc: 1,
      },
    }, {
      $match: {
        $expr: { $ne: [ '$openId', '' ] }, // 去除openid为空的状况
      },
    }]);
    return data;
  }
}

module.exports = ScheduleService;
/**
 * match是搜索条件
 * unwind是把数组变成一个条条数据
 * project是更改/保留/去除/字段
 * lookup是链表查询
 */
