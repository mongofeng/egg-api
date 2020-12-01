'use strict';

const Service = require('egg').Service;

class StudentPackageService extends Service {
  // 上课提醒
  async fetchStudent() {
    const { ctx } = this;
    const body = ctx.request.body;
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
      {
        $match: body,
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
                $expr: { $eq: [ '$_id', '$$stuId' ] },
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
                $expr: { $eq: [ '$_id', '$$tId' ] },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ],
          as: 'package',
        },
      },

      {
        $project:
        {
          _id: 1,
          ...fieldsObj,
          package: { $arrayElemAt: [ '$package', 0 ] },
          student: { $arrayElemAt: [ '$student', 0 ] },
        },
      },
      {
        $group: {
          _id: '$_id',
          package: {
            $first: '$package',
          },
          student: {
            $push: '$student',
          },
          ...this.groupFirstFields(fields),
        },
      },
    ]);

    return {
      code: 1,
      msg: 'find success',
      data: {
        list: data,
      },
    };
  }


  groupFirstFields(arr) {
    return arr.reduce((initVal, key) => {
      return {
        ...initVal,
        [key]: { $first: `$${key}` },
      };
    }, {});
  }

}

module.exports = StudentPackageService;

