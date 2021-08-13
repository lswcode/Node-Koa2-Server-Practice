const Router = require("koa-router");
let router = new Router();

const mongoose = require("mongoose");
const fs = require("fs");

router.get("/insertAllGoodsInfo", async (ctx) => {
  fs.readFile("./newGoods.json", "utf-8", (err, data) => {
    data = JSON.parse(data);
    let saveCount = 0;
    const Goods = mongoose.model("Goods");
    data.map((value, index) => {
      console.log(value);
      let newGoods = new Goods(value);
      newGoods
        .save()
        .then(() => {
          saveCount++;
          console.log("成功" + saveCount);
        })
        .catch((error) => {
          console.log(MediaStreamErrorEvent);
        });
    });
  });
  ctx.body = "开始导入数据";
});

module.exports = router;

// 这里出现bug  readFile一直出现undefined
