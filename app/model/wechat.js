'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const Schema = mongoose.Schema;
  const wechatSchema = new Schema({
    name: {
      type: String,
      default: 'wechat_token',
    },
    access_token: {
      type: String,
      required: true,
    },
    expires_in: {
      type: Number,
      required: true,
    },
  }, { collection: 'wechat', versionKey: false, timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });

  return mongoose.model('wechat', wechatSchema);
};
