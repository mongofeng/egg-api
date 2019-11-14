# 使用 Docker Hub 远程仓库



使用 Docker 账户登陆远程仓库，如果没有，请在 [cloud.docker.com](https://cloud.docker.com/) 注册。

```
$ docker login
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: ttingshuo
Password: 
WARNING! Your password will be stored unencrypted in /home/ubuntu/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded

```

查看镜像

```
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
friendlyhello       latest              730effa82331        44 minutes ago      131MB
<none>              <none>              be8ab6ceffdf        About an hour ago   120MB
python              2.7-slim            0dc3d8d47241        13 days ago         120MB

```

标记镜像，`docker tag image_name user_name/repo_anme:tag_name`, tag_name自定义

```
$ docker tag friendlyhello:latest  ttingshuo/learn:part1

```

push 镜像，将已标记的镜像上传到 Docker Hub

```
$ docker push ttingshuo/learn:part1
The push refers to repository [docker.io/ttingshuo/learn]
5d3429d9971f: Pushed 
d1620421a986: Pushed 
584264dba175: Pushed 
6cffeea81e5d: Mounted from library/python 
614a79865f6d: Mounted from library/python 
612d27bb923f: Mounted from library/python 
ef68f6734aa4: Mounted from library/python 
part1: digest: sha256:7e802ec9772a45cb52b17177c383ca627d670531a1826bc07d1c9f1bd10fd114 size: 1788

```

运行 Docker Hub 上的镜像

```
docker run -p 4000:80 ttingshuo/learn:part1

```

常用命令

```
docker build -t friendlyname .# 使用此目录的 Dockerfile 创建镜像
docker run -p 4000:80 friendlyname  # 运行端口 4000 到 90 的“友好名称”映射
docker run -d -p 4000:80 friendlyname         # 内容相同，但在分离模式下
docker ps                                 # 查看所有正在运行的容器的列表
docker stop <hash>                     # 平稳地停止指定的容器
docker ps -a           # 查看所有容器的列表，甚至包含未运行的容器
docker kill <hash>                   # 强制关闭指定的容器
docker rm <hash>              # 从此机器中删除指定的容器
docker rm $(docker ps -a -q)           # 从此机器中删除所有容器
docker images -a                               # 显示此机器上的所有镜像
docker rmi <imagename>            # 从此机器中删除指定的镜像
docker rmi $(docker images -q)             # 从此机器中删除所有镜像
docker login             # 使用您的 Docker 凭证登录此 CLI 会话
docker tag <image> username/repository:tag  # 标记 <image> 以上传到镜像库
docker push username/repository:tag            # 将已标记的镜像上传到镜像库
docker run username/repository:tag                   # 运行镜像库中的镜像
```