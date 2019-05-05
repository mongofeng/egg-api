'use strict';
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken'); // 引入jsonwebtoken

const crypto = require('crypto'); // 导入加密模块,导入node自带的加密模块(不需要安装)

const encrypt = password => {
  const md5 = crypto.createHash('md5');
  const newPas = md5.update(password).digest('hex');
  return newPas;
};

const validate = (password, dataBasePassword) => {
  const md5 = crypto.createHash('md5');
  const newPas = md5.update(password).digest('hex');
  return newPas === dataBasePassword;
};

function createToken(data = {}, expiresIn = 60 * 60) {
  const cert = fs.readFileSync(path.join(__dirname, '../public/pem/rsa_private_key.pem')); // 私钥，看后面生成方法
  const token = jwt.sign(data, cert, { algorithm: 'RS256', expiresIn });
  return token;
}

module.exports = {
  encrypt,
  validate,
  createToken,
};


//   链接：https://juejin.im/post/5c170f7ef265da614273ccb1
