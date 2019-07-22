'use strict';

/**
 * 课时包内容
 * @param app
 * @returns {Model<Document> | Model<T>}
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ClassPackage = new Schema({
    name: { // 名字
      type: String,
      required: true,
    },
    count: { // 数量
      type: Number,
      required: true,
    },
    desc: { // 描述
      type: String,
      default: null,
    },
    amount: { // 价格
      type: Number,
      required: true,
    },
  }, { collection: 'class-package', versionKey: false, timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });


  return mongoose.model('class-package', ClassPackage);
};
