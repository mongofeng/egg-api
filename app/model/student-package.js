'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const StudentPackage = new Schema({
    studentIds: { // 学生
      type: [ String ],
      required: true,
    },
    packageId: { // 课程包id
      type: String,
      required: true,
    },
    activeTime: { // 激活时间
      type: Date,
      default: null,
    },
    endTime: { // 结束时间
      type: Date,
      default: null,
    },
    amount: { // 价格
      type: Number,
      required: true,
    },
    count: { // 总数量
      type: Number,
      required: true,
    },
    surplus: { // 剩余课时, change改变
      type: Number,
      required: true,
    },
    used: { // 使用课时， change改变
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean, // 是否激活
      default: false,
    },
    beOverdue: {
      type: Boolean, // 是否过时
      default: false,
    },
    period: { // 有效期
      type: Number,
      required: true,
    },
    isPush: {
      type: Boolean, // 是否推送过期的通知
      default: false,
    },
  }, { collection: 'student-package', versionKey: false, timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });


  return mongoose.model('student-package', StudentPackage);
};
