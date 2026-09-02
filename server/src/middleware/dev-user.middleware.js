import { User } from "../models/user.model.js";

const DEV_EMAIL = "dev@example.com";

// ^TEMPORARY: stands in for real authentication.
// ^Delete this file and its app.js wiring once auth middleware exists.
export const attachDevUser = async (req, res, next) => {
  let user = await User.findOne({ email: DEV_EMAIL });

  if (!user) {
    user = await User.create({
      name: "Dev User",
      email: DEV_EMAIL,
      password: "123123qwe",
      role: "admin",
    });
  }

  req.user = { id: user._id, role: user.role };
  next();
};
