'use strict';

const Service = require('egg').Service;

class ScheduleService extends Service {
  // 上课提醒
  async fetchCurrentCourse() {
    // 当天的课程
    const { ctx } = this;
    const nowDate = new Date();
    // 获取1天后的日期
    nowDate.setDate(nowDate.getDate() + 1);

    const time = nowDate.getTime();

    const data = await ctx.model.Course.aggregate([
      {
        $match: {
          startDate: {
            $lte: time,
          },
          endDate: {
            $gte: time,
          },
          status: 1,
          day: nowDate.getDay(),
        },
      },
      {
        $unwind: '$studentIds', // 结构数组
      },
      {
        $lookup: {
          from: 'student',
          let: { stuId: { $toObjectId: '$studentIds' } }, // 把studentid变成Object(id)
          pipeline: [
            {
              $match: {
                // 接受聚合表达式
                $expr: { $eq: [ '$_id', '$$stuId' ] },
              },
            },
            {
              $project: {
                isSendTemplate: 1,
                openId: 1,
                stu_name: '$name',
                stu_id: '$_id',
              },
            },
          ],
          as: 'student',
        },
      },
      {
        $lookup: {
          from: 'teacher',
          let: { tId: { $toObjectId: '$teacherId' } },
          pipeline: [
            {
              $match: {
                // 接受聚合表达式
                $expr: { $eq: [ '$_id', '$$tId' ] },
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
      },
      {
        $match: {
          // isSendTemplate: true,
          $expr: { $ne: [ '$openId', '' ] }, // 去除openid为空的状况
        },
      },
      {
        $project: {
          // 只保留openid,和课程id
          openId: 1,
          stu_name: 1,
          name: 1,
          stu_id: 1,
          day: 1,
          time: 1,
          teacher_name: 1,
          desc: 1,
          startTime: 1,
          endTime: 1,
        },
      },
    ]);

    console.log('------------result-----------------------');
    console.log(data);
    return data;
  }

  // 剩余的课时数少于2个的时候
  async fetchCurrentClassHourCount() {
    const { ctx } = this;
    const data = await ctx.model.StudentHour.aggregate([
      {
        $project: {
          reset: {
            $subtract: [ '$num', '$used' ],
          },
          studentId: {
            $convert:
            {
              input: '$studentId',
              to: 'objectId',
            },
          },
        },
      },
      {
        $match: {
          reset: {
            $gte: 2,
          },
        },
      },
      {
        $lookup: {
          from: 'student',
          localField: 'studentId',
          foreignField: '_id',
          as: 'studentMsg',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              { $arrayElemAt: [ '$studentMsg', 0 ] }, // 拿数组的第一位，变成一个object
              '$$ROOT', // 覆盖数组
            ],
          },
        },
      },
      {
        $match: {
          isSendTemplate: true,
          $expr: { $ne: [ '$openId', '' ] }, // 去除openid为空的状况
        },
      },
      {
        $project: {
          // 只保留openid,和名字,剩余课时数
          openId: 1,
          name: 1,
          reset: 1,
        },
      },
    ]);
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
