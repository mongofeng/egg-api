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

    const time = nowDate;

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
        $unwind: '$openId', // 结构数组
      },
      {
        $match: {
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
    const params = {
      $match: {
        surplus: { // 剩余课时
          $lte: 6,
        },
        isPush: false, // // 是否推送过期的通知
        isActive: true, // 是否激活
        beOverdue: false, // 是否过时
      },
    };

    const data = await this.fetchPackage(params);
    return data;
  }


  async fetchExpiredPackage() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const params = {
      $match: {
        endTime: { // 结束时间少于当前一个月后的时间
          $lte: date,
        },
        isPush: false, // // 是否推送过期的通知
        isActive: true, // 是否激活
        beOverdue: false, // 是否过时
      },
    };

    const data = await this.fetchPackage(params);
    return data;
  }


  async fetchPackage(params) {
    const { ctx } = this;
    const fields = [
      'activeTime',
      'beOverdue',
      'count',
      'endTime',
      'isActive',
      'packageId',
      'studentIds',
      'surplus',
      'surplus',
      'used',
    ];

    const fieldsObj = ctx.helper.formateAggregateProjectFiles(fields);

    const data = await ctx.model.StudentPackage.aggregate([
      params,
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
                _id: 0,
                openId: 1,
                studentName: '$name',
              },
            },
          ],
          as: 'student',
        },
      },
      {
        $lookup: {
          from: 'package',
          let: { tId: { $toObjectId: '$packageId' } },
          pipeline: [
            {
              $match: {
                // 接受聚合表达式
                $expr: { $eq: [ '$_id', '$$tId' ] },
              },
            },
            {
              $project: {
                _id: 0,
                packageName: '$name',
              },
            },
          ],
          as: 'package',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              { $arrayElemAt: [ '$package', 0 ] }, // 拿数组的第一位，变成一个object
              { $arrayElemAt: [ '$student', 0 ] }, // 拿数组的第一位，变成一个object
              '$$ROOT', // 覆盖数组
            ],
          },
        },
      },

      {
        $unwind: '$openId', // 结构数组
      },
      {
        $match: {
          $expr: { $ne: [ '$openId', '' ] }, // 去除openid为空的状况
        },
      },

      {
        $project:
        {
          _id: 1,
          packageName: 1,
          openId: 1,
          studentName: 1,
          ...fieldsObj,
        },
      },
    ]);
    return data;
  }


  async fetchCurrentNoticeCourse() {
    // 当天的课程
    const { ctx } = this;


    const time = new Date();

    // 一个半小时之后
    const HourDate = new Date();
    HourDate.setHours(HourDate.getHours() + 1);
    HourDate.setMinutes(HourDate.getMinutes() + 30);

    let hour = HourDate.getHours();
    hour = String(hour).padStart(2, '0');

    let minutes = HourDate.getMinutes();
    minutes = String(minutes).padStart(2, '0');

    const startTime = `${hour}:${minutes}`;

    const data = await ctx.model.Course.aggregate([
      {
        $match: {
          startDate: {
            $lte: time,
          },
          endDate: {
            $gte: time,
          },
          startTime: {
            $gte: startTime,
          },
          status: 1,
          isNotice: false,
          day: time.getDay(),
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
        $unwind: '$openId', // 结构数组
      },
      {
        $match: {
          $expr: { $ne: [ '$openId', '' ] }, // 去除openid为空的状况
        },
      },
      {
        $project: {
          // 只保留openid,和课程id
          _id: 1,
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
