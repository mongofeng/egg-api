'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  // 姓名，老师，状态：开班，结束， 1/2 课程内容：‘’, 开课时间， 结课时间，创建时间，更新时间, day：1-7， time: 1/2/3
  const Schema = mongoose.Schema;
  const courseSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      teacherId: {
        type: String,
        default: '',
        required: true,
      },
      studentIds: {
        type: [ String ],
        default: () => [],
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
      day: {
        type: Number,
        required: true,
      },
      time: {
        type: Number,
        required: true,
      },
      startDate: {
        type: Number,
        default: 0,
      },
      endDate: {
        type: Number,
        default: 0,
      },
      startTime: {
        type: String,
        default: null,
      },
      endTime: {
        type: String,
        default: null,
      },
    },
    {
      collection: 'course',
      versionKey: false,
      timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' },
    }
  );

  return mongoose.model('course', courseSchema);
};
