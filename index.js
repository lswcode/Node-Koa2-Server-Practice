const Koa = require("koa");
const app = new Koa();
const { connect, initSchemas } = require("./database/init.js");
const cors = require("koa2-cors");
const mongoose = require("mongoose");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
//引入connect模块
app.use(cors()); // 允许跨域，要在使用路由之前就先注册好
app.use(bodyParser()); // 要在下面这两个使用路由前先注册，路由先使用注册好了，再注册这个就无效了

let user = require("./appApi/user.js"); // 将引入的路由命名为user
let goods = require("./appApi/goods.js");
let router = new Router();
router.use("/user", user.routes()); // 将引入的user路由作为子路由，/user就是子路由的基础路径
router.use("/goods", goods.routes());

app.use(router.routes()); // 这两句是必须写的，写了路由才能启用
app.use(router.allowedMethods());

// ---------------------------------------------------------------------------------------------------

// 这是一个立即执行函数
(async () => {
  let data = await connect(); // 使用await接收数据库连接的返回的结果，这是一个异步任务，需要一定时间才能执行完毕
  console.log(data); // 这个只会打印一次，所以需要在init的监听事件中打印
  initSchemas(); // 引入schema模板

  // mongoose插入一条数据的格式
  const User = mongoose.model("User"); // 创建一个模型
  let oneUser = new User({ userName: "jspang100", password: "123456" }); // 在User这个模型中插入数据
  oneUser.save().then(() => {
    // 保存
    console.log("插入成功");
  });
  let findUser = await User.findOne({ userName: "jspang" });
  console.log("------------------");
  console.log(findUser);
  console.log("------------------");
})();

app.use(async (ctx) => {
  ctx.body = "<h1>hello Koa2</h1>";
});

app.listen(3000, () => {
  console.log("[Server] starting at port 3000");
});
