FROM node:alpine

# 设置相应的时区:http://blog.w2fzu.com/2016/11/21/2016-11-21-Node-and-Mysql-deploy-on-Docker/
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone && \
    apk del tzdata

ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --registry=https://registry.npm.taobao.org --production
COPY . .
EXPOSE 3330
CMD npm run docker