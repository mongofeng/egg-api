'use strict';
/**
 * 课时流水
 * @param app
 * @return {Model<Document> | Model<T>}
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const courseHourFlow_col = new Schema({
    num: { // 课时的数量
      type: Number,
      required: true,
    },
    course: {
      type: [{}], // 课程,补签或者签到时候存在[{courseId, count}]
    },
    packageId: { // 课程包id
      type: String,
    },
    studentPackageId: { // 学员课程包id
      type: String,
    },
    studentId: { // 学员的id
      type: String,
      required: true,
    },
    type: { // 类型：添加/补签/签到 1/2/3
      type: Number,
      required: true,
    },
    desc: { // 描述
      type: String,
      default: null,
    },
  }, { collection: 'course-hour-flow', versionKey: false, timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });


  return mongoose.model('courseHourFlow', courseHourFlow_col);
};
