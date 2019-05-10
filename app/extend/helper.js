'use strict';
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken'); // 引入jsonwebtoken
const crypto = require('crypto'); // 导入加密模块,导入node自带的加密模块(不需要安装)

const xml2js = require('xml2js');

function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(
      xml,
      { trim: true, explicitArray: false, ignoreAttrs: true },
      function(err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result.xml);
      }
    );
  });
}

// 加密
const encrypt = password => {
  const md5 = crypto.createHash('md5');
  const newPas = md5.update(password).digest('hex');
  return newPas;
};

// 验证
const validate = (password, dataBasePassword) => {
  const md5 = crypto.createHash('md5');
  const newPas = md5.update(password).digest('hex');
  return newPas === dataBasePassword;
};

// 生成jwt
function createToken(data = {}, expiresIn = 60 * 60) {
  console.log(this);
  const cert = fs.readFileSync(path.join(__dirname, '../public/pem/rsa_private_key.pem')); // 私钥，看后面生成方法
  const token = jwt.sign(data, cert, { algorithm: 'RS256', expiresIn });
  return token;
}

// var chat = compare(one, two, three)
// chat(1)
function compose() {
  const _len = arguments.length;
  const funcs = new Array(_len);
  for (let _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function(arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function(a, b) {
    return async function() {
      const ret = await a.apply(this, arguments);
      if (ret === 'next') {
        return await b.apply(this, arguments);
      }
      return ret;
    };
  });
}

module.exports = {
  encrypt,
  validate,
  createToken,
  compose,
  parseXML,
};


//   链接：https://juejin.im/post/5c170f7ef265da614273ccb1
