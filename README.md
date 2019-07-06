# api

education api


### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

### docker
```bash
# 拉取 mongo 官方 Image。
docker pull mongo
# 创建 network，让两个容器可以相互通信。
docker network create webapp-network
# 运行容器
docker run -d --name database --network webapp-network -v ~/data/db:/data/db mongo
docker run -p 3330:3330 --network webapp-network -d egg-api

```

### docker-compose

```

docker-compose up -d
```

### 参考文档

- [docker中使用nginx容器代理其他容器](https://www.jianshu.com/p/7609e19b5b88)
- [Docker Compose实例之nginx反向代理GitLab](https://www.jianshu.com/p/7de81c69c4a8)