'use strict';
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken'); // 引入jsonwebtoken
function createToken(data = {}, expiresIn = 60 * 60) {
  const cert = fs.readFileSync(path.join(__dirname, '../public/pem/rsa_private_key.pem')); // 私钥，看后面生成方法
  const token = jwt.sign(data, cert, { algorithm: 'RS256', expiresIn });
  return token;
}

module.exports = {
  createToken,
};


//   链接：https://juejin.im/post/5c170f7ef265da614273ccb1
