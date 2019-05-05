'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  // 学员的id，课时的数量， 已用的课时， 学费
  const Schema = mongoose.Schema;
  const StudentHour_col = new Schema({
    studentId: {
      type: String,
      required: true,
    },
    num: {
      type: Number,
      required: true,
    },
    used: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
  }, { collection: 'student-hour', versionKey: false, timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });


  return mongoose.model('student-hour', StudentHour_col);
};
