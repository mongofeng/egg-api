FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --registry=https://registry.npm.taobao.org --production
COPY . .
EXPOSE 3330
CMD npm run docker