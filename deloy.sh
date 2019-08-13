#!/bin/bash

# 部署的服务器的地址
deloy_server=root@118.31.227.99

# 前端部署的地址
deloy_root_path=/opt/

# 代码的目录
code_path=egg-api

# 部署的目录
deloy_path=edu

# docker镜像
image=registry.cn-hangzhou.aliyuncs.com/yangpu/egg-web

# https://www.cnblogs.com/ilfmonday/p/ShellRemote.html;https://blog.csdn.net/wyl9527/article/details/72770455
ssh -Tq $deloy_server <<  remotessh

echo "进入目录：${deloy_root_path}${code_path}"
cd ${deloy_root_path}${code_path}
echo 拉取远程仓库
git pull
echo "打包镜像：$image"
docker build -t $image .
echo "进入部署目录：${deloy_root_path}${deloy_path}"
cd ${deloy_root_path}${deloy_path}
# 重启docker容器
docker-compose up -d

exit

remotessh
echo 部署完成！！
