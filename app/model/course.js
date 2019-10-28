'use strict';
/**
 * 课程的数据
 * @param app
 * @return {Model<Document> | Model<T>}
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const courseSchema = new Schema(
    {
      name: { // 姓名
        type: String,
        required: true,
      },
      teacherId: { // 老师
        type: String,
        required: true,
      },
      studentIds: { // 学生
        type: [ String ],
        default: () => [],
      },
      status: { // 状态：开班，结束， 1/2
        type: Number,
        required: true,
      },
      isNotice: {
        type: Boolean,
        default: false,
      },
      desc: {
        type: String,
        default: null,
      },
      day: { // day：1-7
        type: [ Number ],
        required: true,
      },
      time: { // 早中晚: 1/2/3
        type: Number,
        required: true,
      },
      startDate: { // 开课时间
        type: Date,
        required: true,
      },
      endDate: { // 结课时间
        type: Date,
        required: true,
      },
      startTime: { // 课堂开始时间
        type: String,
        required: true,
      },
      endTime: { // 课堂结束时间
        type: String,
        required: true,
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
