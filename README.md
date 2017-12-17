# mcharts

## 环境

node.js >= 6.0.0

redis >= 2.8.0

redis下载地址： https://redis.io/download

redis启动地址： https://www.cnblogs.com/shoren/p/redis.html

```

进入redis目录

winodws redis/64bit

mac redis/etc

一个窗口

redis-server redis.conf 

另启一个窗口

redis-cli -h 127.0.0.1 -p 6379


```


## 第一步

打开监控对象

```

git clone https://github.com/hua1995116/mcharts.git

cd mcharts

npm install 

node express.js

```

查看 http://127.0.0.1:3000/ (这里必须是127.0.0.1或者你主机ip地址为了给后续的ip收集使用)

等10秒钟。

## 第二步

解析数据

```

node parse.js

```

## 第三步

可视化系统

```

cd charts

node index.js

```

查看 http://127.0.0.1:8888/