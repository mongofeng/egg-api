'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  // 家长姓名，学员的id，课时的数量， 状态：通过1/2， 类型：添加/减少 1/2， 金钱, 学时的类型：购买/赠送1//2/签到/其他, 课时/教师的名称和id
  const Schema = mongoose.Schema;
  const ClassHour_col = new Schema({
    name: {
      type: String,
      required: true,
    },
    num: {
      type: Number,
      required: true,
    },
    courseId: {
      type: String,
      default: '',
    },
    teacherId: {
      type: String,
      default: '',
    },
    studentId: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    classTypes: {
      type: Number,
      default: 1,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1,
      required: true,
    },
    desc: {
      type: String,
      default: '',
    },
  }, { collection: 'classHour', versionKey: false, timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });


  return mongoose.model('classHour', ClassHour_col);
};
