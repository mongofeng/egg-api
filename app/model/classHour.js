'use strict';
/**
 * 课时流水
 * @param app
 * @returns {Model<Document> | Model<T>}
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ClassHour_col = new Schema({
    num: { // 课时的数量
      type: Number,
      required: true,
    },
    courseId: {
      type: String, // 课程id,补签或者签到时候存在
    },
    packageId: { // 课程包id
      type: String,
    },
    studentId: { // 学员的id
      type: String,
      required: true,
    },
    type: { // 类型：添加/减少 1/2
      type: Number,
      required: true,
    },
    classTypes: { // 学时的类型：补签/签到 1/2
      type: Number,
    },
    // status: { // 通过：是/否 1/2, 保留字段
    //   type: Number,
    //   default: 1,
    // },
    desc: { // 描述
      type: String,
      default: null,
    },
  }, { collection: 'classHour', versionKey: false, timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });


  return mongoose.model('classHour', ClassHour_col);
};
