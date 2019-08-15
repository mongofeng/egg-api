#!/usr/bin/env bash
# 备份的目录
date_name=$(date +%Y-%m-%d_%H:%M:%S)
backup_dir=/home/yangpu/backup/${date_name}

backup_tem=/opt/database-backup

#数据库
db=education

#数据库容器
container=database

#指定文件夹:https://blog.csdn.net/taiyangdao/article/details/71598935
echo 导出数据库:${db}
echo 导出数据库到容器临时内部:${backup_tem}
docker exec ${container} /bin/bash -c "mongodump  -d $db -o $backup_tem"  || exit

echo 复制文件到:${backup_dir}
docker cp ${container}:${backup_tem}  ${backup_dir} || exit
echo 导出成功

echo 删除备份目录:${backup_tem}
docker exec ${container} /bin/bash -c "rm -rf $backup_tem"

echo 删除成功


