// 数据库连接和初始化操作
const mongoose = require("mongoose");
const db = "mongodb://localhost/myBlog"; // 连接数据库
const glob = require("glob");
const { resolve } = require("path");

exports.initSchemas = () => {
  // 一次性引入所有schema模板，比一条条引入更方便优雅
  glob.sync(resolve(__dirname, "./schema", "**/*.js")).forEach(require);
};
exports.connect = () => {
  // export.xxxx 把这个connect封装函数暴露出去

  mongoose.set("useCreateIndex", true); //加上这个，防止警告
  mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

  let maxConnectTimes = 0; // 声明重新连接次数
  return new Promise((resolve, reject) => {
    // 调用connect函数会返回一个promise对象，根据 mongoose.connect连接的结果返回不同结果

    //增加数据库连接的事件监听，disconnected是断开连接事件
    mongoose.connection.on("disconnected", () => {
      console.log("-------------数据库断开-------------");
      if (maxConnectTimes < 3) {
        //当断开连接事件触发时，进行重连，最多重连三次
        maxConnectTimes++;
        mongoose.connect(db);
      } else {
        reject("出错啦1");
        throw new Error("数据库断开！重连三次均失败，请人为处理错误......");
      }
    });
    //数据库出现错误的时候，error是出错时触发的事件
    mongoose.connection.on("error", (err) => {
      console.log("------------------数据库错误------------");
      if (maxConnectTimes < 3) {
        maxConnectTimes++;
        mongoose.connect(db);
      } else {
        reject("出错啦2", err);
        throw new Error("数据库出现问题！重连三次均失败，请人为处理错误......");
      }
    });

    //连接成功打开的时候，open事件触发
    mongoose.connection.once("open", () => {
      console.log("MongoDB 数据库连接成功");
      resolve("成功啦");
    });
  });
};
