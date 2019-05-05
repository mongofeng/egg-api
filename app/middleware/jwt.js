'use strict';
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken'); // 引入jsonwebtoken
/**
 * options, app
 */
module.exports = () => {
  return async function userInterceptor(ctx, next) {
    const authToken = ctx.header.authorization; // 获取header里的authorization
    if (authToken) {
      const res = verifyToken(authToken); // 解密获取的Token
      if (res.code !== 0) {
        ctx.locals.userId = res.data.userId;
        await next();
      } else {
        ctx.body = res;
      }
    } else {
      ctx.body = {
        code: 0,
        msg: 'token is not exit',
        desc: 'token 不存在',
      };
    }
  };
};


// 解密，验证
function verifyToken(token) {
  try {
    const cert = fs.readFileSync(path.join(__dirname, '../public/pem/rsa_public_key.pem')); // 公钥，看后面生成方法
    const data = jwt.verify(token, cert, { algorithms: [ 'RS256' ] }) || {};
    return {
      code: 1,
      data,
    };
  } catch (error) {
    return {
      code: 0,
      error,
      desc: 'token失效或者不合法，请重新登录页面',
    };
  }
}

