const authRouter = require("./authRoutes.js");
const aclRouter = require("./aclRoutes.js");
const userRouter = require("./userRoutes.js");
const roleRouter = require("./roleRoutes.js");
const permissionRouter = require("./permissionRoutes.js");
const taskRouter = require("./taskRoutes.js");

module.exports = (app) => {
  app.use(
    authRouter,
    aclRouter,
    userRouter,
    roleRouter,
    permissionRouter,
    taskRouter,
  );
};
