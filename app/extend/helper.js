'use strict';
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken'); // 引入jsonwebtoken
function createToken(data, expires = 7200) {
  const exp = Math.floor(Date.now() / 1000) + expires;
  const cert = fs.readFileSync(path.join(__dirname, '../public/pem/rsa_private_key.pem')); // 私钥，看后面生成方法
  const token = jwt.sign({ data, exp }, cert, { algorithm: 'RS256' });
  return token;
}

module.exports = {
  createToken,
};


//   链接：https://juejin.im/post/5c170f7ef265da614273ccb1
