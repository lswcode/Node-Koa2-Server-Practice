const mongoose = require("mongoose"); //引入Mongoose
const Schema = mongoose.Schema; //声明Schema
let ObjectId = Schema.Types.ObjectId; //声明ObjectId类型  就是主键
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10; // 设置加密层级，越高越安全

//使用new Schema 创建用户Schema模板
const userSchema = new Schema(
  {
    UserId: ObjectId,
    userName: { unique: true, type: String },
    password: String,
    createAt: { type: Date, default: Date.now() },
    lastLoginAt: { type: Date, default: Date.now() },
  },
  {
    collection: "user", // 指定集合名
  }
);
userSchema.pre("save", function (next) {
  // pre是Mongoose中间件，用来控制异步文档操作中的 'init，save，validate，remove' 方法
  // 每次保存时都进行加密
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next(); // next让中间件继续执行，正常执行后续的代码
    });
  });
});

userSchema.methods = {
  //密码比对的方法
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch);
        else reject(err);
      });
    });
  },
};

// 发布模型，创建Model对象，模型名为User 采用的模板为userSchema
// model相当于数据库中的集合，User相当于集合名
mongoose.model("User", userSchema);
