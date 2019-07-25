'use strict';

const Service = require('egg').Service;

class BaseResfulService extends Service {
  /**
 * 增加信息
 * @param {*} Document_Model 字段表model
 */
  async add(Document_Model) {
    const { ctx } = this;
    const body = ctx.request.body;
    const data = await Document_Model.create(body);
    return {
      code: 1,
      data,
      msg: 'insert success',
      desc: '添加成功',
    };
  }

  /**
 * 获取的列表
 * @param {*} Document_Model 字段表model
 */
  async list(Document_Model) {
    const { ctx } = this;
    const body = ctx.request.body;
    let { page = 1, limit = 10, query = {}, sort = {}, like = {} } = body;

    const keys = Reflect.ownKeys(like);
    if (keys.length) {
      const likeKeyVal = {};
      for (const key of keys) {
        if (!like[key]) continue;
        likeKeyVal[key] = new RegExp(like[key]);
      }
      query = {
        ...query,
        ...likeKeyVal,
      };
    }

    const offset = (page - 1) * limit;
    const data = await Document_Model.find(query).sort(sort).skip(offset)
      .limit(limit);
    const count = await Document_Model.find(query).countDocuments();

    return {
      code: 1,
      msg: 'find success',
      data: {
        list: data,
        count,
      },
    };
  }

  /**
   * 获取详情
   * @param {*} Document_Model 字段表model
   * @param {*} props id
   */
  async detail(Document_Model, props = '_id') {
    const { ctx } = this;
    const { id } = ctx.params;
    const data = await Document_Model.findOne({
      [props]: id,
    });
    return {
      code: 1,
      msg: 'find success',
      data,
    };
  }

  async update(Document_Model) {
    const { ctx } = this;
    const { id } = ctx.params;
    const body = ctx.request.body;
    // const data = await Document_Model.findOneAndReplace({_id: id}, { $set: body}) // 修改已经删除的不会报错返回null，不存在的会报错
    const data = await Document_Model.update({ _id: id }, { $set: body }, { upsert: false, multi: false });
    // 不存在的：{"n": 0,"nModified": 0,"ok": 1}
    // 存在的：{"n": 1,"nModified": 1,"ok": 1}
    return {
      code: 1,
      msg: 'update success',
      data,
    };
  }

  async del(Document_Model) {
    const { ctx } = this;
    const { id } = ctx.params;
    const data = await Document_Model.findOneAndDelete({ _id: id }); // executes;
    return {
      code: 1,
      msg: 'delete success',
      data,
    };
  }
}

module.exports = BaseResfulService;
